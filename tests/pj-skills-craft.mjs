import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const pj=JSON.parse(await readFile(new URL("../data/templates/H0D_Actor-template-PJ-v3.71.json",import.meta.url),"utf8"));

function walk(root,fn){
  if(Array.isArray(root)){root.forEach(v=>walk(v,fn));return;}
  if(!root||typeof root!=="object")return;
  fn(root);
  for(const v of Object.values(root))walk(v,fn);
}
function findKey(key){
  let hit=null;
  walk(pj,o=>{if(!hit&&o.key===key)hit=o;});
  return hit;
}

assert.equal(pj.name,"H0D_Actor-template-PJ v3.71");
const raw=JSON.stringify(pj);
assert.equal(raw.includes("Réparation / Artisanat"),false,"Réparation doit être séparée d’Artisanat");

const classRank={
  Fort:"H0D_Classe_Fort_Rangs",
  Rapide:"H0D_Classe_Rapide_Rangs",
  Robuste:"H0D_Classe_Robuste_Rangs",
  Intelligent:"H0D_Classe_Intelligent_Rangs",
  Devoue:"H0D_Classe_Devoue_Rangs",
  Charismatique:"H0D_Classe_Charismatique_Rangs"
};
const allClasses=Object.keys(classRank);

const fixed={
  Acrobaties:["Rapide"],
  Athletisme:["Fort","Robuste"],
  Discretion:["Rapide"],
  Perception:["Robuste","Devoue"],
  Survie:["Robuste","Devoue"],
  Technologie:["Intelligent"],
  Reparation:["Fort","Intelligent"],
  Soins:["Devoue"],
  Diplomatie:["Charismatique"]
};
for(const [skill,expected] of Object.entries(fixed)){
  const calc=findKey(`H0D_Skill_${skill}_Classe_Effective_Calc`);
  assert.ok(calc,`Calcul classe absent : ${skill}`);
  for(const c of expected) assert.ok(calc.value.includes(classRank[c]),`${skill} doit être de classe pour ${c}`);
  for(const c of allClasses.filter(c=>!expected.includes(c))) assert.equal(calc.value.includes(classRank[c]),false,`${skill} ne doit pas être de classe pour ${c}`);
  assert.ok(findKey(`H0D_Skill_${skill}_Bonus_Origine`),`Bonus origine absent : ${skill}`);
  assert.ok(findKey(`H0D_Skill_${skill}_Total`).value.includes(`H0D_Skill_${skill}_Bonus_Origine`),`Total sans bonus origine : ${skill}`);
}
assert.ok(findKey("H0D_Focus_Bonus_Origine"),"Bonus origine Focus absent");
assert.ok(findKey("H0D_Focus_Bonus").value.includes("H0D_Focus_Bonus_Origine"),"Focus n’intègre pas son bonus origine");

const knowledge=findKey("H0D_Connaissance_Classe_Effective_Calc");
for(const c of ["Intelligent","Devoue"]) assert.ok(knowledge.value.includes(classRank[c]),`Connaissances doit être de classe pour ${c}`);
for(const c of ["Fort","Rapide","Robuste","Charismatique"]) assert.equal(knowledge.value.includes(classRank[c]),false,`Connaissances ne doit pas être de classe pour ${c}`);
assert.ok(findKey("H0D_Connaissance_Bonus_Origine"),"Bonus origine Connaissances absent");
assert.ok(findKey("H0D_Connaissance_Total").value.includes("H0D_Connaissance_Bonus_Origine"),"Total Connaissances sans bonus origine");

const crafts={
  Chimique:["Intelligent"],
  Electronique:["Intelligent"],
  Mecanique:["Rapide","Robuste","Intelligent"],
  Pharmaceutique:["Intelligent","Devoue"],
  Structurel:["Fort","Robuste","Intelligent"],
  Arts_Visuels:["Intelligent","Devoue","Charismatique"],
  Ecriture:["Intelligent","Devoue","Charismatique"],
  Autre:[]
};
for(const [craft,expected] of Object.entries(crafts)){
  for(const suffix of ["Rangs","Classe","Bonus_Origine","Divers","Total"]) assert.ok(findKey(`H0D_Artisanat_${craft}_${suffix}`),`Artisanat ${craft} : ${suffix} absent`);
  const calc=findKey(`H0D_Artisanat_${craft}_Classe_Effective_Calc`);
  assert.ok(calc,`Calcul classe Artisanat absent : ${craft}`);
  for(const c of expected) assert.ok(calc.value.includes(classRank[c]),`Artisanat ${craft} doit être de classe pour ${c}`);
  for(const c of allClasses.filter(c=>!expected.includes(c))) assert.equal(calc.value.includes(classRank[c]),false,`Artisanat ${craft} ne doit pas être de classe pour ${c}`);
  assert.ok(findKey(`H0D_Artisanat_${craft}_Total`).value.includes("H0D_INT_MOD"),`Artisanat ${craft} doit utiliser INT`);
}
assert.ok(findKey("H0D_Artisanat_Autre_Nom"),"Nom libre Artisanat — Autre absent");
assert.equal(/H0D_Classe_/.test(findKey("H0D_Artisanat_Autre_Classe_Effective_Calc").value),false,"Artisanat — Autre ne doit jamais être automatique");

const spent=findKey("H0D_Skill_Rangs_Investis_Calc").value;
for(const craft of Object.keys(crafts)) assert.ok(spent.includes(`H0D_Artisanat_${craft}_Rangs`),`Coût des rangs Artisanat ${craft} absent du budget`);

for(let n=1;n<=3;n++){
  const select=findKey(`H0D_Quick_Skill_${n}`);
  const roll=findKey(`H0D_Quick_Skill_${n}_Roll`);
  for(const craft of Object.keys(crafts)){
    assert.ok(select.options.some(o=>o.key===`Artisanat_${craft}`),`Raccourci ${n} : option Artisanat ${craft} absente`);
    assert.ok(roll.value.includes(`H0D_Artisanat_${craft}_Total`),`Raccourci ${n} : total Artisanat ${craft} absent`);
  }
}

console.log("PJ skills / Artisanat v3.70 OK");
