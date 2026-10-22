import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load = async path => JSON.parse(await readFile(new URL("../"+path, import.meta.url), "utf8"));

const expected = [
  {
    path:"data/templates/H0D_Actor-template-PJ-v3.73.json",
    name:"H0D_Actor-template-PJ v3.73",
    defense:"${H0D_Defense_Totale_Calc}$",
    perception:"${H0D_Skill_Perception_Total}$",
    detection:"${10 + H0D_Skill_Perception_Total}$"
  },
  {
    path:"data/templates/H0D_Actor-template-creature-v1.28.json",
    name:"H0D_Actor-template-creature v1.28",
    defense:"${H0D_Creature_DEF_Total_Calc}$",
    perception:"${H0D_Creature_Perception}$",
    detection:"${H0D_Creature_Detection_Calc}$"
  },
  {
    path:"data/templates/H0D_Actor-template-machine-v3.18.json",
    name:"H0D_Actor-template-machine v3.18",
    defense:"${H0D_Machine_DEF_Total_Calc}$",
    perception:"${H0D_Machine_Perception_Effective_Calc}$",
    detection:"${H0D_Machine_Detection_Calc}$"
  }
];

const keys=["H0D_Health","H0D_Defense","H0D_Perception","H0D_Detection"];

for(const e of expected){
  const doc=await load(e.path);
  assert.equal(doc.name,e.name);
  assert.deepEqual(Object.keys(doc.system.attributeBar || {}),keys,
    "Les quatre interfaces communes doivent être présentes dans le même ordre : "+e.path);

  for(const key of keys){
    assert.equal(doc.system.attributeBar[key]?.editable,false,key+" doit être non éditable");
  }

  assert.equal(doc.system.attributeBar.H0D_Defense.value,e.defense);
  assert.equal(doc.system.attributeBar.H0D_Defense.max,e.defense);
  assert.equal(doc.system.attributeBar.H0D_Perception.value,e.perception);
  assert.equal(doc.system.attributeBar.H0D_Perception.max,e.perception);
  assert.equal(doc.system.attributeBar.H0D_Detection.value,e.detection);
  assert.equal(doc.system.attributeBar.H0D_Detection.max,e.detection);
  assert.equal(doc.prototypeToken?.bar1?.attribute,"attributeBar.H0D_Health");
}

const helper=await readFile(new URL("../scripts/h0d-common-stats.js",import.meta.url),"utf8");
assert.ok(helper.includes('"H0D_Health"'));
assert.ok(helper.includes('"H0D_Defense"'));
assert.ok(helper.includes('"H0D_Perception"'));
assert.ok(helper.includes('"H0D_Detection"'));
assert.ok(helper.includes("H0D_Defense_Totale_Calc"),"Fallback PJ DEF absent");
assert.ok(helper.includes("H0D_Creature_DEF_Total_Calc"),"Fallback Créature DEF absent");
assert.ok(helper.includes("H0D_Machine_DEF_Total_Calc"),"Fallback Machine DEF absent");

const attacks=await readFile(new URL("../scripts/h0d-attacks.js",import.meta.url),"utf8");
assert.ok(attacks.includes('commonStat(targetActor,"H0D_Defense",{legacy:true})'),
  "Le lanceur d'attaques doit utiliser l'interface commune de DEF");

const manager=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
assert.ok(manager.includes('"common-interface-missing"'),"L'audit doit contrôler l'interface commune");
assert.ok(manager.includes("commonInterfaceCandidates"),"Le triage doit compter les interfaces communes réparables");
assert.ok(manager.includes("commonStats"),"L'API Template Manager doit exposer les stats communes");

console.log("Common actor interface H0D_Health / Defense / Perception / Detection OK");
