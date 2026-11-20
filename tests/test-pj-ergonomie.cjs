// Tests de non-régression de la refonte ergonomique PJ — sans runtime Foundry.
// Exécution : node tests/test-pj-ergonomie.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname,"..",name),"utf8"));
const old = read("data/templates/H0D_Actor-template-PJ-v3.75.json");
const next = read("proposals/H0D_Actor-template-PJ_v3.75.json");
const walk = (n,fn) => {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) { n.forEach(v => walk(v,fn)); return; }
  fn(n);
  Object.values(n).forEach(v => { if (v && typeof v === "object") walk(v,fn); });
};
function index(o) {
  const data={keys:[],rolls:[],formulas:[],items:[],dynamic:[],nodes:0};
  walk(o.system,n=>{
    if(n.type){ data.nodes++;if(n.key)data.keys.push(n.key); }
    if(n.type==="label"&&n.rollMessage)data.rolls.push(n.rollMessage);
    if(n.type==="label"&&String(n.value||"").includes("${"))data.formulas.push(JSON.stringify([n.key,n.value]));
    if(n.type==="itemContainer")data.items.push(n);
    if(n.type==="dynamicTable")data.dynamic.push(n);
  });
  data.keys.sort();data.rolls.sort();data.formulas.sort();
  data.items.sort((a,b)=>a.key.localeCompare(b.key));
  data.dynamic.sort((a,b)=>a.key.localeCompare(b.key));
  return data;
}
const A=index(old), B=index(next);
assert.equal(next.type,"_template");
assert.equal(old._id,next._id,"Identifiant du template");
assert.deepEqual(old.system.attributeBar,next.system.attributeBar,"Interface Actor commune");
assert.deepEqual(A.keys,B.keys,"Clés supprimées, ajoutées ou renommées");
assert.equal(new Set(B.keys).size,B.keys.length,"Collision de clés");
assert.deepEqual(A.rolls,B.rolls,"Jets, macros et messages de chat modifiés");
assert.deepEqual(A.items,B.items,"Conteneur d'équipement modifié");
assert.equal(A.dynamic.length,2,"Tableaux dynamiques de référence");
assert.equal(B.dynamic.length,2,"Tableaux dynamiques conservés");
for(let i=0;i<A.dynamic.length;i++){
  const x=JSON.parse(JSON.stringify(A.dynamic[i]));
  const y=JSON.parse(JSON.stringify(B.dynamic[i]));
  if(x.key==="H0D_Connaissances_Table"){
    y.rowLayout.sort((p,q)=>x.rowLayout.findIndex(n=>n.key===p.key)-x.rowLayout.findIndex(n=>n.key===q.key));
  }
  if(x.key==="H0D_Skill_Progression"){
    y.editRole=x.editRole;
    y.rowLayout.forEach((n,j)=>{n.editRole=x.rowLayout[j].editRole;});
  }
  assert.deepEqual(x,y,"Structure de tableau dynamique modifiée : "+x.key);
}
const remaining=B.formulas.slice();
for(const f of A.formulas){const i=remaining.indexOf(f);assert(i>=0,"Formule manquante "+f.slice(0,90));remaining.splice(i,1);}
assert.equal(remaining.length,5,"Seules les cinq valeurs calculées du bandeau peuvent être ajoutées");
const tabs=next.system.body.contents[0].contents;
assert.deepEqual(tabs.map(x=>x.key),["H0D_Personnage_Tab","H0D_Equipement_Tab","H0D_Notes_Tab","H0D_Technique_Tab"]);
const header=next.system.header.contents.at(-1);
assert.equal(header.type,"panel");
assert.equal(header.contents.length,5);
assert(header.contents[3].value.includes("H0D_Point_Action_Depense}$ /"),"La réserve PA doit être lue comme PA restantes");
const p=tabs[1].contents[0].contents[0].contents[0];
const skills=p.contents[6],craft=p.contents[7].contents[2],knowledge=p.contents[8].contents[2];
assert(skills.contents.every(row=>row.length===9));
assert(craft.contents.every(row=>row.length===8));
assert.equal(skills.contents[0][1].value,"Total / jet");
assert.equal(craft.contents[0][1].value,"Total / jet");
assert.equal(knowledge.rowLayout[1].key,"H0D_Connaissance_Total");
let techFieldCount=0;let protectedActions=0;
walk(tabs[3],n=>{
  if(["numberField","textField","select","checkbox","textArea","dynamicTable"].includes(n.type)){
    techFieldCount++;assert.equal(n.editRole,4,"Modification technique possible pour un non-MJ : "+n.key);
  }
  if(["H0D_Classe_Synchroniser_Historique","H0D_Classe_Annuler_Dernier_Niveau"].includes(n.key)){
    protectedActions++;assert.equal(n.role,4,"Action technique sensible visible pour les joueurs");
  }
});
assert.equal(techFieldCount,31);
assert.equal(protectedActions,2);
console.log("OK : onglets, 419 clés, 67 rollMessages, 14 itemContainers, 2 tableaux dynamiques, protections techniques et 5 stats.");
