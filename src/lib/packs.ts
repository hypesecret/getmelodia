export type PackSlug =
  | "femme"
  | "mere"
  | "papa"
  | "anniversaire"
  | "mariage"
  | "naissance"
  | "hommage"
  | "diplome"
  | "entreprise"
  | "jingle"
  | "eglise"
  | "enfant"
  | "amitie"
  | "saint-valentin"
  | "nouvel-an"
  | "noel"
  | "reconciliation"
  | "jingle-radio"
  | "hymne-entreprise"
  | "autre";

export interface PackConfig {
  slug: PackSlug;
  emoji: string;
  title: string;
  tagline: string;
  occasion: string;
  suggestedStyles: string[];
  suggestedEmotions: string[];
  suggestedLanguages: string[];
  structure: string[];
  systemHint: string;
  custom?: boolean;
}

const defaultStructure = ["Intro", "Couplet 1", "Refrain", "Couplet 2", "Refrain", "Pont", "Refrain final"];

export const PACKS: PackConfig[] = [
  {
    slug: "femme",
    emoji: "❤️",
    title: "Chanson pour ma femme",
    tagline: "Un cadeau d'amour qui restera à jamais.",
    occasion: "Amour",
    suggestedStyles: ["Rumba", "R&B", "Afrobeat"],
    suggestedEmotions: ["Amour", "Tendresse", "Gratitude"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: ["Intro douce", "Couplet souvenirs", "Refrain amour", "Couplet promesse", "Refrain", "Pont émotionnel", "Refrain final"],
    systemHint: "Ballade romantique intime, images sensorielles (parfum, sourire, main), pas de clichés.",
  },
  {
    slug: "mere",
    emoji: "👩",
    title: "Fête des mères",
    tagline: "Dire merci en musique à celle qui a tout donné.",
    occasion: "Maman",
    suggestedStyles: ["Rumba", "Gospel", "Soukous"],
    suggestedEmotions: ["Gratitude", "Fierté", "Tendresse"],
    suggestedLanguages: ["Français", "Lingala", "Kituba"],
    structure: ["Intro chorale", "Couplet enfance", "Refrain gratitude", "Couplet sacrifices", "Refrain", "Pont", "Refrain final"],
    systemHint: "Hommage maternel chaleureux, éviter le mélo forcé, ancrer dans des détails vrais.",
  },
  {
    slug: "papa",
    emoji: "👨",
    title: "Pour Papa",
    tagline: "Un hommage puissant à un pilier.",
    occasion: "Papa",
    suggestedStyles: ["Rumba", "Afrobeat", "Gospel"],
    suggestedEmotions: ["Fierté", "Gratitude", "Amour"],
    suggestedLanguages: ["Français", "Lingala"],
    structure: ["Intro guitare", "Couplet héritage", "Refrain fierté", "Couplet leçons de vie", "Refrain", "Pont", "Outro"],
    systemHint: "Respectueux et digne, images de mains, marche, sagesse.",
  },
  {
    slug: "anniversaire",
    emoji: "🎂",
    title: "Anniversaire",
    tagline: "Bien plus qu'un 'Joyeux anniversaire'.",
    occasion: "Anniversaire",
    suggestedStyles: ["Ndombolo", "Afrobeat", "Amapiano"],
    suggestedEmotions: ["Joie", "Amour", "Fierté"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: ["Intro festive", "Couplet nom + année", "Refrain fête", "Couplet souhaits", "Refrain", "Pont danse", "Refrain final"],
    systemHint: "Énergique et dansant, prénom cité plusieurs fois, ambiance fête.",
  },
  {
    slug: "mariage",
    emoji: "💍",
    title: "Mariage",
    tagline: "Le grand jour, chanté.",
    occasion: "Mariage",
    suggestedStyles: ["Rumba", "R&B", "Gospel"],
    suggestedEmotions: ["Amour", "Joie", "Tendresse"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: ["Intro douce", "Couplet rencontre", "Refrain promesse", "Couplet futur", "Pont", "Refrain final"],
    systemHint: "Solennel et romantique, célébrer l'union et la promesse.",
  },
  {
    slug: "naissance",
    emoji: "👶",
    title: "Naissance",
    tagline: "Accueillir un bébé avec sa propre chanson.",
    occasion: "Naissance",
    suggestedStyles: ["Acoustique", "Gospel", "Piano"],
    suggestedEmotions: ["Tendresse", "Espoir", "Joie"],
    suggestedLanguages: ["Français", "Lingala"],
    structure: ["Intro berceuse", "Couplet accueil", "Refrain prénom bébé", "Couplet rêves parents", "Refrain final"],
    systemHint: "Douce berceuse, prénom du bébé au refrain, images de lumière et de main tendue.",
  },
  {
    slug: "hommage",
    emoji: "🙏",
    title: "Hommage / Deuil",
    tagline: "Garder vivante la mémoire d'un être cher.",
    occasion: "Deuil",
    suggestedStyles: ["Gospel", "Rumba", "Piano"],
    suggestedEmotions: ["Nostalgie", "Gratitude", "Paix"],
    suggestedLanguages: ["Français", "Lingala", "Kituba"],
    structure: ["Intro solennelle", "Couplet souvenir", "Refrain mémoire", "Couplet héritage", "Pont paix", "Refrain final"],
    systemHint: "Digne, apaisé, pas larmoyant. Célébrer la vie plus que la perte.",
  },
  {
    slug: "diplome",
    emoji: "🎓",
    title: "Diplôme / Réussite",
    tagline: "Célébrer un accomplissement.",
    occasion: "Diplôme",
    suggestedStyles: ["Afrobeat", "Gospel", "Amapiano"],
    suggestedEmotions: ["Fierté", "Joie", "Gratitude"],
    suggestedLanguages: ["Français", "Anglais", "Mixte"],
    structure: ["Intro triomphale", "Couplet parcours", "Refrain victoire", "Couplet remerciements", "Refrain final"],
    systemHint: "Motivant et lumineux, mentionner l'école/diplôme, images d'effort récompensé.",
  },
  {
    slug: "entreprise",
    emoji: "💼",
    title: "Entreprise / Événement",
    tagline: "Un morceau sur-mesure pour votre marque.",
    occasion: "Entreprise",
    suggestedStyles: ["Afrobeat", "Amapiano", "Pop"],
    suggestedEmotions: ["Énergie", "Fierté"],
    suggestedLanguages: ["Français", "Anglais"],
    structure: ["Intro branding", "Couplet mission", "Refrain nom marque", "Couplet valeurs", "Outro"],
    systemHint: "Professionnel et rythmé, intégrer nom marque + baseline.",
  },
  {
    slug: "hymne-entreprise",
    emoji: "🏢",
    title: "Hymne d'entreprise",
    tagline: "L'ADN de votre boîte, en chanson.",
    occasion: "Hymne d'entreprise",
    suggestedStyles: ["Pop", "Afrobeat", "Gospel"],
    suggestedEmotions: ["Fierté", "Énergie"],
    suggestedLanguages: ["Français", "Anglais", "Mixte"],
    structure: ["Intro solennelle", "Couplet histoire", "Refrain nom + valeurs", "Couplet équipe", "Refrain final"],
    systemHint: "Fédérateur, chanté à plusieurs voix, ancré dans les valeurs.",
  },
  {
    slug: "jingle",
    emoji: "📻",
    title: "Jingle Publicitaire",
    tagline: "15 à 30 secondes qui marquent.",
    occasion: "Jingle Publicitaire",
    suggestedStyles: ["Afrobeat", "Ndombolo", "Amapiano"],
    suggestedEmotions: ["Énergie", "Joie"],
    suggestedLanguages: ["Français", "Lingala", "Anglais"],
    structure: ["Hook 4 mesures", "Punchline", "Signature"],
    systemHint: "Ultra court (15-30s), catchy, mémorable dès la 1ère écoute.",
  },
  {
    slug: "jingle-radio",
    emoji: "🎙️",
    title: "Jingle Radio",
    tagline: "Une identité sonore pour votre antenne.",
    occasion: "Jingle Radio",
    suggestedStyles: ["Afrobeat", "Pop", "Ndombolo"],
    suggestedEmotions: ["Énergie", "Joie"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: ["Intro identifiable", "Nom radio", "Signature outro"],
    systemHint: "Signature radio dynamique, 10-20s, nom de la station en clair.",
  },
  {
    slug: "eglise",
    emoji: "⛪",
    title: "Église / Louange",
    tagline: "Un cantique personnalisé pour votre communauté.",
    occasion: "Église",
    suggestedStyles: ["Gospel", "Rumba", "Piano"],
    suggestedEmotions: ["Foi", "Gratitude", "Paix"],
    suggestedLanguages: ["Français", "Lingala", "Kituba"],
    structure: ["Intro adoration", "Couplet louange", "Refrain gloire", "Couplet témoignage", "Pont", "Refrain final"],
    systemHint: "Respectueux du registre chrétien, vocabulaire biblique naturel.",
  },
  {
    slug: "enfant",
    emoji: "🧒",
    title: "Pour un enfant",
    tagline: "Une chanson à son prénom, rien qu'à lui.",
    occasion: "Enfant",
    suggestedStyles: ["Acoustique", "Pop", "Afrobeat"],
    suggestedEmotions: ["Joie", "Tendresse", "Fierté"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: defaultStructure,
    systemHint: "Vocabulaire simple, images ludiques, prénom au refrain.",
  },
  {
    slug: "amitie",
    emoji: "🤝",
    title: "Amitié",
    tagline: "Célébrer un(e) ami(e) qui compte.",
    occasion: "Amitié",
    suggestedStyles: ["Afrobeat", "Pop", "R&B"],
    suggestedEmotions: ["Gratitude", "Joie", "Nostalgie"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: defaultStructure,
    systemHint: "Chaleureux, complice, souvenirs partagés.",
  },
  {
    slug: "saint-valentin",
    emoji: "💘",
    title: "Saint-Valentin",
    tagline: "Une déclaration à faire fondre.",
    occasion: "Saint-Valentin",
    suggestedStyles: ["R&B", "Rumba", "Piano"],
    suggestedEmotions: ["Amour", "Tendresse"],
    suggestedLanguages: ["Français", "Lingala", "Anglais"],
    structure: defaultStructure,
    systemHint: "Romantique, intime, dédicace personnelle.",
  },
  {
    slug: "nouvel-an",
    emoji: "🎆",
    title: "Nouvel An",
    tagline: "Ouvrir l'année en musique.",
    occasion: "Nouvel An",
    suggestedStyles: ["Afrobeat", "Amapiano", "Pop"],
    suggestedEmotions: ["Joie", "Espoir", "Énergie"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: defaultStructure,
    systemHint: "Positif, tourné vers l'avenir, célébration.",
  },
  {
    slug: "noel",
    emoji: "🎄",
    title: "Noël",
    tagline: "Un cadeau qui chante sous le sapin.",
    occasion: "Noël",
    suggestedStyles: ["Gospel", "Pop", "Acoustique"],
    suggestedEmotions: ["Joie", "Tendresse", "Foi"],
    suggestedLanguages: ["Français", "Lingala", "Anglais"],
    structure: defaultStructure,
    systemHint: "Chaleureux, familial, esprit de Noël sans cliché.",
  },
  {
    slug: "reconciliation",
    emoji: "🕊️",
    title: "Réconciliation",
    tagline: "Dire pardon en musique.",
    occasion: "Réconciliation",
    suggestedStyles: ["R&B", "Rumba", "Piano"],
    suggestedEmotions: ["Amour", "Paix", "Gratitude"],
    suggestedLanguages: ["Français", "Lingala"],
    structure: defaultStructure,
    systemHint: "Sincère, humble, ouverture vers l'autre.",
  },
  {
    slug: "autre",
    emoji: "✨",
    title: "Autre occasion",
    tagline: "Décrivez votre propre occasion en un mot.",
    occasion: "Autre",
    custom: true,
    suggestedStyles: ["Afrobeat", "Rumba", "Pop", "Gospel"],
    suggestedEmotions: ["Amour", "Joie", "Fierté", "Gratitude"],
    suggestedLanguages: ["Français", "Lingala", "Mixte"],
    structure: defaultStructure,
    systemHint: "S'adapter à l'occasion décrite par l'utilisateur.",
  },
];

export const PACK_BY_SLUG = Object.fromEntries(PACKS.map((p) => [p.slug, p])) as Record<PackSlug, PackConfig>;

export const PLANS = {
  essentiel: {
    label: "Essentiel",
    price: 2500,
    features: ["2 générations", "MP3 haute qualité", "Paroles personnalisées"],
  },
  signature: {
    label: "Signature",
    price: 4900,
    features: ["6 générations", "Voix IA illimitées", "Pochette IA offerte", "Version instrumentale", "File d'attente prioritaire"],
  },
  legende: {
    label: "Légende",
    price: 9900,
    features: [
      "15 générations / mois",
      "⚡ Génération ultra-rapide (priorité absolue)",
      "🎚️ Stems séparés (voix, batterie, basse…)",
      "WAV Studio master",
      "Licence commerciale complète",
      "Support prioritaire WhatsApp",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
