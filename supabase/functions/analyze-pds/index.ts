import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";
import { encode as encodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry helper for transient storage errors
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      const isLastRetry = i === maxRetries - 1;
      const isRetryableError = 
        error?.name === 'StorageUnknownError' || 
        error?.originalError?.status === 504 ||
        error?.originalError?.status === 503;
      
      if (isLastRetry || !isRetryableError) {
        throw error;
      }
      
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms due to:`, error?.message ?? error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

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

    // Download with retry logic for transient failures
    const pdfData = await retryWithBackoff(async () => {
      const { data, error } = await supabase.storage
        .from('pds-documents')
        .download(pdfPath);
      
      if (error) throw error;
      return data;
    }, 3, 2000);

    if (!pdfData) {
      throw new Error('Failed to download PDF after retries');
    }

    console.log('PDF downloaded, size:', pdfData.size);

    // Check file size limit (10MB)
    const MAX_PDF_SIZE = 10 * 1024 * 1024;
    if (pdfData.size > MAX_PDF_SIZE) {
      return new Response(
        JSON.stringify({ error: 'PDF too large for analysis. Please upload a file smaller than 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert PDF to base64 efficiently using Deno's standard encoder
    const arrayBuffer = await pdfData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Pdf = encodeBase64(uint8Array as any);
    console.log('PDF converted to base64, length:', base64Pdf.length);

    console.log('Calling Lovable AI for analysis...');

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const jsonSchema = `{
  "summary": "string",
  "definitions": [{"term": "string", "definition": "string"}],
  "key_benefits": {"benefit_name": {"covered": true/false, "notes": "string", "pds_reference": "string"}},
  "coverage_details": {"maximum_cover": "string", "geographic_limits": ["string"], "cover_types": ["string"]},
  "exclusions": [{"title": "string", "description": "string", "pds_reference": "string"}],
  "claims_process": {"requirements": ["string"], "steps": ["string"]},
  "obligations": [{"title": "string", "details": "string", "pds_reference": "string"}],
  "faq": {"questions": [{"category": "string", "question": "string", "answer": "string", "pds_reference": "string"}]},
  "full_content": [{"heading": "string", "body": "string", "page": number}]
}`;

    const systemPrompt = `You extract structured fields from a Product Disclosure Statement (PDS). Reply with ONLY valid JSON, no extra text or markdown. Extract comprehensive information including all sections, exclusions, FAQ entries, monetary amounts, definitions, claims process, and member obligations with accurate PDS references.`;
    
    const userPrompt = `Analyze this PDS PDF (base64): ${base64Pdf}

Extract the following JSON structure:
${jsonSchema}

Rules:
- Return ONLY valid JSON, no markdown code blocks
- Include as many exclusions as you can find (aim for 28+)
- Include comprehensive FAQ entries (aim for 15+)
- Include all monetary amounts mentioned
- Include accurate PDS section references
- Keep data comprehensive but well-structured`;

    let extractedData;
    let modelUsed = 'google/gemini-2.5-flash';

    // Try with Gemini first
    try {
      console.log(`Attempting analysis with ${modelUsed}...`);
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error(`${modelUsed} API Error (${aiResponse.status}):`, errorText);
        
        // Handle specific gateway errors
        if (aiResponse.status === 429) {
          throw new Error('Rate limits exceeded. Please retry in a minute.');
        }
        if (aiResponse.status === 402) {
          throw new Error('AI credits exhausted. Please add credits to your workspace.');
        }
        
        // For 400/500 errors, try fallback to GPT
        if (aiResponse.status === 400 || aiResponse.status >= 500) {
          console.log('Falling back to openai/gpt-5-mini...');
          modelUsed = 'openai/gpt-5-mini';
          
          const fallbackResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${lovableApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelUsed,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ]
            })
          });

          if (!fallbackResponse.ok) {
            const fallbackError = await fallbackResponse.text();
            console.error(`${modelUsed} fallback also failed:`, fallbackError);
            throw new Error(`AI analysis failed with both models: ${fallbackResponse.status}`);
          }

          const fallbackResult = await fallbackResponse.json();
          console.log(`Analysis complete with fallback model: ${modelUsed}`);
          extractedData = parseAIResponse(fallbackResult);
        } else {
          throw new Error(`AI analysis failed: ${aiResponse.status} - ${errorText}`);
        }
      } else {
        const aiResult = await aiResponse.json();
        console.log(`Analysis complete with ${modelUsed}`);
        extractedData = parseAIResponse(aiResult);
      }
    } catch (error: any) {
      console.error('AI analysis error:', error);
      // If all AI attempts fail, insert minimal record so upload doesn't hard-fail
      console.log('Inserting minimal PDS record due to AI failure...');
      const { data: minimalRecord, error: insertError } = await supabase
        .from('product_disclosure_statements')
        .insert({
          pdf_file_path: pdfPath,
          pdf_file_name: pdfPath.split('/').pop(),
          pdf_file_size: pdfData.size,
          is_active: true,
          summary: 'AI extraction pending - please re-analyze this document',
          full_content: {},
          faq: { questions: [] }
        })
        .select()
        .single();

      if (insertError) {
        console.error('Minimal insert error:', insertError);
        throw insertError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: minimalRecord,
          warning: 'PDF uploaded but AI analysis failed. Please try re-analyzing.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Helper function to parse AI response
    function parseAIResponse(aiResult: any) {
      const content = aiResult.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in AI response');
      }

      // Try direct JSON parse first
      try {
        return JSON.parse(content);
      } catch {
        // Try to extract JSON from markdown code blocks or text
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            return JSON.parse(jsonMatch[0]);
          } catch {
            throw new Error('Failed to parse extracted JSON block');
          }
        }
        throw new Error('No valid JSON found in AI response');
      }
    }

    console.log('Inserting PDS record into database...');

    // Insert into database with extracted content mapped to known columns only
    // Note: version_number and effective_from are set automatically by database triggers
    const { data: pdsRecord, error: insertError } = await supabase
      .from('product_disclosure_statements')
      .insert({
        pdf_file_path: pdfPath,
        pdf_file_name: pdfPath.split('/').pop(),
        pdf_file_size: pdfData.size,
        is_active: true,
        summary: extractedData.summary ?? null,
        key_benefits: extractedData.key_benefits ?? null,
        coverage_details: extractedData.coverage_details ?? null,
        exclusions: extractedData.exclusions ?? null,
        faq: extractedData.faq ?? { questions: [] },
        full_content: extractedData.full_content ?? { raw: extractedData },
        conditions: extractedData.conditions ?? null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
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