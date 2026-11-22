import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read = async name => readFile(new URL("../"+name, import.meta.url), "utf8");
const weapon=JSON.parse(await read("data/templates/H0D_Arme-v3.0.json"));
const object=JSON.parse(await read("data/templates/H0D_Objet-v3.0.json"));
const weaponOld=JSON.parse(await read("data/templates/H0D_Arme-v2.9.json"));
const objectOld=JSON.parse(await read("data/templates/H0D_Objet-v2.9.json"));
const index=JSON.parse(await read("data/templates/index.json"));
const script=await read("scripts/h0d-template-manager.js");
const recover=await read("scripts/h0d-ammo-recovery.js");

function components(node,key){
  if(!node||typeof node!=="object")return [];
  if(Array.isArray(node))return node.flatMap(v=>components(v,key));
  return [...(node.key===key?[node]:[]),...Object.values(node).flatMap(v=>components(v,key))];
}
for(const [name,newTemplate,oldTemplate,key,id,newPath] of [
  ["H0D_Arme v3.0",weapon,weaponOld,"H0D_Arme_Type_Munition","O6qwtv7ozECILPHV","H0D_Arme-v3.0.json"],
  ["H0D_Objet v3.0",object,objectOld,"H0D_Objet_Munition_Famille","H0DObjTpl0000001","H0D_Objet-v3.0.json"]
]){
  assert.equal(newTemplate.name,name);
  assert.equal(newTemplate._id,id);
  assert.equal(newTemplate.system.templateSystemUniqueVersion,oldTemplate.system.templateSystemUniqueVersion+1);
  const [select]=components(newTemplate.system,key);
  const [before]=components(oldTemplate.system,key);
  assert.ok(select&&before);
  assert.equal(select.type,"select");
  const choices=select.options.map(o=>o.key);
  assert.equal(choices.filter(k=>k==="Javelot").length,1);
  for(const k of before.options.map(o=>o.key)) assert.ok(choices.includes(k),"Choix historique supprimé : "+k);
  const def=index.find(e=>e.id===id);
  assert.equal(def.file,newPath);
  assert.equal(def.name,name);
  assert.ok(script.includes('file:"'+newPath+'"'));
}
assert.match(recover,/RECOVERABLE_AMMO_TYPES = new Set\(\["Fleche","Carreau","Projectile","Javelot"\]\)/);
assert.match(script,/const MODULE_VERSION = "1\.7\.41";/);
console.log("Famille Javelot isolée, sélecteurs et récupération : OK");
