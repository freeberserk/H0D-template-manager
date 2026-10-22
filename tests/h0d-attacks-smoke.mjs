import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

// Charger le moteur comme ESM, indépendamment du package.json Foundry.
const helperSource=(await readFile(new URL("../scripts/h0d-common-stats.js",import.meta.url),"utf8")).replaceAll("export ","");
const attackSource=(await readFile(new URL("../scripts/h0d-attacks.js",import.meta.url),"utf8"))
  .replace('import { commonStat } from "./h0d-common-stats.js";',"");
const {openH0DAttacks}=await import("data:text/javascript,"+encodeURIComponent(helperSource+"\n"+attackSource));

const cases=[
 {name:"Machine",bonus:5,actor:{H0D_Machine_Attaque_Base:5,H0D_Machine_Attaque_Effective_Calc:5,H0D_Machine_PV_Actuels:21},weapon:{H0D_ArmeMachine_Mode:"Naturelle",H0D_ArmeMachine_PV_Actuels:5,H0D_ArmeMachine_Etat:"Intacte",H0D_ArmeMachine_Degats:"1d8",H0D_ArmeMachine_Type_Degats:"Contondant"}},
 {name:"Créature",bonus:7,actor:{H0D_Creature_Attaque_Base:3,H0D_Creature_PV_Actuels:10,H0D_Creature_FOR_MOD:2},weapon:{H0D_Arme_Categorie:"melee",H0D_Arme_Degats:"1d8",H0D_Arme_Active:true,H0D_Arme_Equipee:true,H0D_Arme_Amelioration_1_Installee:true,H0D_Arme_Amelioration_1_Type:"Attaque",H0D_Arme_Amelioration_1_Valeur:2}},
 {name:"PJ",bonus:10,actor:{H0D_BBA:4,H0D_FOR:16,H0D_FOR_MOD:3,H0D_Defense_Totale_Calc:16,H0D_DT_Bonus_Attaque_Global_Total:2},weapon:{H0D_Arme_Categorie:"melee",H0D_Arme_Degats:"1d8",H0D_Arme_Bonus_Attaque:1,H0D_Arme_Carac_Degats:"FOR",H0D_Arme_Active:true,H0D_Arme_Equipee:true}}
];
for(const test of cases){
 const posts=[],warnings=[];
 const item={id:"test-weapon",name:"Attaque test",system:{props:test.weapon},getFlag:()=>null,update:async()=>{},setFlag:async()=>{}};
 const actor={name:"Test "+test.name,system:{props:test.actor},items:[item]};
 globalThis.canvas={tokens:{controlled:[{actor,name:"Test "+test.name,document:{id:"t"}}]}};
 let count=0;
 globalThis.foundry={applications:{api:{DialogV2:{input:async(args)=>{
   if(count++>0) return null;
   const content=args.content.replace(/<[^>]*>/g," ").replace(/\s+/g," ");
   assert.ok(content.includes("ATQ +"+test.bonus),"Bonus attaque incorrect : "+test.name);
   return {weapon:"test-weapon",situational:0};
 }}}}};
 const targetActor={name:"Cible",system:{attributeBar:{H0D_Defense:{value:10,max:10}},props:{}}};
 const target={name:"Cible",actor:targetActor};
 globalThis.game={user:{id:"gm-test",targets:new Set([target])},combat:null};
 globalThis.ui={notifications:{warn:x=>warnings.push(x),error:x=>warnings.push(x)}};
 globalThis.Roll=class{constructor(formula){this.formula=formula;this.total=formula==="1d20"?12:5;}async evaluate(){return this;}};
 globalThis.ChatMessage={getSpeaker:()=>({alias:"Test"}),getWhisperRecipients:()=>[{id:"gm-test"}],create:async x=>posts.push(x)};
 await openH0DAttacks();
 assert.deepEqual(warnings,[],test.name+": avertissement inattendu");
 assert.equal(posts.length,1,test.name+": un seul message attendu");
 if(test.name==="PJ") assert.equal(posts[0].whisper,undefined,"PJ : message public attendu");
 else assert.deepEqual(posts[0].whisper,["gm-test"],test.name+": attaque ennemie doit être privée MJ");
 const rendered=posts[0].content.replace(/<[^>]*>/g," ").replace(/\s+/g," ");
 assert.ok(rendered.includes("= "+(12+test.bonus)),test.name+": total d'attaque incorrect");
 assert.ok(rendered.includes("TOUCHÉ"),test.name+": la DEF commune doit être comparée");
 assert.ok(rendered.includes("Dégâts"),test.name+": dégâts absents");
 console.log("Smoke OK:",test.name);
}
