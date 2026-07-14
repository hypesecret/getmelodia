import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { questionnaireSchema, buildSummary } from "./wizard-schemas";
import { PLANS, type PlanKey } from "./packs";

const createOrderInput = z.object({
  questionnaire: questionnaireSchema,
  plan: z.enum(["essentiel", "signature", "legende"]),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createOrderInput.parse(input))
  .handler(async ({ data, context }) => {
    const plan: PlanKey = data.plan;
    const summary = buildSummary(data.questionnaire);
    const { data: order, error } = await context.supabase
      .from("song_orders")
      .insert({
        user_id: context.userId,
        pack_slug: data.questionnaire.pack_slug,
        questionnaire: data.questionnaire,
        summary,
        plan,
        amount_fcfa: PLANS[plan].price,
        status: "draft",
      })
      .select()
      .single();
    if (error) throw error;
    return { orderId: order.id };
  });

const simulatePaymentInput = z.object({
  orderId: z.string().uuid(),
  operator: z.enum(["orange", "airtel", "mpesa", "africell"]),
  phone: z.string().trim().min(6).max(20),
});

export const simulatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => simulatePaymentInput.parse(input))
  .handler(async ({ data, context }) => {
    const { runSunoForSong } = await import("./suno-runner.server");

    const { data: order, error } = await context.supabase
      .from("song_orders")
      .select("*")
      .eq("id", data.orderId)
      .maybeSingle();
    if (error) throw error;
    if (!order) throw new Error("Commande introuvable");
    if (order.user_id !== context.userId) throw new Error("Non autorisé");
    if (order.status !== "draft") throw new Error("Cette commande a déjà été traitée");

    // TODO: intégrer un vrai PSP (CinetPay / FlexPay / MaxiCash). Ici simulation.
    await new Promise((r) => setTimeout(r, 1500));
    const paymentRef = `SIM-${data.operator.toUpperCase()}-${crypto.randomUUID().slice(0, 8)}`;
    await context.supabase.from("song_orders").update({ status: "paid", payment_ref: paymentRef }).eq("id", order.id);

    // Magic mode : la chanson a déjà été pré-générée avec lyrics/prompt/style.
    // Studio mode : lancer le ghostwriter pour produire les paroles avant Suno.
    const { data: existingSong } = await context.supabase
      .from("songs")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();

    let songId: string;
    if (existingSong) {
      songId = existingSong.id;
      await context.supabase.from("song_orders").update({ status: "generating" }).eq("id", order.id);
    } else {
      const { runGhostwriter } = await import("./ghostwriter.server");
      const lyrics = await runGhostwriter(context.supabase, context.userId, order.id);
      songId = lyrics.songId;
    }

    // Fire-and-forget côté Suno
    runSunoForSong(context.supabase, songId).catch(async (err) => {
      console.error("suno failed", err);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("songs").update({ status: "failed" }).eq("id", songId);
      await supabaseAdmin.from("song_orders").update({ status: "failed" }).eq("id", order.id);
    });

    return { ok: true, songId, paymentRef };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("song_orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const listMySongs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("songs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const getMySong = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { songId: string }) => z.object({ songId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: song, error } = await context.supabase.from("songs").select("*").eq("id", data.songId).maybeSingle();
    if (error) throw error;
    return song;
  });

export const getMyReferral = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("referrals").select("*").eq("user_id", context.userId).maybeSingle();
    if (error) throw error;
    return data;
  });
