import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaintenanceFlow,maintenanceResult} from "../scripts/h0d-maintenance-dashboard.js";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("templates/manager.hbs");
const main=read("scripts/h0d-template-manager.js");
const css=read("styles/h0d-template-manager.css");
const manifest=JSON.parse(read("module.json"));
const initial=buildMaintenanceFlow(null);
assert.equal(initial.available,false);
assert.equal(initial.openCount,0);
const sample=(stamp,up,warnings=2,shared=3)=>({
 createdAt:stamp,counts:{templates:{ok:12-up,update:up,absent:0},documents:{ok:200-warnings,warnings,errors:0}},
 templates:[],documents:Array.from({length:warnings},(_,i)=>({status:"warning",uuid:"Actor."+i})),
 warningTriage:{shared:{warnings:shared,errors:0},legacyInfoDocuments:2},
 catalogueReference:{available:true,summary:{tracked:6,ok:3,repairable:1,unmapped:1,excluded:1}},
 weaponReference:{summary:{repairableWeapons:1}},
 armorReference:{summary:{mismatch:1}},
 legacyTrait:{installed:false,usages:0}
});
const before=sample("2026-11-22T00:00:00Z",2),after=sample("2026-11-22T00:01:00Z",0);
const flowBefore=buildMaintenanceFlow(before),flowAfter=buildMaintenanceFlow(after);
assert.equal(flowBefore.groups.templates.state,"pending");
assert.equal(flowBefore.groups.templates.count,2);
assert.equal(flowBefore.groups.documents.count,5);
assert.equal(flowBefore.groups.catalogue.count,3);
assert.equal(flowBefore.groups.equipment.count,2);
assert.equal(flowBefore.groups.legacy.state,"attention");
assert.equal(flowAfter.groups.templates.state,"resolved");
assert.equal(flowAfter.groups.templates.open,false);
assert.ok(flowAfter.groups.templates.order>flowAfter.groups.documents.order);
assert.ok(flowAfter.groups.documents.open);
assert.equal(flowAfter.openCount,3);
const result=maintenanceResult({action:"installAll",label:"Installation",before,after,
 executed:[{name:"A",state:"updated"},{name:"B",state:"created"}]});
assert.equal(result.state,"success");
assert.equal(result.corrected,2);
assert.equal(result.remaining,0);
assert.match(result.detail,/2 template\(s\) installé\(s\)\/actualisé\(s\)/);
assert.match(result.detail,/2 signalement\(s\) en moins/);
const failed=maintenanceResult({action:"synchronize",label:"Synchronisation",before,after:sample("2026-11-22T00:02:00Z",2,1,3),
 executed:[{ok:true},{ok:false}]});
assert.equal(failed.state,"attention");
assert.match(failed.detail,/1 échec\(s\)/);
const cancelled=maintenanceResult({action:"repairEquipment",label:"Réparation",before,after:before});
assert.match(cancelled.headline,/annulée/);
assert.equal(cancelled.verified,false);
const error=maintenanceResult({action:"audit",label:"Audit",before,after,thrown:new Error("problème")});
assert.equal(error.state,"error");
assert.equal(manifest.version,"1.7.42");
assert.ok(main.includes('const MODULE_VERSION = "1.7.42";'));
assert.ok(main.includes('import {buildMaintenanceFlow,maintenanceResult}'));
assert.ok(main.includes('H0DTemplateManagerApp._managedAction'));
assert.ok(main.includes('if(H0DTemplateManagerState.busy)'));
assert.ok(main.includes('updateMaintenanceStage("Synchronisation des fiches…",i+1,entries.length);'));
assert.ok(main.includes('if(status.code!=="ok")candidates.push(entry);'));
assert.ok(main.includes('await auditAfterTemplateUpdate("installation / mise à jour des templates");'));
assert.ok(main.includes('lastMaintenanceResult:'));
assert.equal((page.match(/<details /g)||[]).length,5);
assert.equal((page.match(/<\/details>/g)||[]).length,5);
for(const id of ["documents","catalogue","templates","legacy","equipment"]){
 assert.ok(page.includes("maintenanceFlow.groups."+id+".order"),"Ordre non piloté : "+id);
 assert.ok(page.includes("maintenanceFlow.groups."+id+".open"),"Repli absent : "+id);
}
assert.ok(page.includes('data-h0d-operation-live'));
assert.ok(page.includes('{{maintenanceResult.detail}}'));
assert.ok(page.includes('role="status" aria-live="polite"'));
for(const action of ["audit","installAll","synchronize","repairEquipment","repairCatalogue","migrateSafeVersions","finalAudit"]){
 assert.ok(page.includes('data-action="'+action+'"'),"Action perdue : "+action);
}
assert.ok(css.includes(".h0d-tm-workflow-group[open]"));
assert.ok(!main.includes("localStorage."));
const missingCatalogue=sample("2026-11-22T00:03:00Z",0,0,0);
missingCatalogue.catalogueReference.available=false;
assert.equal(buildMaintenanceFlow(missingCatalogue).groups.catalogue.state,"unavailable");
const snapshot=maintenanceResult({action:"snapshot",label:"Snapshot",before,after:before,
 executed:{actors:[],items:[]}});
assert.equal(snapshot.state,"info");
assert.match(snapshot.detail,/Snapshot JSON préparé/);
const first=maintenanceResult({action:"audit",label:"Audit monde",before:null,after:before,executed:before});
assert.match(first.headline,/Premier état des lieux/);
assert.ok(!read("scripts/h0d-maintenance-dashboard.js").includes(".update("),
  "Le calcul de présentation ne doit pas modifier les documents.");
console.log("Maintenance progressive v1.7.42 : classification, ordre, bilans et UI OK.");
