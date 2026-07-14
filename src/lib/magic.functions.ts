import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { PLANS, type PlanKey } from "./packs";
import { optimizeSunoStyle } from "./prompt-translator";

const magicSchema = z.object({
  ui_layer: z.object({
    detected_occasion: z.string(),
    detected_story_summary: z.string(),
    loading_status_message: z.string(),
  }),
  suno_payload: z.object({
    prompt_style: z.string(),
    vocal_gender: z.enum(["male", "female", "duet", "instrumental"]),
    suno_lyrics: z.string(),
    advanced_settings: z.object({
      weirdness: z.number().int(),
      style_influence: z.number().int(),
      audio_influence: z.number().int(),
    }),
    persona_id: z.string().nullable(),
    inspiration_reference_track: z.string().nullable(),
    title: z.string(),
  }),
});

export type MagicPayload = z.infer<typeof magicSchema>;

const startMagicInput = z.object({
  userText: z.string().trim().min(4, "Décris un peu plus ta chanson").max(2000),
  plan: z.enum(["essentiel", "signature", "legende"]).default("signature"),
});

const SYSTEM_PROMPT = `Tu es le moteur "Invisible Studio" de Mélodia. L'utilisateur mainstream écrit ou dicte librement. Ta mission : transformer sa demande en payload prêt pour l'API Suno Pro.

RÈGLES ABSOLUES POUR LE CHAMP "prompt_style" (Style de musique) :
1. Format : Liste de mots-clés (tags) séparés par des virgules. PAS de phrases, de pronoms, ni de mots de liaison ("with", "a", "and", "for", "style of").
2. Tri par priorité stricte (de gauche à droite) :
   - [Genre principal & Sous-genres] (Ex: "afrobeat, ndombolo", "modern rumba")
   - [Tempo/BPM/Era] (Ex: "105 BPM", "78 BPM")
   - [Mood/Energy] (Ex: "high-energy", "melancholic", "euphoric", "intimate")
   - [Instrumentation clé] (Ex: "heavy 808 bass, clean electric guitar, warm Rhodes chords")
   - [Style vocal & Effets] (Spécifie toujours les 3 couches : character + delivery + effects. Ex: "raspy female tenor, breathy delivery, dry close-mic" ou "smooth male vocals, melodic rap, subtle autotune")
3. Aucun nom d'artiste ni titre de chanson protégé (Drake, Daft Punk, Fally Ipupa, Naza, etc.). Traduis-les en caractéristiques de style (ex: "Fally Ipupa" -> "congolese rumba, clean electric guitar, warm bass, emotional male vocals, smooth vocals, romantic, slow-tempo, 78 BPM").
4. Substitue toute marque protégée par un équivalent générique.

RÈGLES ABSOLUES POUR LE CHAMP "suno_lyrics" (Paroles) :
1. Langue : Écris strictement dans la LANGUE de la requête utilisateur (français, lingala, kituba, anglais, etc.).
2. Longueur : Reste concis (max 2 couplets, 2 refrains, 1 pont, 1 outro) pour éviter que Suno ne coupe au milieu de la génération.
3. Balises de structure obligatoire (entre crochets sur leur propre ligne) : [Intro], [Verse 1], [Chorus], [Verse 2], [Pre-Chorus], [Bridge], [Outro], [Fade Out].
4. Cues vocaux : Utilise des parenthèses dans les paroles pour guider la dynamique vocale (ex: "(whispered)", "(belted)", "(spoken word)", "(building intensity)", "(stripped back)").
5. Paroles sur-mesure et émotionnelles basées sur l'histoire de l'utilisateur.

RÈGLES D'AUTO-MAPPING DES PARAMÈTRES AVANCÉS :
- Ton mainstream / hit → weirdness: 10-15
- Ton "expérimental / fou / unique / drôle" → weirdness: 50-65
- style_influence: par défaut 50
- audio_influence: par défaut 30
- vocal_gender: Déduis du contexte de la relation ou "male" par défaut.

RÈGLES D'UI ET DÉTECTION :
- detected_occasion : En anglais (Birthday, Anniversary, Wedding, Breakup, Tribute, etc.)
- loading_status_message : Message court, créatif et localisé (ex: "Extraction du groove afrobeat de ta référence...")
- title : Court, évocateur, dans la langue de l'utilisateur.

Renvoie STRICTEMENT le JSON demandé, aucun texte autour.`;

export const startMagicOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => startMagicInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquante");

    const gateway = createLovableAiGatewayProvider(key);
    // Magic mode = extraction de tags de style → modèle gratuit rapide suffisant
    // Route GRATUITE : tencent/hunyuan-a13b-instruct:free (295B MoE, précis sur le formatage JSON)
    // Fallback si plan legende : nvidia/llama-3.1-nemotron-ultra-253b-v1:free (ultra-rapide)
    const model = data.plan === "legende"
      ? "nvidia/llama-3.1-nemotron-ultra-253b-v1:free"
      : "tencent/hunyuan-a13b-instruct:free";

    let payload: MagicPayload;
    try {
      const { output } = await generateText({
        model: gateway(model),
        output: Output.object({ schema: magicSchema }),
        system: SYSTEM_PROMPT,
        prompt: `Requête utilisateur:\n"""${data.userText}"""`,
      });
      payload = output;
    } catch (e) {
      if (NoObjectGeneratedError.isInstance(e)) {
        throw new Error("Le moteur n'a pas pu structurer la demande. Reformule en une phrase.");
      }
      throw e;
    }

    // Clean, prioritize, and clamp prompt_style to 120 chars.
    payload.suno_payload.prompt_style = optimizeSunoStyle(payload.suno_payload.prompt_style, 120);

    const plan: PlanKey = data.plan;
    const questionnaire = {
      _magic: true,
      pack_slug: "autre",
      occasion: payload.ui_layer.detected_occasion,
      user_text: data.userText,
      summary: payload.ui_layer.detected_story_summary,
      suno_payload: payload.suno_payload,
    };

    const { data: order, error } = await context.supabase
      .from("song_orders")
      .insert({
        user_id: context.userId,
        pack_slug: "autre",
        questionnaire,
        summary: payload.ui_layer.detected_story_summary,
        plan,
        amount_fcfa: PLANS[plan].price,
        status: "draft",
      })
      .select()
      .single();
    if (error) throw error;

    const { error: songErr } = await context.supabase.from("songs").insert({
      order_id: order.id,
      user_id: context.userId,
      title: payload.suno_payload.title,
      style: payload.suno_payload.prompt_style,
      language: null,
      lyrics: payload.suno_payload.suno_lyrics,
      prompt: payload.suno_payload.prompt_style,
      status: "lyrics_ready",
    });
    if (songErr) throw songErr;

    return {
      orderId: order.id,
      ui: payload.ui_layer,
    };
  });
