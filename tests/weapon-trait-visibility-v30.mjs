// BAC CSB 6.1.2 : vérification structurelle des trois conditions de visibilité
// des colonnes de traits du template Arme. Exécution Foundry requise.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const read=async path=>JSON.parse(await readFile(new URL("../"+path,import.meta.url),"utf8"));
const before=await read("data/templates/H0D_Arme-v2.9.json");
const after=await read("data/templates/H0D_Arme-v3.0.json");
const index=await read("data/templates/index.json");
const moduleManifest=await read("module.json");
const keys=["H0D_Arme_Trait_Perso","H0D_Arme_Trait_Valeur","H0D_Arme_Trait_Parametre"];
function collect(root,key){
 const res=[];
 function walk(n){
  if(!n||typeof n!=="object")return;
  if(n.key===key)res.push(n);
  for(const v of Object.values(n))walk(v);
 }
 walk(root);assert.equal(res.length,1,key+" : cle absente ou multiple");
 return res[0];
}
assert.equal(moduleManifest.version,"1.7.42");
assert.equal(after._id,before._id);
assert.equal(after.name,"H0D_Arme v3.0");
assert.equal(after.system.templateSystemUniqueVersion,before.system.templateSystemUniqueVersion+1);
assert.equal(index.find(x=>x.id===after._id)?.file,"H0D_Arme-v3.0.json");
const restored=structuredClone(after);
restored.name=before.name;
restored.system.templateSystemUniqueVersion=before.system.templateSystemUniqueVersion;
for(const key of keys){
 const old=collect(before.system,key).visibilityFormula;
 const current=collect(after.system,key).visibilityFormula;
 assert.ok(old.startsWith("$"+"{")&&old.endsWith("}$"),"Ancienne condition non reconnue pour "+key);
 assert.equal(current,old.slice(2,-2),"Ne changer que les delimitateurs pour "+key);
 assert.ok(!current.includes("$"+"{")&&!current.includes("}$"));
 assert.ok(current.includes("sameRow('H0D_Arme_Trait_Type')"),"Reference de ligne perdue : "+key);
 collect(restored.system,key).visibilityFormula=old;
}
assert.deepEqual(restored,before,"D'autres proprietes du template Arme ont ete modifiees");
// Les formules directes doivent conserver les conditions de visibilité métiers.
assert.equal(collect(after.system,"H0D_Arme_Trait_Parametre").visibilityFormula,
 "equalText(sameRow('H0D_Arme_Trait_Type'),'polyvalent')");
assert.equal(collect(after.system,"H0D_Arme_Trait_Perso").visibilityFormula,
 "equalText(sameRow('H0D_Arme_Trait_Type'),'autre')");
assert.equal(collect(after.system,"H0D_Arme_Trait_Valeur").visibilityFormula,
 "switchCase(sameRow('H0D_Arme_Trait_Type'),'precis',true,'allonge',true,'portee',true,'lourd',true,'anti_blindage',true,'surchauffe',true,false)");
console.log("Arme v3.0 : 3 conditions normalisees, donnees et proprietes conservees. Test CSB reel encore requis.");
