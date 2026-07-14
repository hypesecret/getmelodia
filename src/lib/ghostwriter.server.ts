import type { SupabaseClient } from "@supabase/supabase-js";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { PACK_BY_SLUG, type PackSlug } from "./packs";
import { optimizeSunoStyle } from "./prompt-translator";

const lyricsSchema = z.object({
  title: z.string(),
  style_prompt: z.string(),
  lyrics_structure: z.array(z.object({ section: z.string(), text: z.string() })),
  cover_prompt: z.string(),
});

export async function runGhostwriter(supabase: SupabaseClient, userId: string, orderId: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY manquante");

  const { data: order, error } = await supabase.from("song_orders").select("*").eq("id", orderId).maybeSingle();
  if (error) throw error;
  if (!order) throw new Error("Commande introuvable");

  const pack = PACK_BY_SLUG[order.pack_slug as PackSlug];
  const q = order.questionnaire as Record<string, string>;
  const model = order.plan === "legende"
    // Plan Légende : Claude Opus 4 - maître absolu de la nuance littéraire française
    ? "anthropic/claude-opus-4"
    // Plan Signature/Essentiel : DeepSeek V3 - premium quality at fraction of the cost
    : "deepseek/deepseek-chat-v3-5";
  const gateway = createLovableAiGatewayProvider(key);

  const systemPrompt = `Tu es un parolier africain expert (Rumba congolaise, Ndombolo, Soukous, Afrobeat, Gospel, Amapiano) et ingénieur de prompt pour l'API Suno Pro.
Tu écris des paroles émotionnelles, précises, sans clichés, sans répétitions inutiles.
Tu respectes la structure du pack et la langue demandée. Tu peux mixer les langues si demandé.
${pack?.systemHint ?? ""}
Structure attendue : ${pack?.structure.join(" → ") ?? "Intro, Couplet, Refrain, Couplet, Refrain, Pont, Refrain final"}.

RÈGLES DE STYLE PROMPT (Suno) :
1. Format : Liste de mots-clés (tags) séparés par des virgules. PAS de phrases, de pronoms, ni de mots de liaison ("with", "a", "and", "for", "style of").
2. Tri par priorité stricte (de gauche à droite) :
   - [Genre principal & Sous-genres] (Ex: "afrobeat, ndombolo", "modern rumba")
   - [Tempo/BPM/Era] (Ex: "105 BPM", "78 BPM")
   - [Mood/Energy] (Ex: "high-energy", "melancholic", "euphoric", "intimate")
   - [Instrumentation clé] (Ex: "heavy 808 bass, clean electric guitar, warm Rhodes chords")
   - [Style vocal & Effets] (Spécifie toujours les 3 couches : character + delivery + effects. Ex: "raspy female tenor, breathy delivery, dry close-mic" ou "smooth male vocals, melodic rap, subtle autotune")
3. Aucun nom d'artiste ni titre de chanson protégé (Drake, Daft Punk, Fally Ipupa, Naza, etc.). Traduis-les en caractéristiques de style (ex: "Fally Ipupa" -> "congolese rumba, clean electric guitar, warm bass, emotional male vocals, smooth vocals, romantic, slow-tempo, 78 BPM").
4. Substitue toute marque protégée par un équivalent générique.

RÈGLES POUR LES PAROLES :
1. Chaque section dans lyrics_structure doit avoir une section claire (ex: "Intro", "Verse 1", "Chorus", "Pre-Chorus", "Bridge", "Outro").
2. Les paroles doivent inclure des cues vocaux entre parenthèses pour guider la dynamique vocale (ex: "(whispered)", "(belted)", "(spoken word)", "(building intensity)", "(stripped back)").
3. Garde les couplets à 4-8 lignes et les refrains à 2-4 lignes pour maximiser l'efficacité de l'arrangement Suno.`;

  const userPrompt = `Occasion: ${q.occasion}
Destinataire: ${q.destinataire}${q.lien ? ` (${q.lien})` : ""}${q.age ? `, ${q.age}` : ""}
Souvenirs et anecdotes: ${q.souvenirs}
Émotion principale: ${q.emotion}
Style musical demandé: ${q.style}
Langue demandée: ${q.langue}
Narrateur: ${q.narrateur}
${q.message ? `Message spécial: ${q.message}` : ""}

Produis le JSON contenant :
- title : titre court et évocateur
- style_prompt : Liste de tags optimisée pour Suno selon la formule ci-dessus.
- lyrics_structure : tableau d'objets avec "section" et "text"
- cover_prompt : description textuelle de l'illustration (sans aucun texte incrusté)`;

  try {
    const { output } = await generateText({
      model: gateway(model),
      output: Output.object({ schema: lyricsSchema }),
      system: systemPrompt,
      prompt: userPrompt,
    });
    
    const fullLyrics = output.lyrics_structure.map((s) => `[${s.section}]\n${s.text}`).join("\n\n");
    
    // Clean and clamp style prompt
    const cleanedStyle = optimizeSunoStyle(output.style_prompt, 120);

    const { data: song, error: insertErr } = await supabase
      .from("songs")
      .insert({
        order_id: order.id,
        user_id: userId,
        title: output.title,
        style: cleanedStyle,
        language: q.langue,
        lyrics: fullLyrics,
        prompt: fullLyrics, // CRITIQUE: Suno requiert les paroles complètes dans le champ prompt en mode customMode
        status: "lyrics_ready",
      })
      .select()
      .single();
    if (insertErr) throw insertErr;
    await supabase.from("song_orders").update({ status: "generating" }).eq("id", order.id);
    return { songId: song.id, sunoPrompt: fullLyrics, style: cleanedStyle, title: output.title ?? "Ma chanson" };
  } catch (e) {
    if (NoObjectGeneratedError.isInstance(e)) {
      await supabase.from("song_orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error("Le parolier n'a pas pu structurer la chanson. Réessayez.");
    }
    throw e;
  }
}
