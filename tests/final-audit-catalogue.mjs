import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const main=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const hbs=await readFile(new URL("../templates/manager.hbs",import.meta.url),"utf8");
const helper=await readFile(new URL("../scripts/h0d-catalogue-audit.js",import.meta.url),"utf8");
const manifest=JSON.parse(await readFile(new URL("../module.json",import.meta.url),"utf8"));

assert.equal(manifest.version,"1.7.33");
assert.match(main,/const FINAL_AUDIT_PENDING_SETTING = "finalAuditPendingReason"/);
assert.match(main,/game.settings.register\(MODULE_ID,FINAL_AUDIT_PENDING_SETTING/);
assert.match(hbs,/data-action="migrateSafeVersions"[\s\S]*?data-action="finalAudit"/);
assert.match(hbs,/data-action="finalAudit"[^>]+disabled/);
assert.match(main,/finalAudit:H0DTemplateManagerApp\._finalAudit/);
assert.match(main,/if\(!finalAuditPendingReason\(\)\)/);
assert.match(main,/await game.settings.set\(MODULE_ID,FINAL_AUDIT_PENDING_SETTING,""\)/);
assert.match(main,/await promptAuditExport\(report,\{final:true\}\)/);
assert.match(main,/markFinalAuditPending\("synchronisation du monde"\)/);
assert.match(main,/markFinalAuditPending\("réparation des équipements"\)/);
assert.match(main,/markFinalAuditPending\("migration des données sûres"\)/);
assert.match(main,/markFinalAuditPending\("actualisation des équipements depuis Catalogue"\)/);
assert.match(main,/await auditAfterTemplateUpdate\("installation \/ mise à jour des templates"\)/);
assert.match(main,/const catalogueReference=await auditCatalogueEquipment\(\)/);
assert.match(main,/catalogueReference,weaponReference,armorReference/);
assert.match(main,/return scanCatalogueEquipment\(api,catalogueWorldItems\(\)\)/);
assert.match(hbs,/data-action="repairCatalogue"/);
assert.match(hbs,/Catalogue est absent, inactif ou non prêt/);

const apiSource=helper.replace("export const ","const ").replace("export function ","function ").replace("export function ","function ");
const {planCatalogueEquipment,scanCatalogueEquipment}=new Function(
  apiSource+"\nreturn {planCatalogueEquipment,scanCatalogueEquipment};"
)();
const make=(key="arc-court",props={},template="O6qwtv7ozECILPHV")=>({
  name:"Arc",uuid:"Item.arc",system:{template,props},
  getFlag:(namespace,k)=>namespace!=="h0d-equipment-builder"?null:({
    generated:true,catalogKey:key,sourceTemplateId:template
  })[k]
});
const ref={key:"arc-court",name:"Arc",kind:"weapon",templateKey:"item-arme",
  props:{H0D_Arme_Degats:"1d6",H0D_Arme_Portee:"12",H0D_Arme_Bonus_Attaque:"99",
    H0D_Arme_Traits_Table:{"0":{H0D_Arme_Trait_Type:"leger"}}},
  catalogue:{pret_pour_builder:true}};
{
  const item=make("arc-court",{H0D_Arme_Degats:"1d4",H0D_Arme_Portee:12,
    H0D_Arme_Bonus_Attaque:1,H0D_Arme_Munitions:7});
  const plan=planCatalogueEquipment(item,ref);
  assert.equal(plan.status,"repairable");
  assert.deepEqual(plan.diffs.map(x=>x.key),["H0D_Arme_Degats"]);
  assert.equal(plan.diffs.some(x=>x.key==="H0D_Arme_Bonus_Attaque"),false,
    "Bonus personnels exclus de l'actualisation.");
  assert.equal(plan.diffs.some(x=>x.key==="H0D_Arme_Munitions"),false,
    "Munitions restantes exclues.");
  const read=scanCatalogueEquipment({version:"0.1.9",getDefinition:k=>k==="arc-court"?ref:null},[item]);
  assert.equal(read.summary.repairable,1);
  assert.equal(read.records[0].catalogKey,"arc-court");
  assert.equal(item.system.props.H0D_Arme_Degats,"1d4","Audit en lecture seule.");
}
{
  const mismatched=make("arc-court",{},"H0DObjTpl0000001");
  assert.equal(planCatalogueEquipment(mismatched,ref).status,"template-mismatch");
  const incomplete={...ref,catalogue:{pret_pour_builder:false}};
  assert.equal(planCatalogueEquipment(make(),incomplete).status,"unvalidated-reference");
  assert.equal(planCatalogueEquipment(make("arc-court"),{...ref,key:"autre"}).status,"missing-reference");
}
{
  const unknown=make("absent",{});
  const other=make("baume",{H0D_Objet_Quantite:3},"H0DObjTpl0000001");
  const lookup=k=>k==="baume"?{key:"baume",kind:"object",templateKey:"item-objet",props:{H0D_Objet_Quantite:1}}:null;
  const result=scanCatalogueEquipment({getDefinition:lookup},[unknown,other]);
  assert.equal(result.summary.unmapped,1);
  assert.equal(result.summary.excluded,1);
  assert.equal(result.summary.repairable,0);
  assert.equal(scanCatalogueEquipment(null,[unknown]).available,false);
}
console.log("Audit final et intégration Catalogue : scénarios de régression OK.");
