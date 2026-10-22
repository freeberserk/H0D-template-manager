import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const path="data/templates/H0D_Actor-template-creature-v1.28.json";
const doc=JSON.parse(await readFile(new URL("../"+path,import.meta.url),"utf8"));

function findByKey(node,key){
  if(Array.isArray(node)){
    for(const x of node){const r=findByKey(x,key); if(r) return r;}
    return null;
  }
  if(node && typeof node==="object"){
    if(node.key===key) return node;
    for(const x of Object.values(node)){const r=findByKey(x,key); if(r) return r;}
  }
  return null;
}

assert.equal(doc.name,"H0D_Actor-template-creature v1.28");
assert.equal(doc.system.templateSystemUniqueVersion,3034657909);

const size=findByKey(doc.system.body,"H0D_Creature_Taille");
assert.ok(size,"Champ H0D_Creature_Taille absent");
assert.equal(size.type,"select");
assert.equal(size.label,"Taille");
assert.equal(size.defaultValue,"Moyenne");
assert.deepEqual(size.options.map(x=>x.key),[
  "Infime","Minuscule","TresPetite","Petite","Moyenne","Grande","TresGrande","Gigantesque","Colossale"
]);

const menace=findByKey(doc.system.body,"H0D_Creature_Menace");
assert.ok(menace,"Menace disparue");

console.log("Creature size field v1.28 OK");
