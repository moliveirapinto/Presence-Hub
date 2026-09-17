#!/usr/bin/env node
/**
 * Report which locale tables are missing keys, so partial translations are visible instead
 * of silently falling back to English mid-sentence.
 *
 *   node scripts/i18n-check.mjs           # report
 *   node scripts/i18n-check.mjs --strict  # also exit non-zero if anything is missing
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "PresenceHub/index.ts"), "utf8");

const block = (re) => {
  const m = src.match(re);
  if (!m) throw new Error(`Could not locate block: ${re}`);
  return m[0];
};

/** Keys only ever follow `{` or `,` — matching bare `name:"` also hits text inside values. */
const KEY_RE = /(?:^|[{,])\s*([A-Za-z_]+)\s*:\s*"/gm;

const keysIn = (text) => new Set([...text.matchAll(KEY_RE)].map((m) => m[1]));

const enKeys = [...keysIn(block(/const EN: I18nStrings = \{[\s\S]*?\n\};/))];

const translations = block(/const TRANSLATIONS[\s\S]*?\n\};/);

/** Walk each `xx:{...}` entry, brace-matching so nested braces don't truncate it. */
const locales = [];
const head = /^("[\w-]+"|[a-z-]+):\{/gm;
let m;
while ((m = head.exec(translations)) !== null) {
  const start = m.index + m[0].length - 1;
  let depth = 0;
  let i = start;
  for (; i < translations.length; i++) {
    if (translations[i] === "{") depth++;
    else if (translations[i] === "}" && --depth === 0) break;
  }
  const body = translations.slice(start, i + 1);
  const have = keysIn(body);
  locales.push({
    code: m[1].replace(/"/g, ""),
    missing: enKeys.filter((k) => !have.has(k)),
  });
}

const incomplete = locales.filter((l) => l.missing.length > 0);
console.log(`${enKeys.length} keys, ${locales.length} locales, ${incomplete.length} incomplete\n`);
for (const l of incomplete) {
  console.log(`${l.code.padEnd(6)} missing ${String(l.missing.length).padStart(2)}: ${l.missing.join(", ")}`);
}
if (!incomplete.length) console.log("All locales complete.");

if (process.argv.includes("--strict") && incomplete.length) process.exit(1);
