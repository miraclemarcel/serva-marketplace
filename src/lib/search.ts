import { CATEGORY_MAP, INDUSTRIES, USE_CASES, labelOf } from "./taxonomy";
import type { Service } from "./types";

/**
 * Lightweight "smart" search: synonym expansion, prefix matching, typo
 * tolerance (Levenshtein) and field-weighted relevance scoring.
 */

const STOPWORDS = new Set([
  "a", "an", "and", "the", "for", "of", "to", "with", "my", "our", "i", "we", "need", "want",
  "some", "in", "on", "me", "us", "custom", "branded", "printing", "print", "design",
]);

// Query term → extra terms that should also match.
const SYNONYMS: Record<string, string[]> = {
  tee: ["t-shirt", "tshirt"],
  tees: ["t-shirt", "tshirt"],
  shirt: ["t-shirt", "apparel"],
  shirts: ["t-shirt", "apparel"],
  cup: ["mug"],
  cups: ["mug"],
  coffee: ["mug"],
  swag: ["merch", "gift"],
  merch: ["swag", "apparel", "gift"],
  sweater: ["hoodie", "jumper"],
  jumper: ["hoodie"],
  card: ["business cards"],
  cards: ["business cards"],
  site: ["website"],
  web: ["website", "landing page"],
  insta: ["instagram"],
  ig: ["instagram"],
  reel: ["reels"],
  photo: ["photography"],
  photos: ["photography"],
  pictures: ["photography"],
  shoot: ["photography", "video"],
  film: ["video"],
  banner: ["roll-up banner", "backdrop"],
  standee: ["roll-up banner"],
  wall: ["backdrop", "step and repeat"],
  presentation: ["pitch deck"],
  slides: ["pitch deck"],
  deck: ["pitch deck"],
  stationary: ["stationery"],
  logos: ["logo"],
  identity: ["brand guidelines"],
  rebrand: ["identity", "logo"],
  name: ["naming"],
  bag: ["tote"],
  bags: ["tote"],
  flask: ["water bottle"],
  label: ["packaging", "stickers"],
  labels: ["packaging", "stickers"],
  animation: ["motion"],
  gift: ["gift box", "merch"],
  gifts: ["gift box", "merch"],
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (s: string) =>
  normalize(s)
    .split(/[\s-]+/)
    .filter(Boolean);

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

type IndexedField = { weight: number; tokens: string[] };
type IndexedService = { service: Service; fields: IndexedField[]; name: string };

const indexCache = new WeakMap<Service[], IndexedService[]>();

function buildIndex(services: Service[]): IndexedService[] {
  const cached = indexCache.get(services);
  if (cached) return cached;
  const index = services.map((service) => ({
    service,
    name: normalize(service.name),
    fields: [
      { weight: 10, tokens: tokenize(service.name) },
      { weight: 6, tokens: service.tags.flatMap(tokenize) },
      { weight: 5, tokens: tokenize(CATEGORY_MAP[service.category].label) },
      {
        weight: 3,
        tokens: [
          ...service.useCases.flatMap((u) => tokenize(labelOf(USE_CASES, u))),
          ...service.industries.flatMap((i) => tokenize(labelOf(INDUSTRIES, i))),
        ],
      },
      { weight: 2, tokens: tokenize(service.tagline) },
      { weight: 1, tokens: tokenize(service.description) },
    ],
  }));
  indexCache.set(services, index);
  return index;
}

function termScore(term: string, fields: IndexedField[]): number {
  let best = 0;
  const maxTypos = term.length >= 8 ? 2 : term.length >= 5 ? 1 : 0;
  for (const field of fields) {
    for (const token of field.tokens) {
      let s = 0;
      if (token === term) s = 1;
      else if (term.length >= 2 && token.startsWith(term)) s = 0.8;
      else if (maxTypos && levenshtein(term, token, maxTypos) <= maxTypos) s = 0.55;
      if (s) best = Math.max(best, s * field.weight);
    }
  }
  return best;
}

export type SearchHit = { service: Service; score: number };

/**
 * Returns scored hits. Every query term must match (AND). When nothing
 * matches strictly, falls back to any-term (OR) matches and flags it.
 */
export function searchServices(
  services: Service[],
  query: string,
): { hits: SearchHit[]; approximate: boolean } {
  const terms = tokenize(query).filter((t) => !STOPWORDS.has(t));
  if (!terms.length) {
    return { hits: services.map((service) => ({ service, score: 0 })), approximate: false };
  }

  const index = buildIndex(services);
  const phrase = normalize(query);

  const scored = index.map(({ service, fields, name }) => {
    const perTerm = terms.map((term) => {
      // A synonym phrase ("business cards") only counts when all its words match.
      const phraseScore = (phrase: string) => Math.min(...tokenize(phrase).map((t) => termScore(t, fields)));
      const synonyms = (SYNONYMS[term] ?? []).map((p) => phraseScore(p) * 0.85);
      return Math.max(termScore(term, fields), ...synonyms);
    });
    const matched = perTerm.filter((s) => s > 0).length;
    let score = perTerm.reduce((a, b) => a + b, 0);
    if (name.includes(phrase)) score += 15;
    return { service, score, matched };
  });

  const strict = scored.filter((s) => s.matched === terms.length).sort((a, b) => b.score - a.score);
  if (strict.length) {
    // Drop long-tail hits that only matched through descriptions or typos.
    const floor = strict[0].score * 0.3;
    return { hits: strict.filter((h) => h.score >= floor), approximate: false };
  }
  const loose = scored.filter((s) => s.matched > 0).sort((a, b) => b.score - a.score);
  return { hits: loose, approximate: loose.length > 0 };
}
