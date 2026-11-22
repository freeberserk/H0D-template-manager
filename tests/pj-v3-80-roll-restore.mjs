// Hotfix: restaurer les clics d20 du PJ v3.74 sans perdre la fiche v3.79.
// Test de structure uniquement : validation du clic dans Foundry / CSB en BAC.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const load=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const reference=await load("data/templates/H0D_Actor-template-PJ-v3.74.json");
const before=await load("data/templates/H0D_Actor-template-PJ-v3.79.json");
const after=await load("data/templates/H0D_Actor-template-PJ-v3.80.json");
const manifest=await load("module.json");
const index=await load("data/templates/index.json");
const manager=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const walk=(n,fn)=>{
 if(n==null||typeof n!=="object")return;
 if(Array.isArray(n)){n.forEach(v=>walk(v,fn));return;}
 fn(n);for(const v of Object.values(n))if(v&&typeof v==="object")walk(v,fn);
};
const collect=(o,fn)=>{const a=[];walk(o,n=>{if(fn(n))a.push(n);});return a;};
assert.equal(after._id,before._id,"ID CSB du personnage modifie");
assert.equal(after.name,"H0D_Actor-template-PJ v3.80");
assert.equal(after.system.templateSystemUniqueVersion,before.system.templateSystemUniqueVersion+1);
assert.equal(manifest.version,"1.7.42");
assert.match(manager,/name:"H0D_Actor-template-PJ v3\.81", version:"3\.81", file:"H0D_Actor-template-PJ-v3\.81\.json"/);
assert.equal(index.find(x=>x.id===after._id)?.file,"H0D_Actor-template-PJ-v3.81.json");
const historical=collect(reference.system,n=>n.type==="label"&&n.key&&typeof n.rollMessage==="string"&&
 n.rollMessage.includes("[1d20]")&&
 (/^H0D_Skill_.*_Total$|^H0D_Artisanat_.*_Total$|^H0D_Quick_.*_Roll$|^H0D_Connaissance_Total$/.test(n.key)));
const byKey=new Map(historical.map(n=>[n.key,n.rollMessage]));
assert.equal(byKey.size,22,"Les 22 actions directes de v3.74 doivent etre disponibles");
const broken=collect(before.system,n=>n.type==="label"&&n.rollMessage?.includes("H0D_Test_Mode"));
const direct=collect(after.system,n=>n.type==="label"&&n.rollMessage&&
 (n.rollMessage.startsWith("${#H0D_Jet:=[1d20]}$")||
 n.rollMessage.startsWith("${#H0D_Quick_Jet:=[1d20]}$")||
 n.rollMessage.startsWith("${#H0D_Jet_Connaissance:=[1d20]}$")));
assert.equal(broken.length,23,"Nombre d'actions en panne attendu");
assert.equal(collect(after.system,n=>n.type==="label"&&n.rollMessage?.includes("H0D_Test_Mode")).length,0,
 "Un rollMessage utilise encore le mode de jet a l'origine de la panne");
// Au-dela des 23 messages, aides et 8 icones, la fiche doit etre identique.
const restored=structuredClone(after);
restored.name=before.name;
restored.system.templateSystemUniqueVersion=before.system.templateSystemUniqueVersion;
const oldFields=collect(before.system,n=>n.type==="label"&&n.rollMessage?.includes("H0D_Test_Mode"));
const newFields=collect(restored.system,n=>n.type==="label"&&n.rollMessage?.startsWith("${#H0D_")&&
 ((n.key===""&&n.value==="${H0D_Focus_Bonus}$")||byKey.has(n.key)));
assert.equal(newFields.length,23);
let iconsAdded=0;
for(let i=0;i<23;i++){
 const prior=oldFields[i],updated=newFields[i];
 assert.equal(prior.key,updated.key,"Ordre des actions perturbe");
 assert.equal(prior.value,updated.value,"Total de competence change");
 if(prior.key===""){
   assert.equal(updated.value,"${H0D_Focus_Bonus}$");
   assert.ok(updated.rollMessage.startsWith("${#H0D_Jet:=[1d20]}$"));
   assert.ok(updated.rollMessage.includes("${H0D_Jet + H0D_Focus_Bonus}$"));
 }else{
   assert.equal(updated.rollMessage,byKey.get(prior.key),"Jet direct historique non restaure: "+prior.key);
 }
 if(!prior.icon){iconsAdded++;assert.equal(updated.icon,"dice-d20","Icone de de manquante: "+prior.key);}
 assert.equal(updated.tooltip,"Cliquer pour lancer un jet direct de d20");
 updated.rollMessage=prior.rollMessage;
 updated.icon=prior.icon;
 updated.tooltip=prior.tooltip;
}
assert.equal(iconsAdded,8,"Huit boutons Artisanat sans icone attendaient correction");
assert.deepEqual(restored,before,"Autres cles, formules, inventaires, onglets ou actions modifies");
assert.ok(direct.length>=23,"Les 23 boutons d20 directs ne sont pas detectes");
console.log("OK PJ 3.80: 22 rollMessages historiques exacts + Focus, 8 icones, aucune autre modification.");
