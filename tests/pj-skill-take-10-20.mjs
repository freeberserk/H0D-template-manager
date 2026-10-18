import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const oldPj=await load("data/templates/H0D_Actor-template-PJ-v3.70.json");
const pj=await load("data/templates/H0D_Actor-template-PJ-v3.71.json");

function walk(root,fn){
  if(Array.isArray(root)){root.forEach(v=>walk(v,fn));return;}
  if(!root||typeof root!=="object")return;
  fn(root);
  for(const v of Object.values(root))walk(v,fn);
}
function inputKeys(root){
  const out=new Set();
  const inputTypes=new Set(["numberField","textField","textArea","select","checkbox","dynamicTable","radioButton","meter"]);
  function rec(node,insideTable=false){
    if(Array.isArray(node)){node.forEach(v=>rec(v,insideTable));return;}
    if(!node||typeof node!=="object")return;
    const type=String(node.type||""), key=String(node.key||"");
    if(key&&inputTypes.has(type)&&(!insideTable||type==="dynamicTable"))out.add(key);
    const next=insideTable||type==="dynamicTable";
    for(const v of Object.values(node))rec(v,next);
  }
  rec(root.system,false);
  return [...out].sort();
}

assert.equal(pj._id,oldPj._id,"L’ID stable du template PJ doit être conservé");
assert.equal(pj.name,"H0D_Actor-template-PJ v3.71");
assert.deepEqual(inputKeys(pj),inputKeys(oldPj),"Faire 10/20 ne doit ajouter aucun champ de données racine");

const take10=[],take20=[];
walk(pj,o=>{
  if(o.type==="label"&&String(o.cssClass||"").includes("h0d-take-10"))take10.push(o);
  if(o.type==="label"&&String(o.cssClass||"").includes("h0d-take-20"))take20.push(o);
});
assert.equal(take10.length,23,"23 commandes Faire 10 attendues");
assert.equal(take20.length,23,"23 commandes Faire 20 attendues");
for(const o of take10){
  assert.equal(o.value,"10");
  assert.ok(o.rollMessage.includes("Faire 10"),"Carte Faire 10 absente");
  assert.equal(o.rollMessage.includes("[1d20]"),false,"Faire 10 ne doit lancer aucun d20");
  assert.ok(o.rollMessage.includes("menace"),"Rappel de condition Faire 10 absent");
  assert.ok(o.rollMessage.includes("entraînement"),"Rappel entraînement Faire 10 absent");
}
for(const o of take20){
  assert.equal(o.value,"20");
  assert.ok(o.rollMessage.includes("Faire 20"),"Carte Faire 20 absente");
  assert.equal(o.rollMessage.includes("[1d20]"),false,"Faire 20 ne doit lancer aucun d20");
  assert.ok(o.rollMessage.includes("20×"),"Rappel temps Faire 20 absent");
  assert.ok(o.rollMessage.includes("n’est pas un 20 naturel"),"Faire 20 doit préciser que ce n’est pas un 20 naturel");
}

const text=JSON.stringify(pj);
for(const key of [
  "H0D_Skill_Acrobaties_Total","H0D_Skill_Reparation_Total","H0D_Focus_Bonus",
  "H0D_Artisanat_Chimique_Total","H0D_Artisanat_Autre_Total",
  "H0D_Connaissance_Total","H0D_Quick_Perception_Roll",
  "H0D_Quick_Skill_1_Roll","H0D_Quick_Skill_2_Roll","H0D_Quick_Skill_3_Roll"
]) assert.ok(text.includes(key),`Accès compétence manquant après refonte : ${key}`);

assert.ok(text.includes("FAIRE 10 / FAIRE 20"),"Rappel de règles sur la fiche absent");
assert.ok(text.includes("sameRow('H0D_Connaissance_Total')"),"Faire 10/20 doit fonctionner dans les Connaissances dynamiques");
assert.ok(text.includes("switchCase(H0D_Quick_Skill_1"),"Faire 10/20 doit suivre la compétence du raccourci 1");
assert.ok(text.includes("[1d20]"),"Les jets normaux de compétence doivent rester présents");

console.log("PJ Take 10 / Take 20 v3.71 OK");
