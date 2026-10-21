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

assert.equal(manifest.version,"1.7.20","Le manifest doit être en 1.7.20");
assert.ok(script.includes('const MODULE_VERSION = "1.7.20";'),"MODULE_VERSION doit être en 1.7.20");

assert.ok(hbs.includes('data-action="audit"'),"Le bouton Audit doit rester présent");
assert.ok(hbs.includes("{{auditState.label}}"),"Le libellé d'audit doit être contextuel");
assert.ok(hbs.includes("audit-dirty"),"L'état Audit final recommandé doit être stylable");
assert.equal(hbs.includes('data-action="exportAudit"'),false,"Exporter audit ne doit plus être dans la barre");
assert.equal(hbs.includes('data-action="closeApp"'),false,"Fermer ne doit plus être dans la barre");
assert.ok(hbs.includes("Snapshot de sécurité"),"Le snapshot doit être présenté comme sauvegarde de sécurité");
assert.ok(hbs.includes("Restaurer données"),"Le rollback doit décrire précisément ce qu'il restaure");

assert.ok(script.includes("async function promptAuditExport(report,{final=false}={})"),"Le dialogue d'export post-audit est absent");
assert.ok(script.includes("if (exportNow) await exportAudit(report);"),"L'export post-audit doit réutiliser le rapport calculé");
assert.ok(script.includes("async function exportAudit(report=null)"),"L'API exportAudit doit rester compatible");
assert.ok(script.includes("if (!current) {"),"L'API exportAudit seule doit pouvoir relancer un audit frais");
assert.ok(script.includes("auditDirty:false"),"L'état auditDirty doit être initialisé");
assert.ok(script.includes('label:auditDirty ? "Audit final recommandé"'),"Le libellé final recommandé doit dépendre de l'état sale");
assert.ok(script.includes("async function refreshAuditSilently"),"Le réaudit silencieux de maintenance doit exister");
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

const auditButton=hbs.indexOf('data-action="audit"');
const snapshotButton=hbs.indexOf('data-action="snapshot"');
const installButton=hbs.indexOf('data-action="installAll"');
assert.ok(auditButton>=0 && snapshotButton>auditButton && installButton>snapshotButton,
  "La barre doit commencer par Audit puis Snapshot puis Installation");

assert.ok(readme.startsWith("# H0D Template Manager — v1.7.20"),"README non aligné sur la version");
assert.ok(readme.includes("Audit final recommandé"),"README doit documenter l'audit final");

console.log("Template Manager audit workflow 1.7.20 OK");
