import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const base=new URL("../data/templates/",import.meta.url);
const old=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.22.json",base),"utf8"));
const newer=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.23.json",base),"utf8"));
assert.equal(newer._id,old._id,"Must keep same template ID");
assert.equal(newer.system.templateSystemUniqueVersion,old.system.templateSystemUniqueVersion+1);
const panels=newer.system.body.contents[0].contents[0].contents[0].contents;
const oldPanels=old.system.body.contents[0].contents[0].contents[0].contents;
assert.equal(panels.length,oldPanels.length);
const panel=panels.find(x=>String(x.visibilityFormula).includes("PillardsRouges"));
assert.ok(panel,"Missing Pillards score panel");
assert.ok(panel.visibilityFormula.includes("CaravanesLibres"));
assert.ok(panel.visibilityFormula.includes("Héroïque"));
const scoreKeys=[];
function walk(n){if(!n||typeof n!=="object")return;
  if(n.key&&/H0D_Creature_(FOR|DEX|CON|INT|SAG|CHA)_SCORE/.test(n.key))scoreKeys.push(n.key);
  Object.values(n).forEach(walk);
}
walk(panel);
assert.equal(scoreKeys.length,6);
const normalized=structuredClone(newer);
normalized.name=old.name;
normalized.system.templateSystemUniqueVersion=old.system.templateSystemUniqueVersion;
normalized.system.body.contents[0].contents[0].contents[0].contents
  .find(x=>String(x.visibilityFormula).includes("PillardsRouges")).visibilityFormula=
  oldPanels.find(x=>String(x.visibilityFormula).includes("CaravanesLibres")).visibilityFormula;
assert.deepEqual(normalized,old,"No additional changes to Creature mechanics permitted");
console.log("OK: Creature v1.23 only exposes SRD scores for Pillards; all other form fields/formulas unchanged.");
