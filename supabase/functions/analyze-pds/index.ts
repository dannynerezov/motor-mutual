import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfPath, versionNumber, effectiveFrom } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Downloading PDF from storage:', pdfPath);
    
    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('pds-documents')
      .download(pdfPath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw downloadError;
    }

    console.log('PDF downloaded, size:', pdfData.size);

    // Convert PDF to base64 using chunked approach to avoid stack overflow
    const arrayBuffer = await pdfData.arrayBuffer();
    
    function arrayBufferToBase64(buffer: ArrayBuffer): string {
      const bytes = new Uint8Array(buffer);
      const chunkSize = 8192; // 8KB chunks
      let binary = '';
      
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode(...chunk);
      }
      
      return btoa(binary);
    }
    
    const base64Pdf = arrayBufferToBase64(arrayBuffer);

    console.log('Calling Lovable AI for analysis...');

    // Call Lovable AI to analyze the PDF
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an insurance document analyst. Extract comprehensive information from Product Disclosure Statements.
            
            Return a JSON object with this exact structure:
            {
              "full_content": {
                "sections": [{"title": "...", "content": "...", "page_number": 1}]
              },
              "summary": "Brief 2-3 sentence summary",
              "key_benefits": {
                "collision_damage": {"covered": true, "description": "...", "conditions": [], "icon": "car-crash"},
                "flood_damage": {"covered": true, "description": "...", "conditions": [], "icon": "droplets"},
                "fire_damage": {"covered": true, "description": "...", "conditions": [], "icon": "flame"},
                "theft": {"covered": true, "description": "...", "conditions": [], "icon": "shield-alert"},
                "storm_damage": {"covered": true, "description": "...", "conditions": [], "icon": "cloud-rain"},
                "hail_damage": {"covered": true, "description": "...", "conditions": [], "icon": "cloud-hail"}
              },
              "coverage_details": {
                "maximum_cover": 50000,
                "currency": "AUD",
                "coverage_types": [],
                "geographic_limitations": "..."
              },
              "exclusions": {
                "general_exclusions": [],
                "specific_exclusions": {}
              },
              "conditions": {
                "discretionary_conditions": [],
                "member_obligations": []
              }
            }
            
            Be thorough and extract ALL relevant information.`
          },
          {
            role: 'user',
            content: `Analyze this Product Disclosure Statement PDF (base64: ${base64Pdf.substring(0, 100)}...) and extract all information according to the specified JSON structure. Pay special attention to coverage for: collision damage, flood, fire, theft, storms, and hail.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_pds_content",
              description: "Extract structured content from PDS document",
              parameters: {
                type: "object",
                properties: {
                  full_content: { type: "object" },
                  summary: { type: "string" },
                  key_benefits: { type: "object" },
                  coverage_details: { type: "object" },
                  exclusions: { type: "object" },
                  conditions: { type: "object" }
                },
                required: ["full_content", "summary", "key_benefits", "coverage_details", "exclusions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_pds_content" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log('AI analysis complete');
    
    const extractedData = JSON.parse(
      aiResult.choices[0].message.tool_calls[0].function.arguments
    );

    console.log('Inserting PDS record into database...');

    // Insert into database
    const { data: pdsRecord, error: insertError } = await supabase
      .from('product_disclosure_statements')
      .insert({
        version_number: versionNumber,
        pdf_file_path: pdfPath,
        pdf_file_name: pdfPath.split('/').pop(),
        pdf_file_size: pdfData.size,
        effective_from: effectiveFrom,
        is_active: true,
        ...extractedData
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('PDS record created successfully:', pdsRecord.id);

    return new Response(
      JSON.stringify({ success: true, data: pdsRecord }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-pds:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
