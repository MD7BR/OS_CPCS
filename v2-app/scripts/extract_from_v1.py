#!/usr/bin/env python3
"""
Deterministic extractor that lifts 100% of the compiled Silberschatz 10th Ed.
Knowledge Trove datasets and all 22 interactive simulator engines (W0-W19) +
Formula Sandboxes verbatim from ../index.html into v2-app/src/.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
V1_HTML = ROOT / "index.html"
OUT_DATA = ROOT / "v2-app" / "src" / "data"
OUT_SIMS = ROOT / "v2-app" / "src" / "simulators"


def extract_json_const(text: str, name: str):
    pattern = rf"const\s+{re.escape(name)}\s*=\s*(.+?);\s*\n"
    m = re.search(pattern, text)
    if not m:
        raise RuntimeError(f"Could not locate const {name} in {V1_HTML}")
    raw = m.group(1).strip()
    return json.loads(raw)


def main():
    OUT_DATA.mkdir(parents=True, exist_ok=True)
    OUT_SIMS.mkdir(parents=True, exist_ok=True)

    text = V1_HTML.read_text(encoding="utf-8")
    lines = text.splitlines()

    # 1. Extract all 6 knowledge trove JSON payloads verbatim
    trove = {
        "THEORY_KNOWLEDGE_BASE": extract_json_const(text, "THEORY_KNOWLEDGE_BASE"),
        "QUIZ_KNOWLEDGE_BASE": extract_json_const(text, "QUIZ_KNOWLEDGE_BASE"),
        "FORMULAS_DATA": extract_json_const(text, "FORMULAS_DATA"),
        "GLOSSARY_DATA": extract_json_const(text, "GLOSSARY_DATA"),
        "KEYWORDS_LEXICON": extract_json_const(text, "KEYWORDS_LEXICON"),
        "TEACHING_TROVE_DATA": extract_json_const(text, "TEACHING_TROVE_DATA"),
    }

    trove_path = OUT_DATA / "knowledgeTrove.json"
    trove_path.write_text(json.dumps(trove, ensure_ascii=False), encoding="utf-8")

    # 2. Extract the 22 interactive simulators + attachFormulaSandboxes + mountLegacySimulator
    def find_line(needle: str) -> int:
        for i, l in enumerate(lines):
            if needle in l:
                return i
        raise RuntimeError(f"Marker not found: {needle}")

    sim_start = find_line("const W0_DualModeSimulator = {")
    sim_end = find_line("// AUDIO SYNTHESIZER")
    sandbox_start = find_line("function attachFormulaSandboxes(bodyRoot) {")
    sandbox_end = find_line("function renderTheoryBodyOnly(")
    mount_start = find_line("// Deck 02: Dual-Mode Hardware & IVT Traps")
    mount_end = find_line("// BOTTOM SCRUBBER TRANSPORT LOOP")

    # Trim trailing lines after deck_22's closing brace (leaving exactly deck_22's `}`)
    mount_slice = lines[mount_start:mount_end]
    # Find the exact closing brace of renderActiveLabContent (4-space indent `    }`)
    for idx in range(len(mount_slice) - 1, -1, -1):
        if mount_slice[idx] == "    }":
            mount_slice = mount_slice[:idx]
            break

    sim_code = "\n".join(lines[sim_start:sim_end])
    sandbox_code = "\n".join(lines[sandbox_start:sandbox_end])
    mount_code = "\n".join(mount_slice)

    bundle = f"""// Auto-extracted verbatim from v1 index.html by scripts/extract_from_v1.py
// Contains all 22 interactive OS simulators (W0-W19) + Formula Sandboxes.
/* eslint-disable */

let _soundRef = {{
  click() {{}},
  chime() {{}},
  alarm() {{}},
  modeSwitch() {{}},
}};

const Sound = {{
  click(f) {{ _soundRef.click(f); }},
  chime() {{ _soundRef.chime(); }},
  alarm() {{ _soundRef.alarm(); }},
  modeSwitch() {{ _soundRef.modeSwitch(); }},
}};

export function bindSimulatorSound(soundApi) {{
  if (soundApi) _soundRef = soundApi;
}}

{sim_code}

{sandbox_code}

export function mountLegacySimulator(nodeId, stage, formulas) {{
  if (!stage) return;
  const formulaTarget = formulas || {{ innerHTML: '' }};
  const formulasRef = formulaTarget;
  // Local alias 'formulas' expected by extracted deck blocks:
  return (function(formulas) {{
{mount_code}
  }})(formulasRef);
}}

export {{ attachFormulaSandboxes }};
"""

    sim_path = OUT_SIMS / "legacySimulators.js"
    sim_path.write_text(bundle, encoding="utf-8")

    # Write TypeScript declaration file for legacySimulators.js
    dts_path = OUT_SIMS / "legacySimulators.d.ts"
    dts_path.write_text(
        """export interface SoundBridge {
  click: (freq?: number) => void;
  chime: () => void;
  alarm: () => void;
  modeSwitch: () => void;
}
export function bindSimulatorSound(soundApi: SoundBridge): void;
export function mountLegacySimulator(
  nodeId: string,
  stage: HTMLElement,
  formulas?: HTMLElement | { innerHTML: string } | null
): void;
export function attachFormulaSandboxes(bodyRoot: HTMLElement): void;
""",
        encoding="utf-8",
    )

    print(
        f"[OK] Extracted {len(trove['THEORY_KNOWLEDGE_BASE'])} decks, "
        f"{sum(len(v) for v in trove['QUIZ_KNOWLEDGE_BASE'].values())} MCQs, "
        f"{len(trove['FORMULAS_DATA'])} formulas, "
        f"{len(trove['GLOSSARY_DATA'])} glossary entries, "
        f"{len(trove['KEYWORDS_LEXICON'])} keywords -> {trove_path.name} ({trove_path.stat().st_size:,} B)"
    )
    print(f"[OK] Extracted 22 simulator engines -> {sim_path.name} ({sim_path.stat().st_size:,} B)")


if __name__ == "__main__":
    main()
