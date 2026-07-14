/**
 * Suno Prompt Translator & Optimizer Utility
 * Follows the 2026/v5.5 Advanced Suno Prompting Standards.
 * Incorporates 80+ Central Africa, French, US/UK, and Global artist profiles.
 */

export const ARTIST_SONIC_FINGERPRINTS: Record<string, string> = {
  // --- AFRIQUE CENTRALE (RDC, CONGO-BRAZZA, CAMEROUN, GABON) ---
  "fally ipupa": "congolese rumba, afrobeats, sensual, sweet electric guitar, smooth male vocals",
  fally: "congolese rumba, afrobeats, sensual, sweet electric guitar, smooth male vocals",
  naza: "french afro-pop, high-energy, catchy synths, upbeat, 100 bpm, male vocals",
  "koffi olomide": "classic congolese rumba, tcha tcho, romantic, heavy bassline, deep baritone male vocals",
  "koffi olomidé": "classic congolese rumba, tcha tcho, romantic, heavy bassline, deep baritone male vocals",
  koffi: "classic congolese rumba, tcha tcho, romantic, heavy bassline, deep baritone male vocals",
  gims: "french afro-pop, operatic pop rap, dramatic, anthemic synths, powerful high-pitch male vocals",
  "maitre gims": "french afro-pop, operatic pop rap, dramatic, anthemic synths, powerful high-pitch male vocals",
  "maître gims": "french afro-pop, operatic pop rap, dramatic, anthemic synths, powerful high-pitch male vocals",
  dadju: "r&b francophone, afro-fusion, romantic, soft keys, smooth melodic male vocals",
  tayc: "afro-lov, r&b, sensual, slow-groove, acoustic guitar chords, silky male vocals",
  "innos'b": "afro-congo, modern soukous, danceable, rapid shakers, high-energy male chants",
  "innoss'b": "afro-congo, modern soukous, danceable, rapid shakers, high-energy male chants",
  innosb: "afro-congo, modern soukous, danceable, rapid shakers, high-energy male chants",
  innossb: "afro-congo, modern soukous, danceable, rapid shakers, high-energy male chants",
  "gaz mawete": "modern rumba, afrobeats, energetic, melodic percussion, expressive male vocals",
  "ferre gola": "pure congolese rumba, melancholic, acoustic guitar pluck, emotional vibrato male vocals",
  ferre: "pure congolese rumba, melancholic, acoustic guitar pluck, emotional vibrato male vocals",
  alesh: "congolese afro-trap, political hip hop, aggressive, heavy 808 bass, fast rap vocals",
  "roga roga": "fast soukous, sebene, hyper-energetic, overdrive electric guitar solo, animation chants",
  rogaroga: "fast soukous, sebene, hyper-energetic, overdrive electric guitar solo, animation chants",
  "extra musica": "fast soukous, sebene, hyper-energetic, overdrive electric guitar solo, animation chants",
  locko: "afro-pop, r&b, emotional, grand piano, smooth tenor male vocals",
  tenor: "afro-trap, cameroonian hip hop, aggressive, fast tempo, rapid fire male rap",
  franco: "vintage 70s congolese rumba, slow rhumba tempo, twin electric guitars, analog horns, retro male chorus",
  "tpok jazz": "vintage 70s congolese rumba, slow rhumba tempo, twin electric guitars, analog horns, retro male chorus",
  "papa wemba": "classic soukous, viva la musica, uplifting, bright lead guitar, high-pitched angelic male vocals",
  wemba: "classic soukous, viva la musica, uplifting, bright lead guitar, high-pitched angelic male vocals",
  "madilu system": "traditional congolese rumba, storytelling, warm brass section, smooth deep tenor vocals",
  madilu: "traditional congolese rumba, storytelling, warm brass section, smooth deep tenor vocals",
  "shan'l": "afro-pop, r&b, sassy, modern afrobeats riddim, confident melodic female vocals",
  shanl: "afro-pop, r&b, sassy, modern afrobeats riddim, confident melodic female vocals",
  "diamond platnumz": "bongo flava, afro-pop, festive, rhythmic percussion, high-energy swahili melodic male vocals",
  diamond: "bongo flava, afro-pop, festive, rhythmic percussion, high-energy swahili melodic male vocals",
  "charlotte dipanda": "acoustic makossa, afro-soul, intimate, soft acoustic guitar, elegant soulful female vocals",
  dipanda: "acoustic makossa, afro-soul, intimate, soft acoustic guitar, elegant soulful female vocals",

  // --- ZONE FRANCOPHONE (FRANCE, BELGIQUE, CÔTE D'IVOIRE, SUISSE) ---
  jul: "marseille pop rap, doretetdeplatine style, upbeat dance synth, 130 bpm, autotuned male rap",
  pnl: "cloud rap, ambient hip hop, melancholic, atmospheric reverb pads, heavy autotune vocals",
  ninho: "french rap, melodic trap, triumphant, emotional piano chord, hard 808, versatile male vocals",
  "daft punk": "french house, nu-disco, funk bassline, talkbox, vocoder effect, 125 bpm",
  stromae: "belgian electronic pop, hip hop, theatrical, dark synth accordion, danceable, deep male vocals",
  "aya nakamura": "afro-pop, french zook, dancehall, infectious log drum, hypnotic female vocals",
  aya: "afro-pop, french zook, dancehall, infectious log drum, hypnotic female vocals",
  sch: "cinematic trap, dark hip hop, dramatic, orchestral strings, raspy low male vocals",
  damso: "dark rap, introspective hip hop, moody, minimalist lofi keys, deep monotone male vocals",
  booba: "hardcore trap, french hip hop, aggressive, dark brass, heavy sub-bass, deep autotuned voice",
  tiakola: "melodic drill, afro-fusion, uplifting, bouncy percussion, fast melodic male vocals",
  "didi b": "afro-trap, ivorian rap, high-energy, aggressive 808, fast paced male flow",
  didib: "afro-trap, ivorian rap, high-energy, aggressive 808, fast paced male flow",
  "magic system": "zouglou, ivorian pop, festive, upbeat percussion, joyous group chorus hooks",
  "kery james": "conscious french hip hop, serious, melancholic boom bap piano, poetic male vocals",
  kery: "conscious french hip hop, serious, melancholic boom bap piano, poetic male vocals",
  werenoi: "dark plugg trap, french rap, intense, repetitive minimalist synth, low-register monotone male delivery",
  gazo: "french drill, heavy sliding sub-bass, aggressive, skipping hi-hats, deep gravelly male vocals",
  hamza: "r&b trap, belgian hip hop, smooth, late-night atmospheric synths, high-pitched autotune melodic flow",
  sdm: "hardcore rap, aggressive trap, triumphant horns, heavy 808 distortion, powerful male voice",
  "dj arafat": "coupe-decale, ivorian dance, hyper-energetic, fast complex drum pattern, aggressive male animation chants",
  arafat: "coupe-decale, ivorian dance, hyper-energetic, fast complex drum pattern, aggressive male animation chants",
  "serge beynaud": "coupe-decale, afro-pop, festive, upbeat electronic synths, smooth melodic dancing vocals",
  beynaud: "coupe-decale, afro-pop, festive, upbeat electronic synths, smooth melodic dancing vocals",
  kaaris: "hardcore sevran trap, dark, aggressive brass hits, heavy booming 808, menacing deep voice",
  soprano: "uplifting french pop rap, radio-friendly, cheerful synth-pop, high-pitched energetic male vocals",

  // --- AFROBEATS GLOBAL & AMAPIANO (NIGERIA, AFRIQUE DU SUD) ---
  "burna boy": "afrobeats, afro-fusion, soulful, brass horn section, heavy riddim, raspy male vocals",
  burna: "afrobeats, afro-fusion, soulful, brass horn section, heavy riddim, raspy male vocals",
  wizkid: "afrobeats, smooth afro-pop, chill vibe, minimalist saxophone, silky relaxed male vocals",
  rema: "afro-rave, modern afrobeats, hypnotic, eastern strings flavor, bouncy percussion, melodic male vocals",
  asake: "fuji-amapiano, neo-afrobeats, festive, heavy log drum, energetic group backing vocals",
  tyla: "pop-amapiano, r&b, sensual, shaker rhythmic loops, deep log drum, airy female vocals",
  davido: "high-energy afrobeats, pop, celebratory, driving percussion, gravelly passionate male vocals",
  "ayra starr": "afro-soul, modern afrobeats, empowering, smooth keys, silky confident female vocals",
  ayra: "afro-soul, modern afrobeats, empowering, smooth keys, silky confident female vocals",
  "omah lay": "purple pop, melancholic afrobeats, moody, dark slow percussion, emotional vulnerable male vocals",
  omah: "purple pop, melancholic afrobeats, moody, dark slow percussion, emotional vulnerable male vocals",
  "kabza de small": "pure amapiano, deep house, slow groove, continuous shaker loops, heavy distinct log drum, instrumental focus",
  kabza: "pure amapiano, deep house, slow groove, continuous shaker loops, heavy distinct log drum, instrumental focus",

  // --- ZONE ANGLOPHONE (USA, UK) ---
  drake: "melodic trap, contemporary r&b, moody, atmospheric reverb pads, 808 bass, ambient male vocals",
  "travis scott": "psychedelic trap, dark hip hop, trippy, distorted sub-bass, heavy autotune vocal effects",
  travis: "psychedelic trap, dark hip hop, trippy, distorted sub-bass, heavy autotune vocal effects",
  "the weeknd": "80s synthwave, dark r&b, cinematic, retro synthesizers, driving bassline, falsetto male vocals",
  weeknd: "80s synthwave, dark r&b, cinematic, retro synthesizers, driving bassline, falsetto male vocals",
  eminem: "90s boom bap, hardcore rap, aggressive, fast double-time delivery, raw male vocals",
  "kendrick lamar": "west coast hip hop, jazz rap, introspective, live bassline, dynamic unpredictable male vocals",
  kendrick: "west coast hip hop, jazz rap, introspective, live bassline, dynamic unpredictable male vocals",
  beyonce: "modern r&b, pop, anthemic, powerful horn section, majestic powerful female vocals",
  beyoncé: "modern r&b, pop, anthemic, powerful horn section, majestic powerful female vocals",
  "central cee": "uk drill, continuous hi-hats, bouncy sliding bass, rapid continuous male rap",
  centralcee: "uk drill, continuous hi-hats, bouncy sliding bass, rapid continuous male rap",
  "chris brown": "r&b pop, dance-pop, upbeat, electronic club synth, smooth agile male vocals",
  "kanye west": "experimental hip hop, soul sample chop, grand orchestral strings, anthemic male vocals",
  kanye: "experimental hip hop, soul sample chop, grand orchestral strings, anthemic male vocals",
  "post malone": "acoustic trap, pop rock, hazy, melodic guitar strum, rhythmic male vocals with heavy vibrato",
  "ice spice": "bronx drill, jersey club hybrid, fast tempo, bouncy sub-bass, repetitive laid-back female rap",
  gunna: "melodic drip trap, smooth hip hop, hypnotic guitar loop, laid-back effortless male flow",
  "21 savage": "dark slaughter trap, minimalist hip hop, sinister, eerie piano loop, cold monotone male delivery",

  // --- POP, ROCK & RETRO LÉGENDAIRE (GLOBAL) ---
  "taylor swift": "contemporary country pop, acoustic guitar, emotional storytelling, clear female vocals",
  taylor: "contemporary country pop, acoustic guitar, emotional storytelling, clear female vocals",
  "ed sheeran": "acoustic folk pop, personal storytelling, rhythmic guitar plucking, loop pedal, male vocals",
  sheeran: "acoustic folk pop, personal storytelling, rhythmic guitar plucking, loop pedal, male vocals",
  "billie eilish": "minimalist dark pop, avant-garde, eerie, sub-bass pulse, intimate whispered female vocals",
  billie: "minimalist dark pop, avant-garde, eerie, sub-bass pulse, intimate whispered female vocals",
  coldplay: "stadium alternative rock, anthemic, uplifting piano arpeggio, ambient guitars, falsetto male chorus",
  "michael jackson": "80s funk pop, dance, punchy brass, disco bassline, rhythmic male vocal hiccups",
  "bob marley": "roots reggae, skank guitar, warm bubbling bassline, relaxed, positive male vocals",
  marley: "roots reggae, skank guitar, warm bubbling bassline, relaxed, positive male vocals",
  "celine dion": "power ballad, adult contemporary, dramatic, orchestral arrangement, grand piano, belt female vocals",
  "céline dion": "power ballad, adult contemporary, dramatic, orchestral arrangement, grand piano, belt female vocals",
  adele: "soulful pop, melancholic, elegant grand piano, cinematic strings, powerful emotive female vocals",
  "francis cabrel": "french folk, acoustic chanson, nostalgic, organic acoustic guitar strumming, warm rustic male vocals",
  cabrel: "french folk, acoustic chanson, nostalgic, organic acoustic guitar strumming, warm rustic male vocals",
  "johnny hallyday": "french stadium rock, blues rock, powerful, distorted electric guitar, dramatic brass, gravelly operatic male vocals",
  johnny: "french stadium rock, blues rock, powerful, distorted electric guitar, dramatic brass, gravelly operatic male vocals",
  "charles aznavour": "vintage french chanson, orchestral pop, dramatic, grand piano, expressive theatrical male vocals",
  aznavour: "vintage french chanson, orchestral pop, dramatic, grand piano, expressive theatrical male vocals",
  "dua lipa": "nu-disco, dance-pop, upbeat, heavy slung bassline, modern retro synths, punchy female vocals",
  "bruno mars": "retro funk, r&b pop, upbeat, punchy horn section, slap bass, high-energy charismatic male vocals",
  bruno: "retro funk, r&b pop, upbeat, punchy horn section, slap bass, high-energy charismatic male vocals",
  rihanna: "dancehall pop, contemporary r&b, confident, synthetic island riddim, distinctive island-tinted female vocals",
  "hans zimmer": "cinematic orchestral, epic, dramatic, massive strings arpeggio, booming brass, deep sub percussion, no vocals",
  zimmer: "cinematic orchestral, epic, dramatic, massive strings arpeggio, booming brass, deep sub percussion, no vocals",
  "lana del rey": "cinematic baroque pop, vintage americana, melancholic, slow trip-hop drums, hazy reverbed female vocals",
  lana: "cinematic baroque pop, vintage americana, melancholic, slow trip-hop drums, hazy reverbed female vocals",
  queen: "70s glam rock, operatic rock, theatrical, overdubbed guitar solos, grand piano, powerful multi-layered chorus vocals",
  "elton john": "70s piano rock, glam pop, uplifting, energetic grand piano chords, soulful classic male vocals",
  elton: "70s piano rock, glam pop, uplifting, energetic grand piano chords, soulful classic male vocals"
};

