// Regression BAC : 23 fenetres de competences, sans executer Foundry / CSB.
// Le test mecanique ne remplace pas la validation dans un monde BAC.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load=async name=>JSON.parse(await readFile(new URL("../"+name,import.meta.url),"utf8"));
const previous=await load("data/templates/H0D_Actor-template-PJ-v3.78.json");
const current=await load("data/templates/H0D_Actor-template-PJ-v3.79.json");
const manifest=await load("module.json");
const manager=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const css=await readFile(new URL("../styles/h0d-template-manager.css",import.meta.url),"utf8");

const collect=(root,fn)=>{
  const found=[];
  const visit=node=>{
    if(!node||typeof node!=="object")return;
    if(Array.isArray(node)){node.forEach(visit);return;}
    if(fn(node))found.push(node);
    for(const value of Object.values(node))if(value&&typeof value==="object")visit(value);
  };
  visit(root);
  return found;
};
assert.equal(previous._id,current._id,"Ne pas changer l'ID CSB stable");
assert.equal(current.name,"H0D_Actor-template-PJ v3.79");
assert.equal(current.system.templateSystemUniqueVersion,previous.system.templateSystemUniqueVersion+1);
assert.equal(manifest.version,"1.7.38");
assert.match(manager,/name:"H0D_Actor-template-PJ v3\.79", version:"3\.79", file:"H0D_Actor-template-PJ-v3\.79\.json"/);

const before=collect(previous.system,n=>n.type==="label"&&n.rollMessage?.includes("H0D_Test_Mode"));
const after=collect(current.system,n=>n.type==="label"&&n.rollMessage?.includes("H0D_Test_Mode"));
assert.equal(before.length,23,"23 jets modifies attendus");
assert.equal(after.length,23,"23 jets conserves attendus");
const byKey=new Map(after.map(node=>[node.key,node]));
assert.equal(byKey.size,23,"Cle de jet dupliquee");
const invalidPrefix=/^\$\{#concat\((\?\{H0D_Test_Mode:.*?\}),(\?\{H0D_Test_Mod:.*?\})\)\}(\$*)(?=\$\{#H0D_Test_Formule)/s;
for(const old of before){
  const found=old.rollMessage.match(invalidPrefix);
  assert.ok(found,"Ancienne erreur de syntaxe non retrouvee pour "+old.key);
  const corrected="$"+"{#"+found[1]+"}$"+"$"+"{#"+found[2]+"}$";
  const expected=corrected+old.rollMessage.slice(found[0].length);
  const next=byKey.get(old.key);
  assert.ok(next,"Jet absent : "+old.key);
  assert.equal(next.rollMessage,expected,"Tout le calcul suivant les prompts doit rester intact : "+old.key);
  assert.ok(next.rollMessage.startsWith("$"+"{#?{H0D_Test_Mode:"),"Invite mode autonome absente : "+old.key);
  assert.ok(next.rollMessage.includes("}$"+"$"+"{#?{H0D_Test_Mod:"),"Invite bonus/malus autonome absente : "+old.key);
  assert.ok(next.rollMessage.includes("Faire 10")&&next.rollMessage.includes("Faire 20"));
  assert.equal(next.rollMessage.includes("concat(?{"),false,"Prompts imbriques encore presents : "+old.key);
}
const stableRolls=template=>collect(template.system,n=>n.type==="label"&&n.rollMessage&&!n.rollMessage.includes("H0D_Test_Mode"))
  .map(n=>[n.key||"",n.rollMessage]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
assert.deepEqual(stableRolls(current),stableRolls(previous),"Jets hors competences modifies");
const keys=template=>collect(template.system,n=>Boolean(n.type&&n.key)).map(n=>n.key).sort();
assert.deepEqual(keys(current),keys(previous),"Champs de campagne modifies");

const oldHeader=previous.system.header.contents;
const newHeader=current.system.header.contents;
assert.equal(oldHeader.length,3);
assert.equal(newHeader.length,2);
assert.deepEqual(newHeader,oldHeader.slice(0,2),"Jet d20 libre et titre doivent rester intacts");
const oldStatus=oldHeader[2].contents;
assert.equal(oldStatus.length,5);
assert.equal(current.system.body.contents.length,2);
const banner=current.system.body.contents[0];
assert.equal(banner.type,"label");
assert.equal(banner.cssClass,"h0d-pj-status-banner");
assert.equal(banner.rollMessage,"");
assert.equal((banner.value.match(/class="h0d-pj-status-cell"/g)||[]).length,5,"Les 5 statistiques doivent etre sur la meme ligne");
for(const stat of oldStatus)assert.ok(banner.value.includes(stat.value),"Stat perdue : "+stat.tooltip);
// Les onglets sont inchangés hors 23 rollMessages vérifiés textuellement plus haut.
const normalizeSkillPrompts=object=>{
  const n=structuredClone(object);
  const visit=value=>{
    if(!value||typeof value!=="object")return;
    if(Array.isArray(value)){value.forEach(visit);return;}
    if(value.type==="label"&&value.rollMessage?.includes("H0D_Test_Mode"))value.rollMessage="[PROMPT_COMPETENCE_VERIFIE]";
    for(const child of Object.values(value))if(child&&typeof child==="object")visit(child);
  };
  visit(n);return n;
};
assert.deepEqual(normalizeSkillPrompts(current.system.body.contents[1]),normalizeSkillPrompts(previous.system.body.contents[0]),"Structure des onglets modifiée au-delà des 23 prompts");
assert.match(css,/h0d-pj-status-banner \.h0d-pj-status-inline/,"CSS horizontal manquant");
assert.match(css,/flex-direction: row !important/,"Le bandeau doit etre horizontal");

console.log("OK — PJ v3.79 : 23 invocations de prompts CSB, jets inchanges, 5 stats en bandeau horizontal, sans regression de cles.");
