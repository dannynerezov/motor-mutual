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

  // Generate unique request ID for correlation
  const requestId = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const startedAt = Date.now();
  
  // Structured logging helper
  const log = (step: string, details?: Record<string, unknown>) => {
    console.log(JSON.stringify({ requestId, step, timestamp: new Date().toISOString(), ...(details ?? {}) }));
  };

  try {
    const { pdfPath } = await req.json();
    log('REQUEST_START', { pdfPath });

    log('STORAGE_DOWNLOAD_START', { pdfPath });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download with retry logic for transient failures
    let pdfData;
    try {
      pdfData = await retryWithBackoff(async () => {
        const { data, error } = await supabase.storage
          .from('pds-documents')
          .download(pdfPath);
        
        if (error) throw error;
        return data;
      }, 3, 2000);

      if (!pdfData) {
        throw new Error('Failed to download PDF after retries');
      }

      log('STORAGE_DOWNLOAD_OK', { size: pdfData.size, type: pdfData.type });
    } catch (e: any) {
      log('STORAGE_DOWNLOAD_ERROR', { message: e.message });
      return new Response(JSON.stringify({
        error: 'Failed to download PDF from storage',
        code: 'STORAGE_DOWNLOAD_FAILED',
        step: 'STORAGE_DOWNLOAD',
        requestId
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
    }

    // Check file size limit (10MB)
    const MAX_PDF_SIZE = 10 * 1024 * 1024;
    if (pdfData.size > MAX_PDF_SIZE) {
      log('FILE_SIZE_ERROR', { size: pdfData.size, limit: MAX_PDF_SIZE });
      return new Response(
        JSON.stringify({ 
          error: 'PDF too large for analysis. Please upload a file smaller than 10MB.',
          code: 'FILE_TOO_LARGE',
          step: 'FILE_SIZE_CHECK',
          requestId
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId } }
      );
    }

    // Convert PDF to base64 efficiently using Deno's standard encoder
    log('BASE64_ENCODE_START', { size: pdfData.size, type: pdfData.type });
    let base64Pdf;
    try {
      const arrayBuffer = await pdfData.arrayBuffer();
      log('ARRAYBUFFER_OK', { byteLength: arrayBuffer.byteLength });
      
      const uint8Array = new Uint8Array(arrayBuffer);
      log('UINT8ARRAY_OK', { length: uint8Array.length, firstByte: uint8Array[0] });
      
      base64Pdf = encodeBase64(uint8Array as any);
      log('BASE64_ENCODE_OK', { base64Length: base64Pdf.length });
    } catch (e: any) {
      log('BASE64_ENCODE_ERROR', { 
        message: e.message, 
        name: e.name,
        stack: e.stack?.slice(0, 500)
      });
      return new Response(JSON.stringify({
        error: 'Failed to convert PDF to base64',
        code: 'BASE64_ENCODE_FAILED',
        step: 'BASE64_ENCODE',
        requestId,
        details: e.message
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
    }

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
      log('AI_REQUEST_START', { model: modelUsed, base64Length: base64Pdf.length });
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
        log('AI_REQUEST_ERROR', { 
          model: modelUsed, 
          status: aiResponse.status, 
          bodyPreview: errorText.slice(0, 300) 
        });
        
        // Handle specific gateway errors
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({
            error: 'Rate limits exceeded. Please retry in a minute.',
            code: 'AI_RATE_LIMITED',
            step: 'AI_REQUEST',
            requestId
          }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({
            error: 'AI credits exhausted. Please add credits to your workspace.',
            code: 'AI_PAYMENT_REQUIRED',
            step: 'AI_REQUEST',
            requestId
          }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
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
            log('AI_FALLBACK_ERROR', { model: modelUsed, status: fallbackResponse.status });
            return new Response(JSON.stringify({
              error: `AI analysis failed with both models: ${fallbackResponse.status}`,
              code: 'AI_REQUEST_FAILED',
              step: 'AI_REQUEST',
              requestId
            }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
          }

          const fallbackResult = await fallbackResponse.json();
          log('AI_REQUEST_OK', { model: modelUsed });
          extractedData = parseAIResponse(fallbackResult);
        } else {
          return new Response(JSON.stringify({
            error: `AI analysis failed: ${aiResponse.status} - ${errorText}`,
            code: 'AI_REQUEST_FAILED',
            step: 'AI_REQUEST',
            requestId
          }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
        }
      } else {
        const aiResult = await aiResponse.json();
        log('AI_REQUEST_OK', { model: modelUsed });
        extractedData = parseAIResponse(aiResult);
      }
    } catch (error: any) {
      log('AI_ANALYSIS_ERROR', { message: error.message });
      // If all AI attempts fail, insert minimal record so upload doesn't hard-fail
      log('DB_INSERT_START', { type: 'minimal' });
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
        log('DB_INSERT_ERROR', { message: insertError.message, type: 'minimal' });
        return new Response(JSON.stringify({
          error: insertError.message,
          code: 'DB_INSERT_FAILED',
          step: 'DB_INSERT',
          requestId
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
      }

      log('DB_INSERT_OK', { id: minimalRecord.id, type: 'minimal' });
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: minimalRecord,
          requestId,
          warning: 'PDF uploaded but AI analysis failed. Please try re-analyzing.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId } }
      );
    }

    // Helper function to parse AI response
    function parseAIResponse(aiResult: any) {
      try {
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
      } catch (e: any) {
        log('AI_PARSE_ERROR', { message: e.message });
        throw e;
      }
    }

    log('DB_INSERT_START', { type: 'full' });

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
      log('DB_INSERT_ERROR', { message: insertError.message, type: 'full' });
      return new Response(JSON.stringify({
        error: insertError.message,
        code: 'DB_INSERT_FAILED',
        step: 'DB_INSERT',
        requestId
      }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId }});
    }

    const elapsed = Date.now() - startedAt;
    log('DB_INSERT_OK', { id: pdsRecord.id, type: 'full', elapsedMs: elapsed });

    return new Response(
      JSON.stringify({ success: true, data: pdsRecord, requestId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId } }
    );

  } catch (error: any) {
    log('UNHANDLED_ERROR', { message: error.message, stack: error.stack?.slice(0, 500) });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        code: 'UNKNOWN',
        step: 'UNHANDLED',
        requestId
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': requestId } }
    );
  }
});