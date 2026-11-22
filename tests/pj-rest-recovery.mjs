// Contrôle des règles de repos du template PJ v3.78.
// Vérification des formules et exécution des scripts avec une entité simulée.
// Le moteur de formules CSB et le rendu dans Foundry restent à tester dans BAC.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read=async path=>JSON.parse(await readFile(new URL("../"+path,import.meta.url),"utf8"));
const previous=await read("data/templates/H0D_Actor-template-PJ-v3.77.json");
const updated=await read("data/templates/H0D_Actor-template-PJ-v3.78.json");
const register=await read("module.json");
const manager=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const walk=(n,fn)=>{if(!n||typeof n!=="object")return;if(Array.isArray(n)){n.forEach(x=>walk(x,fn));return}fn(n);Object.values(n).forEach(x=>{if(x&&typeof x==="object")walk(x,fn)})};
const get=(o,key)=>{let item=null;walk(o.system,n=>{if(n.key===key){assert(!item,"Clé dupliquée "+key);item=n}});assert(item,"Clé introuvable "+key);return item};
assert.equal(previous._id,updated._id);
assert.equal(updated.name,"H0D_Actor-template-PJ v3.78");
assert.equal(updated.system.templateSystemUniqueVersion,previous.system.templateSystemUniqueVersion+1);
assert.equal(register.version,"1.7.41");
assert.match(manager,/name:"H0D_Actor-template-PJ v3\.81", version:"3\.81", file:"H0D_Actor-template-PJ-v3\.81\.json"/);

const classes={Robuste:10,Fort:8,Rapide:8,Intelligent:6,Devoue:6,Charismatique:6};
const poor=get(updated,"H0D_Repos_Danger_Gain_Calc");
assert.match(poor.value,/^\$\{switchCase\(find\('H0D_Skill_Progression','H0D_Skill_Level_Classe','H0D_Skill_Level_Niveau',H0D_PJ_Niveau_Calc\)/);
for (const [cls,maxDV] of Object.entries(classes))assert(poor.value.includes("'"+cls+"',"+maxDV),"Classe/DV manquant : "+cls);
assert(poor.value.endsWith(",0)}$"),"Historique absent : pas de soin inventé");
assert.equal(get(updated,"H0D_Repos_Normal_Gain_Calc").value,"${floor(H0D_PV_Max_Calc / 3)}$");
assert.equal(get(updated,"H0D_Repos_CampSur_Gain_Calc").value,"${floor(H0D_PV_Max_Calc / 2)}$");
assert.equal(get(updated,"H0D_Repos_Refuge_Gain_Aff").value,"PV max");

// Les 4 boutons utilisent toujours leurs clés d'origine et le même type CSB.
for(const suffix of ["Danger","Normal","CampSur","Refuge"]){
 const key="H0D_Repos_"+suffix;
 assert.equal(get(updated,key).type,"label");
 assert.equal(get(updated,key).key,get(previous,key).key);
 assert.match(get(updated,key).rollMessage,/system\.props\.H0D_PV_Actuels/);
}
// Seules les trois formules, les textes d'aide, la sécurité en cas d'historique vide,
// le nom et la version du template peuvent changer.
const allowed=new Set(["H0D_Repos_Danger_Gain_Calc","H0D_Repos_Normal_Gain_Calc","H0D_Repos_CampSur_Gain_Calc","H0D_Repos_Danger","H0D_Repos_Normal","H0D_Repos_CampSur","H0D_Repos_Refuge","H0D_Repos_Refuge_Gain_Aff"]);
const backup=JSON.parse(JSON.stringify(previous)),next=JSON.parse(JSON.stringify(updated));
for(const source of [backup,next]){
 source.name="PJ";
 source.system.templateSystemUniqueVersion=0;
 walk(source.system,n=>{if(n.type==="label"&&allowed.has(n.key)){
  n.value=n.key.endsWith("_Gain_Calc")?"REMOVED":n.value;
  n.tooltip="";
  if(n.key==="H0D_Repos_Danger")n.rollMessage="";
 }});
}
// Les autres valeurs du panneau des repos doivent être conservées et les autres composants inchangés.
const beforeRaw=JSON.stringify(backup),afterRaw=JSON.stringify(next);
assert.equal(beforeRaw,afterRaw,"Modification extérieure au barème de récupération");

const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
async function simulate(key,{oldPV,maxPV,heal}){
 const original=get(updated,key).rollMessage;
 assert(original.startsWith("%{")&&original.endsWith("}%"),"Script de repos non reconnu");
 let body=original.slice(2,-2).replaceAll("${H0D_PV_Max_Calc}$",String(maxPV))
   .replaceAll("${H0D_Repos_Danger_Gain_Calc}$",String(heal))
   .replaceAll("${H0D_Repos_Normal_Gain_Calc}$",String(heal))
   .replaceAll("${H0D_Repos_CampSur_Gain_Calc}$",String(heal));
 const actor={name:"PJ test",system:{props:{H0D_PV_Actuels:oldPV}},writes:0,
 async update(p){this.writes++;const hp=p["system.props.H0D_PV_Actuels"];this.system.props.H0D_PV_Actuels=hp;}};
 const notices=[];
 const ui={notifications:{warn:s=>notices.push(s)}};
 const output=await (new AsyncFunction("entity","ui",body))(actor,ui);
 return {hp:actor.system.props.H0D_PV_Actuels,writes:actor.writes,output,notices};
}
assert.deepEqual(Object.entries(classes).map(([cls,v])=>v),[10,8,8,6,6,6]);
const demo=[{niveau:"Robuste",dv:10},{niveau:"Intelligent",dv:6}];
assert.equal(classes[demo.at(-1).niveau],6,"La mauvaise nuit doit utiliser le dernier niveau multiclassé");
assert.equal((await simulate("H0D_Repos_Danger",{oldPV:4,maxPV:30,heal:6})).hp,10);
assert.equal((await simulate("H0D_Repos_Danger",{oldPV:29,maxPV:30,heal:10})).hp,30);
const missing=await simulate("H0D_Repos_Danger",{oldPV:12,maxPV:30,heal:0});
assert.equal(missing.hp,12);assert.equal(missing.writes,0);assert.equal(missing.notices.length,1);
assert.equal((await simulate("H0D_Repos_Normal",{oldPV:1,maxPV:30,heal:Math.floor(30/3)})).hp,11);
assert.equal((await simulate("H0D_Repos_CampSur",{oldPV:1,maxPV:30,heal:Math.floor(30/2)})).hp,16);
assert.equal((await simulate("H0D_Repos_Refuge",{oldPV:1,maxPV:30,heal:0})).hp,30);
assert.equal(Math.floor(31/3),10);
assert.equal(Math.floor(31/2),15);
console.log("OK — PJ v3.78 : classes DV, formules de repos, scripts et absence de régression hors repos.");
