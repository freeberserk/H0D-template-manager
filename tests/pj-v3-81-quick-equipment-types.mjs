// PJ v3.81 — protections des formules de lecture d'Items dans les raccourcis.
// Le test statique/JS ne remplace pas l'evaluation par CSB 6.1.2 dans Foundry BAC.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const load=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const before=load("data/templates/H0D_Actor-template-PJ-v3.80.json");
const after=load("data/templates/H0D_Actor-template-PJ-v3.81.json");
const index=load("data/templates/index.json");
const manifest=load("module.json");
const walk=(o,fn)=>{
 if(!o||typeof o!=="object")return;
 if(o.key)fn(o);
 for(const v of Object.values(o))walk(v,fn);
};
const field=(root,key)=>{
 const list=[];walk(root.system,o=>{if(o.key===key)list.push(o)});
 assert.equal(list.length,1,"Cle absente ou dupliquee : "+key);
 return list[0];
};
const expected=new Map([
 ["H0D_Quick_Arme_Portee","value"],
 ["H0D_Quick_Arme_Cooldown","value"],
 ["H0D_Armure_Bonus_Actif","value"],
 ["H0D_EQ_Armure_Lourd_Insuffisant_Hid","formula"]
]);
assert.equal(manifest.version,"1.7.41");
assert.equal(after._id,before._id);
assert.equal(after.name,"H0D_Actor-template-PJ v3.81");
assert.equal(after.system.templateSystemUniqueVersion,before.system.templateSystemUniqueVersion+1);
assert.equal(index.find(x=>x.id===after._id)?.file,"H0D_Actor-template-PJ-v3.81.json");
const rollback=structuredClone(after);
rollback.name=before.name;
rollback.system.templateSystemUniqueVersion=before.system.templateSystemUniqueVersion;
const labels=new Map();
for(const [key,property] of expected){
 const a=field(after,key),b=field(before,key),old=field(rollback,key);
 const f=a[property];
 assert.notEqual(f,b[property], "Expression non corrigee : "+key);
 assert.ok(f.startsWith("$"+"{")&&f.endsWith("}$"),"Delimiteurs CSB : "+key);
 assert.match(f,/fallback\(item\./,"Propriete absente non protegee : "+key);
 assert.match(f,/number\(fallback\(item\./,"Valeur non convertie en nombre : "+key);
 labels.set(key,f);
 old[property]=b[property];
}
assert.deepEqual(rollback,before,"Modifications hors 4 formules et version PJ");
// Emulation ciblée des fonctions utilisées ; verifier la semantique des quatre expressions.
// La validation syntaxique exacte de math.js/CSB reste requise dans Foundry.
const fallback=(value,def)=>value===undefined?def:value;
const number=value=>{const n=Number(value);if(!Number.isFinite(n))throw Error("Non numerique");return n;};
const string=value=>String(value);
const concat=(...args)=>args.join("");
const run=(key,item={},strength=10)=>{
 const f=labels.get(key).slice(2,-2);
 return new Function("item","H0D_FOR","fallback","number","string","concat","return ("+f+");")(
   item,strength,fallback,number,string,concat);
};
assert.equal(run("H0D_Quick_Arme_Portee"),"—");
assert.equal(run("H0D_Quick_Arme_Portee",{H0D_Arme_Portee:"9",H0D_Arme_Trait_Portee_Total:"3"}),"12 m");
assert.equal(run("H0D_Quick_Arme_Portee",{H0D_Arme_Portee:9}),"9 m");
assert.equal(run("H0D_Quick_Arme_Cooldown"),"—");
assert.equal(run("H0D_Quick_Arme_Cooldown",{H0D_Arme_Trait_Cooldown_Total:"2"}),"Gérer");
assert.equal(run("H0D_Armure_Bonus_Actif",{H0D_Armure_Active:false}),0);
assert.equal(run("H0D_Armure_Bonus_Actif",{H0D_Armure_Active:true}),0);
assert.equal(run("H0D_Armure_Bonus_Actif",{H0D_Armure_Active:true,H0D_Armure_Bonus_Defense:"3",H0D_Armure_Amelioration_Defense_Total:"1"}),4);
assert.equal(run("H0D_EQ_Armure_Lourd_Insuffisant_Hid",{H0D_Armure_Active:true}),0);
assert.equal(run("H0D_EQ_Armure_Lourd_Insuffisant_Hid",{H0D_Armure_Active:true,H0D_Armure_Trait_Lourd_FOR_Min_Calc:"12"},10),1);
assert.equal(run("H0D_EQ_Armure_Lourd_Insuffisant_Hid",{H0D_Armure_Active:true,H0D_Armure_Trait_Lourd_FOR_Min_Calc:"12"},14),0);
console.log("PJ v3.81 : quatre formules protegees, donnees et jets conserves.");
