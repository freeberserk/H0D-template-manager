import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  H0D_LEVEL_CLASSES,
  H0D_CAMPAIGN_MAX_LEVEL,
  analyzeHistory,
  buildLevelUpPreview,
  classRankUpdatesFromHistory,
  replaceHistoryExactly
} from "../scripts/h0d-level-up.js";

const history={
  "0":{
    $deleted:false,
    H0D_Skill_Level_Niveau:"1",
    H0D_Skill_Level_Classe:"Fort",
    H0D_Skill_Level_INT_Mod:"1",
    H0D_PV_Level_Jet:"8"
  },
  "1":{
    $deleted:false,
    H0D_Skill_Level_Niveau:"2",
    H0D_Skill_Level_Classe:"Rapide",
    H0D_Skill_Level_INT_Mod:"1",
    H0D_PV_Level_Jet:"5"
  }
};

const props={
  H0D_Skill_Progression:history,
  H0D_Classe_Fort_Rangs:1,
  H0D_Classe_Rapide_Rangs:1,
  H0D_Classe_Robuste_Rangs:0,
  H0D_Classe_Intelligent_Rangs:0,
  H0D_Classe_Devoue_Rangs:0,
  H0D_Classe_Charismatique_Rangs:0,
  H0D_INT:14,
  H0D_CON:12
};

const a=analyzeHistory(history);
assert.equal(a.currentLevel,2);
assert.equal(a.counts.Fort,1);
assert.equal(a.counts.Rapide,1);
assert.deepEqual(a.errors,[]);

const preview=buildLevelUpPreview(props,"Intelligent");
assert.equal(preview.ok,true);
assert.equal(preview.nextLevel,3);
assert.equal(preview.cfg.die,"1d6");
assert.equal(preview.intMod,2);
assert.equal(preview.conMod,1);
assert.equal(preview.skillPoints,11);
assert.equal(preview.actionPoints,6);

const updates=classRankUpdatesFromHistory(history);
assert.equal(updates["system.props.H0D_Classe_Fort_Rangs"],1);
assert.equal(updates["system.props.H0D_Classe_Rapide_Rangs"],1);
assert.equal(updates["system.props.H0D_Classe_Intelligent_Rangs"],0);

const badGap=structuredClone(history);
badGap["1"].H0D_Skill_Level_Niveau="3";
assert.ok(analyzeHistory(badGap).errors.length>0,"Un trou dans l'historique doit bloquer le passage");

const badCounts={...props,H0D_Classe_Fort_Rangs:2};
assert.equal(buildLevelUpPreview(badCounts,"Fort").ok,false,"Un désaccord historique/rangs doit bloquer");

const rank10History={};
for(let i=0;i<10;i++) rank10History[String(i)]={
  $deleted:false,
  H0D_Skill_Level_Niveau:String(i+1),
  H0D_Skill_Level_Classe:"Fort",
  H0D_Skill_Level_INT_Mod:"0",
  H0D_PV_Level_Jet:"8"
};
const rank10Props={
  H0D_Skill_Progression:rank10History,
  H0D_Classe_Fort_Rangs:10,
  H0D_Classe_Rapide_Rangs:0,
  H0D_Classe_Robuste_Rangs:0,
  H0D_Classe_Intelligent_Rangs:0,
  H0D_Classe_Devoue_Rangs:0,
  H0D_Classe_Charismatique_Rangs:0,
  H0D_INT:10,H0D_CON:10
};
assert.equal(buildLevelUpPreview(rank10Props,"Fort").ok,false,"Une classe de base ne dépasse pas le rang 10");

assert.equal(H0D_CAMPAIGN_MAX_LEVEL,15);
assert.equal(H0D_LEVEL_CLASSES.Robuste.dieLabel,"d10");

// Regression 1.7.12 : une dynamicTable restaurée par actor.update() simple
// conservait la ligne du niveau annulé à cause du merge récursif.
const backupHistory=structuredClone(history);
const actorMock={
  system:{props:{H0D_Skill_Progression:{
    ...structuredClone(history),
    "2":{
      $deleted:false,
      H0D_Skill_Level_Niveau:"3",
      H0D_Skill_Level_Classe:"Devoue",
      H0D_Skill_Level_INT_Mod:"2",
      H0D_PV_Level_Jet:"4"
    }
  }}},
  async update(update){
    for(const [key,value] of Object.entries(update)){
      if(key==="system.props.-=H0D_Skill_Progression"){
        delete this.system.props.H0D_Skill_Progression;
      } else if(key==="system.props.H0D_Skill_Progression"){
        this.system.props.H0D_Skill_Progression=structuredClone(value);
      }
    }
  }
};
await replaceHistoryExactly(actorMock,backupHistory,{h0dLevelRestore:true});
assert.deepEqual(
  actorMock.system.props.H0D_Skill_Progression,
  backupHistory,
  "Le rollback doit supprimer réellement la ligne du niveau annulé"
);
assert.equal(
  Object.prototype.hasOwnProperty.call(actorMock.system.props.H0D_Skill_Progression,"2"),
  false,
  "La ligne du niveau 3 ne doit pas survivre au rollback"
);


// Template structure checks.
const pj=JSON.parse(await readFile(new URL("../data/templates/H0D_Actor-template-PJ-v3.71.json",import.meta.url),"utf8"));
const text=JSON.stringify(pj);
assert.ok(text.includes("PASSAGE DE NIVEAU"),"Bloc joueur simplifié absent");
assert.ok(text.includes("globalThis.H0DLevelUp.run"),"Bouton automatique absent");
assert.ok(text.includes("RANGS DE CLASSE — SYNCHRONISÉS DEPUIS L’HISTORIQUE"),"Bloc Technique des rangs absent");
assert.ok(text.includes("globalThis.H0DLevelUp.sync"),"Synchronisation Technique absente");
assert.ok(text.includes("globalThis.H0DLevelUp.restore"),"Restauration du dernier niveau absente");
assert.ok(text.includes("PROGRESSION PAR NIVEAU — ÉDITION MJ"),"Historique Technique absent");

function walk(root,fn,path=[]){
  if(Array.isArray(root)){root.forEach((v,i)=>walk(v,fn,path.concat(i)));return;}
  if(!root||typeof root!=="object")return;
  fn(root,path);
  for(const [k,v] of Object.entries(root)) walk(v,fn,path.concat(k));
}
const classFields=[];
walk(pj,(o,path)=>{
  if(o.type==="numberField" && /^H0D_Classe_.*_Rangs$/.test(o.key||"")) classFields.push({o,path});
});
assert.equal(classFields.length,6,"Les six compteurs de classe doivent exister une seule fois");
for(const {o} of classFields) assert.equal(o.editableFormula,"false","Les compteurs doivent être lecture seule");

console.log("Level-up automation OK");
