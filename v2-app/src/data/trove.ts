import rawTrove from './knowledgeTrove.json';

export interface TheoryEntry {
  title: string;
  citations: string;
  formulas: string;
  html: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface FormulaItem {
  name: string;
  category: string;
  formula: string;
  notes: string;
}

export interface GlossaryItem {
  term: string;
  mod: string;
  def: string;
}

export interface BugHuntItem {
  title: string;
  prompt: string;
  items: string[];
  bugIdx: number;
  fix: string;
}

export interface SocraticItem {
  q: string;
  a: string;
}

export interface TeachingTroveEntry {
  inlineSabotage?: {
    find: string;
    sabotaged: string;
    explanation: string;
  };
  bugHunts?: BugHuntItem[];
  socratic?: SocraticItem[];
}

interface RawTrove {
  THEORY_KNOWLEDGE_BASE: Record<string, TheoryEntry>;
  QUIZ_KNOWLEDGE_BASE: Record<string, QuizQuestion[]>;
  FORMULAS_DATA: FormulaItem[];
  GLOSSARY_DATA: GlossaryItem[];
  KEYWORDS_LEXICON: [string, string][];
  TEACHING_TROVE_DATA: Record<string, TeachingTroveEntry>;
}

const trove = rawTrove as unknown as RawTrove;

export const THEORY_KNOWLEDGE_BASE = trove.THEORY_KNOWLEDGE_BASE;
export const QUIZ_KNOWLEDGE_BASE = trove.QUIZ_KNOWLEDGE_BASE;
export const FORMULAS_DATA = trove.FORMULAS_DATA;
export const GLOSSARY_DATA = trove.GLOSSARY_DATA;
export const KEYWORDS_LEXICON = trove.KEYWORDS_LEXICON;
export const TEACHING_TROVE_DATA = trove.TEACHING_TROVE_DATA;

// Fast lookup map for inline <HoverCard> glossary previews on highlighted OS keywords
export const GLOSSARY_LOOKUP: Map<string, GlossaryItem> = (() => {
  const map = new Map<string, GlossaryItem>();
  for (const item of GLOSSARY_DATA) {
    const full = item.term.toLowerCase();
    map.set(full, item);
    // Also index stripped parenthetical acronym and base phrase
    const base = full.replace(/\s*\([^)]*\)/g, '').trim();
    if (base && !map.has(base)) map.set(base, item);
    const paren = full.match(/\(([^)]+)\)/);
    if (paren && paren[1] && !map.has(paren[1].trim())) {
      map.set(paren[1].trim(), item);
    }
  }
  return map;
})();
