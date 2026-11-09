import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const read = async path => readFile(new URL("../"+path, import.meta.url), "utf8");
const [script,hbs,moduleText,readme] = await Promise.all([
  read("scripts/h0d-template-manager.js"),
  read("templates/manager.hbs"),
  read("module.json"),
  read("README.md")
]);
const manifest=JSON.parse(moduleText);

assert.equal(manifest.version,"1.7.31","Le manifest doit être en 1.7.31");
assert.ok(script.includes('const MODULE_VERSION = "1.7.31";'),"MODULE_VERSION doit être en 1.7.31");

assert.ok(script.includes('order:-1000,button:true,visible:true,'),"Le Template Manager doit être le premier outil de Tokens.");

assert.ok(hbs.includes('data-action="audit"'),"Le bouton Audit doit rester présent");
assert.ok(hbs.includes("{{auditState.label}}"),"Le libellé d'audit doit être contextuel");
assert.ok(hbs.includes("audit-dirty"),"L'état Audit final recommandé doit être stylable");
assert.equal(hbs.includes('data-action="exportAudit"'),false,"Exporter audit ne doit plus être dans la barre");
assert.equal(hbs.includes('data-action="closeApp"'),false,"Fermer ne doit plus être dans la barre");
assert.ok(hbs.includes("Snapshot de sécurité"),"Le snapshot doit être présenté comme sauvegarde de sécurité");
assert.ok(hbs.includes("Restaurer données"),"Le rollback doit décrire précisément ce qu'il restaure");

assert.ok(script.includes("async function promptAuditExport(report,{final=false}={})"),"Le dialogue d'export post-audit est absent");
assert.ok(script.includes("if (exportNow === true) await exportAudit(report);"),"L'export post-audit doit réutiliser le rapport calculé");
assert.ok(script.includes("async function exportAudit(report=null)"),"L'API exportAudit doit rester compatible");
assert.ok(script.includes("if (!current) {"),"L'API exportAudit seule doit pouvoir relancer un audit frais");
assert.ok(script.includes("auditDirty:false"),"L'état auditDirty doit être initialisé");
assert.ok(script.includes('label:auditDirty ? "Audit final recommandé"'),"Le libellé final recommandé doit dépendre de l'état sale");
assert.ok(script.includes("async function refreshAuditSilently"),"Le réaudit silencieux de maintenance doit exister");
// Mise à jour canonique : réaudit immédiat et silencieux, sans dialogue d'export.
const automaticAudit=script.slice(script.indexOf("async function auditAfterTemplateUpdate("),
  script.indexOf("async function syncChoiceDialog()"));
assert.ok(automaticAudit.includes("await captureInitialAuditState()"),
  "La sauvegarde initiale interne doit rester disponible même sans audit manuel préalable.");
assert.ok(automaticAudit.includes("const report=await auditWorld()"),
  "La mise à jour doit réellement relancer un audit complet.");
assert.ok(automaticAudit.includes("H0DTemplateManagerState.lastAudit=report"),
  "Le réaudit doit actualiser les résultats du panneau.");
assert.ok(automaticAudit.includes("H0DTemplateManagerState.auditDirty=false"),
  "Le résultat réaudité ne doit pas rester signalé comme obsolète.");
