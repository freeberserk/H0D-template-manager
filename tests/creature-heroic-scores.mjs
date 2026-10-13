import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const base=new URL("../data/templates/",import.meta.url);
const old=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.21.json",base),"utf8"));
const next=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.22.json",base),"utf8"));
assert.equal(old._id,next._id,"Stable CSB template ID");
const panel=next.system.body.contents[0].contents[0].contents[0].contents[2];
assert.equal(panel.visibilityFormula,"or(equalText(H0D_Creature_Faction,'CaravanesLibres'),equalText(H0D_Creature_Statut_PNJ,'Héroïque'))");
for(const key of ["H0D_Creature_Niveau_PNJ","H0D_Creature_Statut_PNJ","H0D_Creature_Menace"]){
  assert.ok(panel.contents[1].value.includes(key),key);
}
assert.equal(panel.contents[2].type,"table");
assert.equal(panel.contents[2].contents[0].length,6);
const clone=structuredClone(next);clone.name=old.name;
clone.system.templateSystemUniqueVersion=old.system.templateSystemUniqueVersion;
const previous=old.system.body.contents[0].contents[0].contents[0].contents[2];
clone.system.body.contents[0].contents[0].contents[0].contents[2]=previous;
assert.deepEqual(clone,old,"No unrelated changes in creature body or formulas");
console.log("OK: hero score panel visible and combat formulas unchanged.");
