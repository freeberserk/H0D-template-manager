// Read-only view model for the progressive maintenance dashboard.
// No Foundry API, document mutation or side effects: safe to test in Node.
const num=value=>Number.isFinite(Number(value))?Math.max(0,Number(value)):0;
const metric=(report,name)=>{
  if(!report)return null;
  const warningDocs=(report.documents||[]).filter(d=>d.status==="warning"||d.status==="error").length;
  switch(name){
    case "templates":return num(report.counts?.templates?.update)+num(report.counts?.templates?.absent);
    case "documents":return warningDocs+num(report.warningTriage?.shared?.warnings)+num(report.warningTriage?.shared?.errors);
    case "catalogue":return num(report.catalogueReference?.summary?.repairable)+num(report.catalogueReference?.summary?.unmapped)+num(report.catalogueReference?.summary?.excluded);
    case "equipment":return num(report.weaponReference?.summary?.repairableWeapons)+num(report.armorReference?.summary?.mismatch);
    case "legacy":return num(report.legacyTrait?.installed&&report.legacyTrait?.usages?report.legacyTrait.usages:0);
    default:return 0;
  }
};
export const MAINTENANCE_CATEGORIES=["templates","documents","catalogue","equipment","legacy"];
export function buildMaintenanceFlow(report){
 const definitions={
  templates:{title:"Templates canoniques",desc:"Installation et mises à jour des modèles CSB",priority:0},
  documents:{title:"Fiches et compendiums",desc:"Versions, synchronisations et avertissements à diagnostiquer",priority:1},
  catalogue:{title:"Compatibilité H0D Catalogue",desc:"Références, écarts mécaniques et objets à examiner",priority:2},
  equipment:{title:"Référentiel historique des équipements",desc:"Réparation contrôlée des armes, armures et boucliers",priority:3},
  legacy:{title:"Héritage et compatibilité",desc:"Anciennes propriétés et modèles encore utilisés",priority:4}
 };
 const groups={};
 if(!report){
  for(const [id,def]of Object.entries(definitions))groups[id]={...def,id,count:0,state:"unknown",order:def.priority,open:false,label:"En attente du premier audit"};
  return {available:false,groups,openCount:0,resolvedCount:0,attentionCount:0};
 }
 const catalogueAvailable=report.catalogueReference?.available===true;
 const legacyInfo=num(report.warningTriage?.legacyInfoDocuments);
 for(const [id,def] of Object.entries(definitions)){
  const n=metric(report,id);
  const missing=id==="catalogue"&&!catalogueAvailable;
  const legacyReview=id==="legacy"&&legacyInfo>0&&n===0;
  const state=missing?"unavailable":n>0?"pending":legacyReview?"attention":"resolved";
  groups[id]={...def,id,count:n,state,open:state==="pending",order:(state==="pending"?0:state==="attention"||state==="unavailable"?100:200)+def.priority,
   label:missing?"Catalogue indisponible":state==="pending"?(n+" signalement(s)"):(legacyReview?legacyInfo+" propriété(s) historiques":"Conforme")};
 }
 return {available:true,groups,openCount:Object.values(groups).filter(x=>x.state==="pending").length,
  resolvedCount:Object.values(groups).filter(x=>x.state==="resolved").length,
  attentionCount:Object.values(groups).filter(x=>x.state==="attention"||x.state==="unavailable").length};
}
function executionDetails(action,executed){
 if(executed===undefined||executed===null)return {message:"Aucune opération d'écriture confirmée.",errors:0,cancelled:true};
 if(action==="installAll"&&Array.isArray(executed)){
  const ok=executed.filter(x=>x.state!=="error").length,errors=executed.length-ok;
  return {message:`${ok} template(s) installé(s)/actualisé(s), ${errors} échec(s).`,errors};
 }
 if(action==="updateTemplate"){
  return {message:executed.name?`${executed.name} : ${executed.state==="created"?"installé":"actualisé"}.`:"Mise à jour déclenchée.",errors:0};
 }
 if(action==="synchronize"&&Array.isArray(executed)){
  const ok=executed.filter(x=>x.ok).length,errors=executed.length-ok;
  return {message:`${ok} fiche(s) synchronisée(s), ${errors} échec(s).`,errors};
 }
 if(action==="repairEquipment"){
  const errors=num(executed.errors);
  return {message:`${num(executed.weaponsDone)} arme(s) et ${num(executed.armorsDone)} armure(s)/bouclier(s) réparé(s), ${errors} échec(s).`,errors};
 }
 if(action==="repairCatalogue"){
  const errors=num(executed.errors);
  return {message:`${num(executed.done)} équipement(s) actualisé(s), ${num(executed.skipped)} ignoré(s), ${errors} échec(s).`,errors};
 }
 if(action==="migrateSafeVersions"){
  const errors=num(executed.errors);
  return {message:`${num(executed.ok)} migration(s) réussie(s), ${errors} erreur(s), ${num(executed.remaining)} candidat(s) sûr(s) restant(s).`,errors};
 }
 if(action==="restore")return {message:`${num(executed.restored)} document(s) restauré(s).`,errors:0};
 if(action==="snapshot")return {message:"Snapshot JSON préparé pour téléchargement par Foundry.",errors:0};
 if(action==="audit"||action==="finalAudit"||action==="auditTemplate")return {message:"Audit de lecture terminé.",errors:0};
 if(action==="retireTrait")return {message:executed.removed?"Ancien modèle retiré.":"Aucun modèle retiré.",errors:0};
 return {message:"Opération terminée.",errors:0};
}
export function maintenanceResult({action,label,before,after,thrown=null,executed=undefined}){
 const target={installAll:"templates",updateTemplate:"templates",synchronize:"documents",
   migrateSafeVersions:"documents",auditTemplate:"documents",repairEquipment:"equipment",
   repairCatalogue:"catalogue",retireTrait:"legacy"}[action]||null;
 const execution=executionDetails(action,executed);
 const end=after?buildMaintenanceFlow(after):null;
 const now=new Date().toISOString();
 if(thrown)return {action,label,state:"error",headline:"Opération interrompue",detail:String(thrown?.message||thrown),createdAt:now,verified:false};
 if(execution.cancelled)return {action,label,state:"info",headline:"Action annulée ou non exécutée",detail:execution.message,createdAt:now,verified:false};
 if(!after)return {action,label,state:"attention",headline:"Étape terminée — audit non disponible",detail:execution.message+" Relancer Audit monde pour vérifier les résultats.",createdAt:now,verified:false};
 if(!before){
  return {action,label,state:"info",headline:"Premier état des lieux établi",
   detail:execution.message+` ${end.openCount} catégorie(s) avec signalements · ${num(after.counts?.documents?.errors)} erreur(s) documentaire(s).`,
   createdAt:now,verified:true,remaining:null,corrected:null};
 }
 const fresh=before!==after&&before.createdAt!==after.createdAt;
 if(!fresh){
  return {action,label,state:"info",headline:"Aucun changement vérifié par un nouvel audit",
   detail:execution.message+" Aucun nouvel état du monde n’a été confirmé ; les chiffres restent ceux du dernier audit.",
   createdAt:now,verified:false,remaining:null,corrected:null};
 }
 if(!target){
  return {action,label,state:"info",headline:"Contrôle actualisé",
    detail:execution.message+` ${end.openCount} catégorie(s) avec signalements · ${num(after.counts?.documents?.errors)} erreur(s) documentaire(s).`,
    createdAt:now,verified:true,remaining:null,corrected:null};
 }
 const startCount=metric(before,target),endCount=metric(after,target),corrected=Math.max(0,startCount-endCount);
 const isDone=endCount===0;
 return {action,label,state:execution.errors>0?"attention":isDone?"success":"attention",
   headline:isDone?"Étape conforme après vérification":"Étape terminée — points à examiner",
   detail:execution.message+` ${corrected} signalement(s) en moins · ${endCount} restant(s) dans « ${end.groups[target].title} ». ${num(after.counts?.documents?.errors)} erreur(s) documentaire(s) dans le monde.`,
   createdAt:now,verified:true,remaining:endCount,corrected};
}
