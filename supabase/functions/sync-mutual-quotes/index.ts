import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Source: the No-Database Webform project
    const SOURCE_URL = "https://awbriepfpiaxkovdvqcx.supabase.co";
    const SOURCE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YnJpZXBmcGlheGtvdmR2cWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzA0MjMsImV4cCI6MjA3NzgwNjQyM30.ee3aHbAZObWrtEaEks9EV66Btm41Da6vxbxbvwxHQGY";

    // Destination: this project
    const DEST_URL = Deno.env.get("SUPABASE_URL")!;
    const DEST_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const source = createClient(SOURCE_URL, SOURCE_ANON_KEY);
    const dest = createClient(DEST_URL, DEST_SERVICE_KEY);

    // Fetch completed mutual_quotes from source (those with a TPPD winning ref)
    const { data: sourceQuotes, error: sourceError } = await source
      .from("mutual_quotes")
      .select(
        "deal_id, comp_total_annual, mutual_target_price, mutual_membership_price, tppd_winning_premium, tppd_winning_quote_ref, tppd_winning_insurer, tppd_status, vehicle_state, created_at, updated_at"
      )
      .not("tppd_winning_quote_ref", "is", null)
      .order("created_at", { ascending: false })
      .limit(500);

    if (sourceError) {
      throw new Error(`Source fetch failed: ${sourceError.message}`);
    }

    if (!sourceQuotes || sourceQuotes.length === 0) {
      return new Response(
        JSON.stringify({ success: true, synced: 0, message: "No quotes to sync" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch vehicle info from source form3_submissions
    const dealIds = sourceQuotes.map((q) => q.deal_id).filter(Boolean);
    let vehicleMap: Record<string, { vehicle_make: string | null; vehicle_model: string | null; vehicle_year: string | null; comp_benchmark_price: number | null }> = {};

    if (dealIds.length > 0) {
      // Fetch in batches to avoid URL length limits
      const FETCH_BATCH = 100;
      for (let i = 0; i < dealIds.length; i += FETCH_BATCH) {
        const batch = dealIds.slice(i, i + FETCH_BATCH);
        const { data: form3 } = await source
          .from("form3_submissions")
          .select("deal_id, vehicle_make, vehicle_model, vehicle_year")
          .in("deal_id", batch);

        if (form3) {
          form3.forEach((f: any) => {
            if (f.deal_id) {
              vehicleMap[f.deal_id] = {
                vehicle_make: f.vehicle_make,
                vehicle_model: f.vehicle_model,
                vehicle_year: f.vehicle_year,
              };
            }
          });
        }
      }
    }

    const records = sourceQuotes.map((q) => ({
      deal_id: q.deal_id,
      comp_total_annual: q.comp_total_annual,
      comp_benchmark_price: q.comp_benchmark_price ?? q.comp_total_annual,
      mutual_target_price: q.mutual_target_price,
      mutual_membership_price: q.mutual_membership_price,
      tppd_winning_premium: q.tppd_winning_premium,
      tppd_winning_quote_ref: q.tppd_winning_quote_ref,
      tppd_winning_insurer: q.tppd_winning_insurer,
      tppd_status: q.tppd_status,
      vehicle_state: q.vehicle_state,
      vehicle_make: vehicleMap[q.deal_id]?.vehicle_make ?? null,
      vehicle_model: vehicleMap[q.deal_id]?.vehicle_model ?? null,
      vehicle_year: vehicleMap[q.deal_id]?.vehicle_year ?? null,
      created_at: q.created_at,
      updated_at: q.updated_at,
    }));

    // Upsert in batches of 50
    let synced = 0;
    const BATCH_SIZE = 50;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      const { error: upsertError } = await dest
        .from("mutual_quotes")
        .upsert(batch, { onConflict: "deal_id" });

      if (upsertError) {
        console.error(`Upsert batch error:`, upsertError.message);
      } else {
        synced += batch.length;
      }
    }

    console.log(`[sync-mutual-quotes] Synced ${synced}/${records.length} quotes`);

    return new Response(
      JSON.stringify({ success: true, synced, total: records.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[sync-mutual-quotes] Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