assert.equal(/promptAuditExport|exportAudit\(|createSnapshot\(|saveDataToFile/.test(automaticAudit),false,
  "Aucun export, téléchargement ou dialogue d'export ne doit se produire pendant le réaudit automatique.");
// Régression fonctionnelle : audit sans export et traitement des erreurs.
const buildAutomaticAudit=new Function(
  "auditWorld","captureInitialAuditState","H0DTemplateManagerState","markAuditFinalRecommended","ui","console",
  automaticAudit+";return auditAfterTemplateUpdate;"
);
const autoState={lastAudit:null,auditDirty:true,lastMutation:"ancien état"};
let backups=0,audits=0,notices=[];
const reportExpected={counts:{templates:{ok:12,update:0,absent:0},documents:{warnings:19,errors:0}}};
const markDirty=reason=>{autoState.lastAudit=null;autoState.auditDirty=true;autoState.lastMutation=reason;};
const notifications={info:message=>notices.push(["info",message]),error:message=>notices.push(["error",message])};
const autoAudit=buildAutomaticAudit(async()=>{audits++;return reportExpected;},
  async()=>{backups++;},autoState,markDirty,{notifications}, {error:()=>{}});
assert.equal(await autoAudit("mise à jour canonique"),reportExpected,
  "Le réaudit doit renvoyer le dernier rapport.");
assert.equal(backups,1,"Le réaudit doit vérifier la sauvegarde initiale interne.");
assert.equal(audits,1,"Un seul audit du monde doit être exécuté.");
assert.equal(autoState.lastAudit,reportExpected,"Le dernier rapport doit être immédiatement utilisable.");
assert.equal(autoState.auditDirty,false,"L'audit doit être affiché comme actuel.");
assert.equal(autoState.lastMutation,"","Le motif obsolète doit être effacé.");
assert.equal(notices.filter(([type])=>type==="info").length,2,"Résultat de l'audit notifié sans boîte modale.");
const failState={lastAudit:null,auditDirty:false,lastMutation:""};
const failingAudit=buildAutomaticAudit(async()=>{throw new Error("Audit de test");},
  async()=>{},failState,reason=>{failState.auditDirty=true;failState.lastMutation=reason;},
  {notifications}, {error:()=>{}});
assert.equal(await failingAudit("mise à jour canonique"),null,
  "Un audit en échec ne doit pas être annoncé comme terminé.");
assert.equal(failState.auditDirty,true,
  "Après échec l'audit doit être recommandé manuellement.");
assert.ok(notices.some(([type,message])=>type==="error"&&message.includes("Audit de test")),
  "L'utilisateur doit être informé de l'erreur.");
const installFn=script.slice(script.indexOf("static async _installAll()"),
  script.indexOf("static async _synchronize()"));
assert.ok(installFn.includes('await auditAfterTemplateUpdate("installation / mise à jour des templates")'),
  "Installer / mettre à jour doit réauditer après l'installation.");
assert.ok(installFn.includes("if (!results) return"),
  "Une installation annulée ne doit pas déclencher l'audit.");
const updateFn=script.slice(script.indexOf("static async _updateTemplate("),
  script.indexOf("static async _auditTemplate("));
assert.ok(updateFn.includes("await auditAfterTemplateUpdate("),
  "La mise à jour d'un template individuel doit également rafraîchir le rapport.");
assert.ok(updateFn.indexOf("await updateTemplate(entry)") < updateFn.indexOf("await auditAfterTemplateUpdate("),
  "Le réaudit doit suivre l'écriture des données, pas la précéder.");

assert.ok(script.includes('await refreshAuditSilently("synchronisation du monde")'),"La synchronisation doit relancer un audit silencieux");
assert.ok(script.includes('await refreshAuditSilently("réparation des équipements")'),"La réparation doit rafraîchir l'audit silencieusement");
assert.ok(script.includes('markAuditFinalRecommended("migration des données sûres",{preserveReport:true})'),"La migration doit conserver son réaudit interne tout en recommandant l'audit final");
assert.ok(script.includes('markAuditFinalRecommended("restauration des données")'),"La restauration doit recommander l'audit final");
assert.ok(script.includes("const safeVersionCandidates=audit?.warningTriage"),"Les candidats de migration doivent rester disponibles sur un audit silencieux");
assert.ok(script.includes("hasEquipmentRepair:!!audit && ("),"La réparation doit rester disponible sur un audit silencieux");
assert.equal(script.includes("safeVersionCandidates=(!auditDirty && audit?.warningTriage)"),false,"auditDirty ne doit plus désactiver les migrations si un rapport courant existe");
assert.ok(script.includes("H0DTemplateManagerState.auditDirty=false;"),"Un audit explicite doit remettre l'état à jour");
assert.ok(script.includes("function trustedSafeReloadBackup(doc)"),"La récupération depuis backup sûr doit exister");
assert.ok(script.includes("function safeMissingRecoveryPlan(doc,templateKey,missingKeys=[])"),"Le plan de récupération sûre doit exister");
assert.ok(script.includes("backup.templateId"),"Le backup doit être validé contre le template courant");
assert.ok(script.includes("backup.uuid"),"Le backup doit être validé contre l'UUID courant");
assert.ok(script.includes('migrationKind="backup-recovery"'),"La migration doit tracer les récupérations depuis backup");
assert.ok(script.includes("recoveredKeys"),"Le rapport de migration doit tracer les clés récupérées");
assert.ok(script.includes("doc.safeRecovery?.safe===true"),"Le triage doit rendre les cas récupérables éligibles à la migration sûre");
assert.ok(script.includes("function prototypeBarAttribute(doc)"),"Le manager doit lire la barre prototype canonique");
assert.ok(script.includes("prototypeToken.bar1"),"L'installation doit gérer la barre 1 du prototype Token");
assert.ok(script.includes('"prototype-bar-mismatch"'),"L'audit doit détecter les anciennes barres prototype");
assert.ok(script.includes("prototypeBarCandidates"),"Le triage doit compter les réparations sûres de prototype Token");
assert.ok(script.includes("prototypeBar1:clone"),"Les sauvegardes internes doivent conserver la barre prototype");
assert.ok(script.includes("prototypeBarChanged"),"La migration sûre doit tracer la réparation de barre prototype");
assert.ok(script.includes("async function migrateLegacyEnemyAttackMacro()"),"La migration de la macro ennemie historique doit exister");
assert.ok(script.includes("H0D — ATTAQUES ENNEMI v1.1"),"La migration doit cibler uniquement la macro legacy officielle v1.1");
assert.ok(script.includes("legacyEnemyAttackBackup"),"L'ancien code de la macro ennemie doit être sauvegardé avant conversion");
assert.ok(script.includes("await migrateLegacyEnemyAttackMacro();"),"La conversion de la macro ennemie doit être exécutée au ready");

const auditButton=hbs.indexOf('data-action="audit"');
const snapshotButton=hbs.indexOf('data-action="snapshot"');
const installButton=hbs.indexOf('data-action="installAll"');
assert.ok(snapshotButton>=0 && auditButton>snapshotButton && installButton>auditButton,
  "La barre doit commencer par Snapshot puis Audit puis Installation");

assert.ok(readme.includes("# H0D Template Manager — v1.7.31"),"README non aligné sur la version");
assert.ok(readme.includes("Audit final recommandé"),"README doit documenter l'audit final");

const explicitAudit=script.slice(script.indexOf("static async _audit()"),script.indexOf("static async _installAll()"));
assert.ok(explicitAudit.includes("await captureInitialAuditState()"),"Le premier audit doit créer un état initial interne");
assert.equal(explicitAudit.includes("await createSnapshot("),false,"L’audit ne doit pas exporter de JSON automatiquement");
assert.ok(explicitAudit.includes("audit annulé"),"Un échec de sauvegarde interne doit interrompre l’audit");
const syncFn=script.slice(script.indexOf('async function synchronize('),script.indexOf('async function restoreLastCycle()'));
assert.ok(syncFn.indexOf('if (!entries.length)')<syncFn.indexOf('await game.settings.set(MODULE_ID,LAST_CYCLE_SETTING,runId)'),"La sélection vide ne doit pas effacer le dernier cycle restaurable");
assert.ok(syncFn.includes('await safeReload(e,runId)'),"La synchronisation doit appeler safeReload pour chaque fiche");
assert.ok(script.includes('await pushBackup(doc,runId,entry.scope)'),"La synchronisation doit sauvegarder avant de recharger");
assert.ok(script.includes('await doc.templateSystem.reloadTemplate()'),"La synchronisation doit recharger le template CSB");
assert.ok(script.includes('const INITIAL_AUDIT_FLAG = "initialAuditBackup"'),"Backup initial indépendant des cycles ordinaires");
assert.ok(script.includes('initial ? entry.doc.getFlag?.(MODULE_ID,INITIAL_AUDIT_FLAG)'),"La restauration initiale doit lire son propre backup");
assert.ok(script.includes('const sourceById=new Map(sourceData)'),"L’audit doit mettre en cache les composants par template");
assert.ok(script.includes('commonInterfaceDifferences:r.status.commonInterfaceDifferences ?? []'),"Le rapport doit détailler les différences Actor");
assert.ok(script.includes('if (exportNow === true) await exportAudit(report)'),"L’export d’audit exige une confirmation explicite");
console.log("Template Manager audit workflow 1.7.31 OK");
