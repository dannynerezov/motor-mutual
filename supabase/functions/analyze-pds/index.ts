import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfPath } = await req.json();

    console.log('Downloading PDF from storage:', pdfPath);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('pds-documents')
      .download(pdfPath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw downloadError;
    }

    console.log('PDF downloaded, size:', pdfData.size);

    // Convert PDF to base64 in chunks to avoid stack overflow
    const arrayBuffer = await pdfData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let base64Pdf = '';
    const chunkSize = 1000000;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      base64Pdf += btoa(String.fromCharCode(...chunk));
    }

    console.log('Calling Lovable AI for analysis...');

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const aiResponse = await fetch('https://app.lovable.app/api/ai', {
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
            content: `Extract comprehensive information from this Motor Cover Mutual PDS. Include all sections, exclusions (aim for 28+), FAQ entries (aim for 15+), monetary amounts, definitions, claims process, and member obligations with accurate PDS references.`
          },
          {
            role: 'user',
            content: `Analyze this PDS PDF (base64): ${base64Pdf}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_pds_content",
              description: "Extract structured content from PDS",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  definitions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        term: { type: "string" },
                        definition: { type: "string" }
                      }
                    }
                  },
                  full_content: { type: "object" },
                  key_benefits: { type: "object" },
                  coverage_details: { type: "object" },
                  exclusions: { type: "object" },
                  conditions: { type: "object" },
                  faq: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            category: { type: "string" },
                            question: { type: "string" },
                            answer: { type: "string" },
                            pds_reference: { type: "string" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ],
        tool_choice: {
          type: "function",
          function: { name: "extract_pds_content" }
        }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log('AI analysis complete');

    let extractedData;
    if (aiResult.choices && aiResult.choices[0]?.message?.tool_calls) {
      const toolCall = aiResult.choices[0].message.tool_calls[0];
      extractedData = JSON.parse(toolCall.function.arguments);
    } else {
      throw new Error('Unexpected AI response format');
    }

    console.log('Inserting PDS record into database...');

    // Insert into database with extracted content
    // Note: version_number and effective_from are set automatically by database triggers
    const { data: pdsRecord, error: insertError } = await supabase
      .from('product_disclosure_statements')
      .insert({
        pdf_file_path: pdfPath,
        pdf_file_name: pdfPath.split('/').pop(),
        pdf_file_size: pdfData.size,
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