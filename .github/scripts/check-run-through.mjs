// Fails when a check step in a workflow job can be skipped by an earlier failure.
// Every step except checkout must carry `if: ${{ !cancelled() }}` (or `always()`).
// Usage: node check-run-through.mjs <workflow.yml>...
import { readFileSync } from 'node:fs';

const RUN_THROUGH = /^\s+if:\s*\$\{\{\s*(!cancelled\(\)|always\(\))\s*\}\}\s*$/;
const STEP_START = /^(\s+)- (name|uses|run|id|if):/;

let failures = 0;
for (const file of process.argv.slice(2)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const steps = [];
  let inSteps = false;
  let indent = null;
  for (const line of lines) {
    if (/^\s+steps:\s*$/.test(line)) { inSteps = true; indent = null; continue; }
    if (!inSteps) continue;
    const m = line.match(STEP_START);
    if (m && (indent === null || m[1].length === indent)) {
      indent = m[1].length;
      steps.push([line]);
    } else if (steps.length && (line.trim() === '' || line.search(/\S/) > indent)) {
      steps[steps.length - 1].push(line);
    } else if (line.trim() !== '') {
      inSteps = false;
    }
  }
  if (steps.length === 0) {
    console.error(`${file}: no steps found`);
    failures++;
  }
  for (const step of steps) {
    const name = (step.find((l) => /- name:|^\s+name:/.test(l)) || step[0]).replace(/.*name:\s*/, '').trim();
    if (step.some((l) => /uses:\s*actions\/checkout@/.test(l))) continue;
    // A step's `if:` sits at the step's own key indent.
    if (!step.some((l) => RUN_THROUGH.test(l) && l.search(/\S/) === indent + 2)) {
      console.error(`${file}: step "${name}" lacks if: \${{ !cancelled() }}`);
      failures++;
    }
  }
}
if (failures) process.exit(1);
console.log('every check step runs through earlier failures');
