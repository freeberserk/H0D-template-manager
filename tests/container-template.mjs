import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const json=JSON.parse(await readFile(new URL("../data/templates/H0D_Actor-template-conteneur-v1.0.json",import.meta.url),"utf8"));
const index=JSON.parse(await readFile(new URL("../data/templates/index.json",import.meta.url),"utf8"));
const manager=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const keys=new Set();
function visit(v){
  if(!v||typeof v!=="object")return;
  if(v.type && v.key && !["custom_header","custom_body"].includes(v.key)){
    assert.ok(!keys.has(v.key),"Duplicate CSB key: "+v.key);
    keys.add(v.key);
  }
  for(const item of Object.values(v))visit(item);
}
assert.equal(json.type,"_template");
assert.equal(json._id,"H0DContActor0001");
assert.equal(json.system.templateSystemUniqueVersion,1070000001);
assert.equal(json.prototypeToken.actorLink,true,"Container stock can persist across token scenes");
assert.deepEqual(json.system.attributeBar,{},"Container does not inherit creature combat stats");
assert.equal(json.items.length,0,"Container does not gain carried Actor items");
visit(json.system.header);visit(json.system.body);
for(const key of ["H0D_Conteneur_Mode","H0D_Conteneur_Description","H0D_Conteneur_Proprietaire","H0D_Conteneur_Etat"]){
 assert.ok(keys.has(key),"Missing container field: "+key);
}
assert.match(manager,/key:"actor-conteneur".*H0DContActor0001/,"Manager registry includes container");
assert.ok(index.some(x=>x.id===json._id&&x.file==="H0D_Actor-template-conteneur-v1.0.json"));
assert.equal(index.filter(x=>x.id===json._id).length,1);
console.log("OK: Actor Conteneur v1.0 template and manager registration");
