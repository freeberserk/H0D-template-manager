import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load = async path => JSON.parse(await readFile(new URL("../"+path, import.meta.url), "utf8"));

const cases = [
  {
    path:"data/templates/H0D_Actor-template-PJ-v3.74.json",
    name:"H0D_Actor-template-PJ v3.74",
    value:"${H0D_PV_Actuels}$",
    max:"${H0D_PV_Max_Calc}$"
  },
  {
    path:"data/templates/H0D_Actor-template-creature-v1.28.json",
    name:"H0D_Actor-template-creature v1.28",
    value:"${H0D_Creature_PV_Actuels}$",
    max:"${H0D_Creature_PV_Max_Calc}$"
  },
  {
    path:"data/templates/H0D_Actor-template-machine-v3.18.json",
    name:"H0D_Actor-template-machine v3.18",
    value:"${H0D_Machine_PV_Actuels}$",
    max:"${H0D_Machine_PV_Max_Calc}$"
  }
];

for (const expected of cases) {
  const doc=await load(expected.path);
  assert.equal(doc.name, expected.name, "Version/template inattendu : "+expected.path);
  assert.ok(Object.prototype.hasOwnProperty.call(doc.system.attributeBar || {},"H0D_Health"),
    "Le template doit exposer H0D_Health : "+expected.path);
  const bar=doc.system.attributeBar.H0D_Health;
  assert.equal(bar.value, expected.value, "Formule Value H0D_Health incorrecte : "+expected.path);
  assert.equal(bar.max, expected.max, "Formule Maximum H0D_Health incorrecte : "+expected.path);
  assert.equal(bar.editable, false, "La barre complexe H0D_Health doit rester non éditable depuis le token");
  assert.equal(doc.prototypeToken?.bar1?.attribute, "attributeBar.H0D_Health",
    "La barre 1 du prototype token doit utiliser H0D_Health : "+expected.path);
}

console.log("Common H0D_Health attribute bar templates OK");
