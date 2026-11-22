// Vérification statique du template PJ v3.75 ; exécuter : node tests/test-pj-skill-dialog.cjs
// Ne remplace pas les tests d'intégration sur Foundry v14 / CSB 6.0.2.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const readJson = file => JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const old = readJson("data/templates/H0D_Actor-template-PJ-v3.74.json");
const sheet = readJson("data/templates/H0D_Actor-template-PJ-v3.75.json");
const manifest = readJson("module.json");
const manager = fs.readFileSync(path.join(root,"scripts/h0d-template-manager.js"),"utf8");

function traverse(node, callback) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { node.forEach(child => traverse(child, callback)); return; }
  callback(node);
  for (const child of Object.values(node)) if (child && typeof child === "object") traverse(child, callback);
}
const found = [], takes = [];
traverse(sheet.system, node => {
  if (node?.type !== "label") return;
  if (node.cssClass?.includes("h0d-take-skill")) takes.push(node);
  const isSkill = /^(H0D_Skill_.*_Total|H0D_Artisanat_.*_Total|H0D_Quick_.*_Roll|H0D_Connaissance_Total)$/.test(node.key || "");
  const isFocus = node.value === "${H0D_Focus_Bonus}$";
  if (isSkill || isFocus) found.push({node,isFocus});
});
assert.equal(takes.length,0,"Boutons 10/20 résiduels");
assert.equal(found.length,23,"Tous les types de tests ne sont pas présents");
for (const {node} of found) {
  assert.match(node.rollMessage, /H0D_Test_Mode:'Mode de test'/,"Choix du mode manquant");
  assert.match(node.rollMessage, /H0D_Test_Mod:'Bonus \/ malus situationnel'/,"Bonus/malus manquant");
  assert.match(node.rollMessage, /H0D_Test_Formule:=switchCase/,"Choix entre 1d20, 10 et 20 manquant");
  assert.match(node.rollMessage, /:=\[:H0D_Test_Formule:\]/,"Formule dynamique manquante");
  assert.match(node.rollMessage, /\+ H0D_Test_Mod\}\$/,"Bonus/malus non additionné au total");
  assert.match(node.cssClass, /h0d-roll-value/,"L'interaction visuelle n'est pas activée");
}
const tabs = sheet.system.body.contents[0].contents;
const skillTab = tabs[1].contents[0].contents[0].contents[0];
const skillTable = skillTab.contents[6];
const craftTable = skillTab.contents[7].contents[2];
const knowledgeTable = skillTab.contents[8].contents[2];
const quickTable = tabs[0].contents[0].contents[5].contents[1];
assert(skillTable.contents.every(row => row.length === 9),"Colonnes du tableau principal");
assert(craftTable.contents.every(row => row.length === 8),"Colonnes du tableau Artisanat");
assert(quickTable.contents.every(row => row.length === 2),"Colonnes des raccourcis");
assert.equal(knowledgeTable.rowLayout.length,12,"Colonnes de Connaissances");
assert.equal(sheet._id,old._id,"L'identifiant CSB doit rester stable");
assert.equal(sheet.name,"H0D_Actor-template-PJ v3.75");
assert.equal(manifest.version,"1.7.42");
assert.match(manager, /const MODULE_VERSION = "1\.7\.42";/);
assert.match(manager, /file:"H0D_Actor-template-PJ-v3\.81\.json"/);
const oldStable = structuredClone(old.system);
const newStable = structuredClone(sheet.system);
for (const sys of [oldStable,newStable]) {
  delete sys.header; delete sys.body; delete sys.templateSystemUniqueVersion;
}
assert.deepEqual(newStable,oldStable,"Les données mécaniques hors composants UI ont été changées");
console.log("OK — 23 tests de compétences / connaissances, retrait des boutons, colonnes et versions vérifiés.");
