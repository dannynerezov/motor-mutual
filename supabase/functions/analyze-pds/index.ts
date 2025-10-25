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
    const { pdfPath } = await req.json();
    
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
            content: `You are an expert insurance document analyst specializing in Motor Cover Mutual Product Disclosure Statements.
            
            Your task is to extract COMPREHENSIVE, DETAILED, and ACCURATE information from the entire PDS document.
            
            CRITICAL REQUIREMENTS:
            1. Extract ALL 11 major sections with proper hierarchy and subsections
            2. Capture ALL 28 exclusions with specific details and conditions
            3. Create 15+ FAQ entries with ACCURATE PDS section and page references
            4. Extract ALL monetary amounts ($650 towing, $1000 under-25 excess, $2000 hail/flood excess, $1 winding up liability)
            5. Capture ALL definitions from the glossary (15+ terms)
            6. Detail the complete claims process with all steps
            7. Include all financial information (contributions, surplus policy, proportional claims, winding up liability)
            8. Document member obligations and responsibilities
            9. Include complete complaints and dispute resolution process
            10. Detail cancellation terms and cooling off period
            
            ACCURACY: Every FAQ answer MUST include accurate PDS references (e.g., "Section 1.7.24, Page 13").
            COMPLETENESS: Do not summarize or skip details. Extract everything comprehensively.`
          },
          {
            role: 'user',
            content: `Analyze this complete Product Disclosure Statement PDF and extract all information according to the specified JSON structure. The full PDF content in base64 format is: ${base64Pdf}`
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
                  document_metadata: {
                    type: "object",
                    properties: {
                      version_number: { type: "string" },
                      effective_date: { type: "string" },
                      issuer: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          acn: { type: "string" },
                          address: { type: "string" }
                        }
                      },
                      afsl_holder: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          acn: { type: "string" },
                          afsl: { type: "string" }
                        }
                      },
                      contact_details: {
                        type: "object",
                        properties: {
                          phone: { type: "string" },
                          membership_email: { type: "string" },
                          claims_email: { type: "string" },
                          complaints_email: { type: "string" }
                        }
                      }
                    }
                  },
                  summary: {
                    type: "string",
                    description: "A comprehensive 2-3 sentence summary of the entire PDS"
                  },
                  definitions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        term: { type: "string" },
                        definition: { type: "string" }
                      },
                      required: ["term", "definition"]
                    },
                    minItems: 15
                  },
                  full_content: {
                    type: "object",
                    properties: {
                      sections: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            section_number: { type: "string" },
                            title: { type: "string" },
                            content: { type: "string" },
                            page_numbers: { type: "array", items: { type: "number" } },
                            subsections: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  subsection_number: { type: "string" },
                                  title: { type: "string" },
                                  content: { type: "string" },
                                  page_number: { type: "number" }
                                },
                                required: ["title", "content", "page_number"]
                              }
                            }
                          },
                          required: ["title", "content", "page_numbers"]
                        },
                        minItems: 11
                      }
                    },
                    required: ["sections"]
                  },
                  coverage_types: {
                    type: "object",
                    properties: {
                      comprehensive_cover: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          includes: { type: "array", items: { type: "string" } },
                          limitations: { type: "array", items: { type: "string" } },
                          pds_reference: { type: "string" }
                        },
                        required: ["description", "includes", "pds_reference"]
                      },
                      third_party_property_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          excludes: { type: "array", items: { type: "string" } },
                          pds_reference: { type: "string" }
                        },
                        required: ["description", "excludes", "pds_reference"]
                      }
                    },
                    required: ["comprehensive_cover", "third_party_property_damage"]
                  },
                  key_benefits: {
                    type: "object",
                    properties: {
                      collision_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      },
                      flood_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      },
                      fire_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      },
                      theft: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      },
                      storm_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      },
                      hail_damage: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          covered: { type: "boolean" },
                          conditions: { type: "array", items: { type: "string" } },
                          icon: { type: "string" }
                        },
                        required: ["description", "covered"]
                      }
                    },
                    required: ["collision_damage", "flood_damage", "fire_damage", "theft", "storm_damage", "hail_damage"]
                  },
                  financial_information: {
                    type: "object",
                    properties: {
                      contributions: {
                        type: "object",
                        properties: {
                          basis: { type: "string" },
                          payment_frequency: { type: "string" },
                          payment_methods: { type: "array", items: { type: "string" } },
                          tax_treatment: { type: "string" },
                          overdue_consequences: { type: "array", items: { type: "string" } },
                          pds_reference: { type: "string" }
                        },
                        required: ["basis", "payment_frequency", "pds_reference"]
                      },
                      surplus_policy: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          member_entitlement: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["description", "pds_reference"]
                      },
                      proportional_claims: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          basis: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["description", "pds_reference"]
                      },
                      winding_up_liability: {
                        type: "object",
                        properties: {
                          amount: { type: "string" },
                          condition: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["amount", "condition", "pds_reference"]
                      }
                    },
                    required: ["contributions", "surplus_policy", "proportional_claims", "winding_up_liability"]
                  },
                  coverage_details: {
                    type: "object",
                    properties: {
                      maximum_cover: { type: "string", description: "e.g., 'Market Value' or specific dollar amount" },
                      currency: { type: "string" },
                      geographic_limitations: { type: "string" },
                      coverage_types: { type: "array", items: { type: "string" } }
                    },
                    required: ["maximum_cover", "currency", "geographic_limitations"]
                  },
                  exclusions: {
                    type: "object",
                    properties: {
                      general_exclusions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            exclusion_id: { type: "string" },
                            title: { type: "string" },
                            description: { type: "string" },
                            conditions: { type: "array", items: { type: "string" } },
                            pds_reference: { type: "string" }
                          },
                          required: ["exclusion_id", "title", "description", "pds_reference"]
                        },
                        minItems: 28
                      }
                    },
                    required: ["general_exclusions"]
                  },
                  excess: {
                    type: "object",
                    properties: {
                      definition: { type: "string" },
                      basic_excess: { type: "string" },
                      additional_excesses: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: { type: "string" },
                            amount: { type: "number" },
                            multiplier: { type: "number" },
                            applies_to: { type: "string" },
                            stacks_with_basic: { type: "boolean" }
                          },
                          required: ["type", "applies_to"]
                        },
                        minItems: 5
                      },
                      payment_timing: { type: "string" },
                      refund_policy: { type: "string" },
                      pds_reference: { type: "string" }
                    },
                    required: ["definition", "additional_excesses", "payment_timing", "pds_reference"]
                  },
                  claims_process: {
                    type: "object",
                    properties: {
                      reporting: {
                        type: "object",
                        properties: {
                          method: { type: "string" },
                          email: { type: "string" },
                          timeframe: { type: "string" },
                          note: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["method", "email", "timeframe", "pds_reference"]
                      },
                      must_do_steps: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 6
                      },
                      must_not_do: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 5
                      },
                      settlement_options: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 3
                      },
                      discretion_notice: { type: "string" },
                      decision_timeframe: { type: "string" },
                      pds_reference: { type: "string" }
                    },
                    required: ["reporting", "must_do_steps", "must_not_do", "settlement_options", "pds_reference"]
                  },
                  member_obligations: {
                    type: "object",
                    properties: {
                      disclosure_obligations: {
                        type: "object",
                        properties: {
                          requirement: { type: "string" },
                          affects: { type: "array", items: { type: "string" } },
                          consequences_of_non_disclosure: { type: "array", items: { type: "string" } },
                          pds_reference: { type: "string" }
                        },
                        required: ["requirement", "affects", "pds_reference"]
                      },
                      responsibilities: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 6
                      },
                      special_conditions: {
                        type: "object",
                        properties: {
                          description: { type: "string" },
                          examples: { type: "array", items: { type: "string" } },
                          disclosure: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["description", "pds_reference"]
                      }
                    },
                    required: ["disclosure_obligations", "responsibilities", "special_conditions"]
                  },
                  complaints_dispute_resolution: {
                    type: "object",
                    properties: {
                      internal_process: {
                        type: "object",
                        properties: {
                          first_step: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["first_step", "pds_reference"]
                      },
                      external_dispute_resolution: {
                        type: "object",
                        properties: {
                          provider: { type: "string" },
                          eligibility: { type: "string" },
                          cost: { type: "string" },
                          contact: {
                            type: "object",
                            properties: {
                              email: { type: "string" },
                              phone: { type: "string" },
                              online: { type: "string" }
                            }
                          },
                          binding_on: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["provider", "contact", "pds_reference"]
                      }
                    },
                    required: ["internal_process", "external_dispute_resolution"]
                  },
                  cancellation_changes: {
                    type: "object",
                    properties: {
                      cooling_off_period: {
                        type: "object",
                        properties: {
                          duration: { type: "string" },
                          refund: { type: "string" },
                          method: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["duration", "refund", "pds_reference"]
                      },
                      cancellation_by_member: {
                        type: "object",
                        properties: {
                          notice_required: { type: "string" },
                          method: { type: "string" },
                          consequence: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["notice_required", "pds_reference"]
                      },
                      changing_details: {
                        type: "object",
                        properties: {
                          requirement: { type: "string" },
                          includes: { type: "array", items: { type: "string" } },
                          method: { type: "string" },
                          pds_reference: { type: "string" }
                        },
                        required: ["requirement", "pds_reference"]
                      }
                    },
                    required: ["cooling_off_period", "cancellation_by_member", "changing_details"]
                  },
                  conditions: {
                    type: "object",
                    properties: {
                      discretionary_conditions: { type: "array", items: { type: "string" } },
                      member_obligations: { type: "array", items: { type: "string" } }
                    }
                  },
                  faq: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            category: { type: "string", description: "e.g., Product Type, Coverage, Exclusions, Excess, Membership, Financial, Claims, Obligations, Complaints, Cancellation" },
                            question: { type: "string" },
                            answer: { type: "string" },
                            pds_reference: { type: "string", description: "MUST include specific section number AND page number (e.g., 'Section 1.7.24, Page 13')" }
                          },
                          required: ["category", "question", "answer", "pds_reference"]
                        },
                        minItems: 15
                      }
                    },
                    required: ["questions"]
                  }
                },
                required: ["document_metadata", "summary", "definitions", "full_content", "coverage_types", "key_benefits", "financial_information", "coverage_details", "exclusions", "excess", "claims_process", "member_obligations", "complaints_dispute_resolution", "cancellation_changes", "faq"],
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