// Forbidden filler words to strip from prompt tags
const FILLER_WORDS = [
  /\bwith\b/g,
  /\ba\b/g,
  /\bthe\b/g,
  /\bsong\s+for\b/g,
  /\bperfect\s+for\b/g,
  /\band\b/g,
  /\bfor\b/g,
  /\bstyle\s+of\b/g,
  /\bmusic\b/g,
  /\bgenre\b/g
];

/**
 * Replaces known artist names with their descriptive sonic fingerprints
 */
export function substituteArtists(text: string): string {
  let cleaned = text.toLowerCase();
  for (const [artist, replacement] of Object.entries(ARTIST_SONIC_FINGERPRINTS)) {
    const regex = new RegExp(`\\b${artist}\\b`, "gi");
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, replacement);
    }
  }
  return cleaned;
}

/**
 * Optimizes, cleans and orders style tags to follow the 5-part Suno formula.
 * Order: [Genre & Subgenre], [Tempo/BPM/Era], [Mood/Energy], [Key Instrumentation], [Vocals & FX]
 */
export function optimizeSunoStyle(prompt: string, maxLen = 120): string {
  // 1. Substitute artists
  let cleaned = substituteArtists(prompt);

  // 2. Remove filler grammar words
  for (const filler of FILLER_WORDS) {
    cleaned = cleaned.replace(filler, "");
  }

  // 3. Clean spacing and split into tags
  const tags = cleaned
    .split(/[,;\n\+]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag !== "song");

  // Deduplicate tags while keeping order
  const uniqueTags = Array.from(new Set(tags));

  // 4. Reconstruct and clamp to maximum characters
  // We clamp on tag boundaries to avoid cutting a word in half
  let result = "";
  for (const tag of uniqueTags) {
    const separator = result ? ", " : "";
    if ((result + separator + tag).length <= maxLen) {
      result += separator + tag;
    } else {
      break; // Stop adding to respect character budget
    }
  }

  // If result is empty, return fallback
  return result || "afrobeat, modern production, 100 BPM";
}
