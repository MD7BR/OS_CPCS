# -*- coding: utf-8 -*-
"""
Compile, Validate, and Inject the CPCS-361 Silberschatz Knowledge Trove into index.html.
"""
import html.parser
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from part1_decks_02_08 import DECKS_02_08
from part2_decks_09_15 import DECKS_09_15
from part3_decks_16_22 import DECKS_16_22
from part4_quizzes_formulas_glossary import (
    EXTRA_GLOSSARY_DATA,
    FORMULAS_DATA,
    QUIZ_KNOWLEDGE_BASE,
)
from part5_teaching_trove import KEYWORDS_LEXICON, TEACHING_TROVE_DATA

ROOT_DIR = os.path.abspath(os.path.join(HERE, "..", ".."))
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")
BASELINE_GLOSSARY = "/home/alnooh/.gemini/antigravity/brain/304b1b6e-04ea-472a-b483-3ed2fdd11549/scratch/GLOSSARY_DATA.json"

VOID_ELEMENTS = {"br", "hr", "img", "input", "meta", "link"}


class BalanceChecker(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() not in VOID_ELEMENTS:
            self.stack.append(tag.lower())

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing </{t}>")
        elif self.stack[-1] != t:
            self.errors.append(f"Mismatched </{t}> (expected </{self.stack[-1]}>)")
        else:
            self.stack.pop()


def merge_glossary():
    merged = {}
    with open(BASELINE_GLOSSARY, "r", encoding="utf-8") as f:
        base = json.load(f)
    for item in base + EXTRA_GLOSSARY_DATA:
        key = item["term"].strip().lower()
        merged[key] = {
            "term": item["term"].strip(),
            "mod": item["mod"].strip(),
            "def": item["def"].strip(),
        }
    return sorted(merged.values(), key=lambda x: x["term"].lower())


def validate_all(theory, quizzes, formulas, glossary, lexicon, teaching):
    expected_decks = [f"deck_{i:02d}" for i in range(2, 23)]
    assert sorted(theory.keys()) == expected_decks, f"Missing/extra theory decks: {sorted(theory.keys())}"
    assert sorted(quizzes.keys()) == expected_decks, f"Missing/extra quiz decks: {sorted(quizzes.keys())}"
    assert sorted(teaching.keys()) == expected_decks, f"Missing/extra teaching decks: {sorted(teaching.keys())}"

    valid_kw_classes = {"kw-hw", "kw-hazard", "kw-sync", "kw-struct"}
    assert len(lexicon) > 20, "KEYWORDS_LEXICON unexpectedly short"
    for phrase, cls in lexicon:
        assert phrase.strip() == phrase and len(phrase) >= 2, f"Bad lexicon phrase: {phrase!r}"
        assert cls in valid_kw_classes, f"Invalid keyword class {cls!r} for {phrase!r}"

    dirty_re = re.compile(r"(\$+|\\frac|\\tau|\\alpha|\\implies|\\mathbf|\\text|\\le|\\dots|\\to|\\langle|\t)")

    print("=== KNOWLEDGE TROVE VALIDATION REPORT ===")
    for k in expected_decks:
        entry = theory[k]
        h = entry["html"]
        fm = entry["formulas"]
        assert not dirty_re.search(h), f"Dirty LaTeX/tab found in {k} html: {dirty_re.findall(h)}"
        assert not dirty_re.search(fm), f"Dirty LaTeX/tab found in {k} formulas: {dirty_re.findall(fm)}"

        checker = BalanceChecker()
        checker.feed(h)
        checker.close()
        assert not checker.errors and not checker.stack, (
            f"HTML balance error in {k}: errors={checker.errors}, unclosed={checker.stack}"
        )

        qs = quizzes[k]
        assert len(qs) >= 5, f"{k} has fewer than 5 questions: {len(qs)}"
        for idx, q in enumerate(qs):
            assert "Core mastery check" not in q["q"], f"Placeholder left in {k} Q{idx+1}"
            assert not dirty_re.search(q["q"] + q["explanation"]), f"Dirty token in {k} Q{idx+1}"
            assert len(q["opts"]) == 4 and 0 <= q["answer"] < 4
            assert len(q["explanation"]) > 20

        t_entry = teaching[k]
        sab = t_entry["inlineSabotage"]
        cnt = h.count(sab["find"])
        assert cnt == 1, f"{k} inlineSabotage 'find' occurred {cnt} times (expected 1): {sab['find']!r}"
        assert sab["corrupt"] != sab["find"] and len(sab["why"]) > 15, f"Invalid sabotage payload in {k}"
        assert not dirty_re.search(sab["corrupt"] + sab["why"]), f"Dirty token in {k} inlineSabotage"
        swapped = h.replace(sab["find"], sab["corrupt"], 1)
        sab_checker = BalanceChecker()
        sab_checker.feed(swapped)
        sab_checker.close()
        assert not sab_checker.errors and not sab_checker.stack, (
            f"Sabotage HTML balance error in {k}: {sab_checker.errors}, {sab_checker.stack}"
        )

        bunts = t_entry["bugHunts"]
        assert len(bunts) == 2, f"{k} expected 2 bugHunts, got {len(bunts)}"
        for b_idx, b in enumerate(bunts):
            assert b["type"] and b["prompt"] and len(b["fix"]) > 15, f"{k} bugHunt[{b_idx}] incomplete"
            assert 0 <= b["bugIdx"] < len(b["items"]), f"{k} bugHunt[{b_idx}] invalid bugIdx={b['bugIdx']}"
            assert not dirty_re.search(b["prompt"] + " ".join(b["items"]) + b["fix"]), f"Dirty token in {k} bugHunt[{b_idx}]"

        socs = t_entry["socratic"]
        assert len(socs) == 2, f"{k} expected 2 socratic prompts, got {len(socs)}"
        for s_idx, s in enumerate(socs):
            assert len(s["q"]) > 15 and len(s["a"]) > 20, f"{k} socratic[{s_idx}] too short"
            assert not dirty_re.search(s["q"] + s["a"]), f"Dirty token in {k} socratic[{s_idx}]"

        print(f"  {k}: {len(h):6d} html chars | {len(qs)} MCQs | {len(bunts)} BugHunts | 1 Sabotage | balance OK")

    for f in formulas:
        assert not dirty_re.search(f["formula"] + f["desc"]), f"Dirty formula: {f['name']}"
    for g in glossary:
        assert not dirty_re.search(g["def"] + g["term"]), f"Dirty glossary: {g['term']}"

    print(
        f"Total Formulas: {len(formulas)} | Total Glossary Terms: {len(glossary)} | "
        f"Total Quizzes: {sum(len(v) for v in quizzes.values())} | "
        f"Keywords: {len(lexicon)} | Teaching Decks: {len(teaching)}"
    )


def inject_into_index(theory, quizzes, formulas, glossary, lexicon, teaching):
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()

    sorted_lexicon = sorted(lexicon, key=lambda x: (-len(x[0]), x[0]))

    new_lines = []
    replaced = set()
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("const THEORY_KNOWLEDGE_BASE = "):
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const THEORY_KNOWLEDGE_BASE = {json.dumps(theory, ensure_ascii=False)};\n")
            replaced.add("THEORY")
        elif stripped.startswith("const QUIZ_KNOWLEDGE_BASE = "):
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const QUIZ_KNOWLEDGE_BASE = {json.dumps(quizzes, ensure_ascii=False)};\n")
            new_lines.append(f"{indent}const QUIZ_DATA = QUIZ_KNOWLEDGE_BASE;\n")
            replaced.add("QUIZ")
        elif stripped.startswith("const QUIZ_DATA = "):
            # Skip duplicate alias if re-running build_and_inject.py
            continue
        elif stripped.startswith("const KEYWORDS_LEXICON = ") or stripped.startswith("const TEACHING_TROVE_DATA = "):
            # Skip previous teaching injections on re-runs
            continue
        elif stripped.startswith("const FORMULAS_DATA = "):
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const FORMULAS_DATA = {json.dumps(formulas, ensure_ascii=False)};\n")
            replaced.add("FORMULAS")
        elif stripped.startswith("const GLOSSARY_DATA = "):
            indent = line[: len(line) - len(line.lstrip())]
            new_lines.append(f"{indent}const GLOSSARY_DATA = {json.dumps(glossary, ensure_ascii=False)};\n")
            new_lines.append(f"{indent}const KEYWORDS_LEXICON = {json.dumps(sorted_lexicon, ensure_ascii=False)};\n")
            new_lines.append(f"{indent}const TEACHING_TROVE_DATA = {json.dumps(teaching, ensure_ascii=False)};\n")
            replaced.add("GLOSSARY")
        else:
            new_lines.append(line)

    assert replaced == {"THEORY", "QUIZ", "FORMULAS", "GLOSSARY"}, f"Missing replacements: {replaced}"

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print(f"Injected successfully into {INDEX_PATH} ({sum(len(l) for l in new_lines):,} chars)")


if __name__ == "__main__":
    theory = {}
    theory.update(DECKS_02_08)
    theory.update(DECKS_09_15)
    theory.update(DECKS_16_22)
    glossary = merge_glossary()
    validate_all(theory, QUIZ_KNOWLEDGE_BASE, FORMULAS_DATA, glossary, KEYWORDS_LEXICON, TEACHING_TROVE_DATA)
    inject_into_index(theory, QUIZ_KNOWLEDGE_BASE, FORMULAS_DATA, glossary, KEYWORDS_LEXICON, TEACHING_TROVE_DATA)
