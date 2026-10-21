import { openH0DAttacks } from "./h0d-attacks.js";

const MODULE_ID = "h0d-template-manager";
const MODULE_VERSION = "1.7.20";
const LEGACY_TRAIT_ID = "H0DTraitTpl00001";
const BACKUP_KEY = "backups";
const MAX_BACKUPS = 5;
const LAST_CYCLE_SETTING = "lastCycleId";

const TEMPLATE_INDEX = [
  {key:"actor-pj", family:"Actor", kind:"Actor", id:"uympqkQiS6MHHmIx", name:"H0D_Actor-template-PJ v3.72", version:"3.72", file:"H0D_Actor-template-PJ-v3.72.json"},
  {key:"actor-creature", family:"Actor", kind:"Actor", id:"H0DCreatActor001", name:"H0D_Actor-template-creature v1.26", version:"1.26", file:"H0D_Actor-template-creature-v1.26.json"},
  {key:"actor-machine", family:"Actor", kind:"Actor", id:"wRHfQ4gZbHTaYOsR", name:"H0D_Actor-template-machine v3.17", version:"3.17", file:"H0D_Actor-template-machine-v3.17.json"},
  {key:"item-arme", family:"Item", kind:"Item", id:"O6qwtv7ozECILPHV", name:"H0D_Arme v2.8", version:"2.8", file:"H0D_Arme-v2.8.json"},
  {key:"item-armure", family:"Item", kind:"Item", id:"dEeBbuthkI0CVMa3", name:"H0D_Armure v2.0", version:"2.0", file:"H0D_Armure-v2.0.json"},
  {key:"item-don-talent", family:"Item", kind:"Item", id:"H0DDonTalent0001", name:"H0D_Don_Talent v2.5", version:"2.5", file:"H0D_Don_Talent-v2.5.json"},
  {key:"item-modificateur", family:"Item", kind:"Item", id:"H0DCreaMod000001", name:"H0D_Modificateur v1.3", version:"1.3", file:"H0D_Modificateur-v1.3.json"},
  {key:"item-objet", family:"Item", kind:"Item", id:"H0DObjTpl0000001", name:"H0D_Objet v2.9", version:"2.9", file:"H0D_Objet-v2.9.json"},
  {key:"item-ressource", family:"Item", kind:"Item", id:"H0DResTpl0000001", name:"H0D_Ressource v2.5", version:"2.5", file:"H0D_Ressource-v2.5.json"},
  {key:"item-arme-machine", family:"Item", kind:"Item", id:"H0DWeaponMach001", name:"H0D_arme_Machine v3.9", version:"3.9", file:"H0D_arme_Machine-v3.9.json"},
  {key:"item-piece", family:"Item", kind:"Item", id:"H0DCompMach00001", name:"H0D_Pièce_Détachable v2.7", version:"2.7", file:"H0D_Piece_Detachable-v2.7.json"}
];

const MANAGED_IDS = new Set(TEMPLATE_INDEX.map(e => e.id));
const ACTOR_IDS = new Set(TEMPLATE_INDEX.filter(e => e.kind === "Actor").map(e => e.id));
const ITEM_IDS = new Set(TEMPLATE_INDEX.filter(e => e.kind === "Item").map(e => e.id));
const SAFE_VERSION_KEYS = new Set([
  "actor-pj", "actor-creature", "actor-machine",
  "item-armure", "item-don-talent",
  "item-arme", "item-objet", "item-piece"
]);
const SAFE_VERSION_LABELS = {
  "actor-pj":"PJ",
  "actor-creature":"créatures / factions",
  "actor-machine":"machines",
  "item-armure":"armures/boucliers",
  "item-don-talent":"dons/talents",
  "item-arme":"armes",
  "item-objet":"objets",
  "item-piece":"pièces détachables"
};

const SAFE_ADDITIVE_MISSING_KEYS = {
  "actor-pj": new Set([
    "H0D_Artisanat_Arts_Visuels_Bonus_Origine",
    "H0D_Artisanat_Arts_Visuels_Classe",
    "H0D_Artisanat_Arts_Visuels_Divers",
    "H0D_Artisanat_Arts_Visuels_Rangs",
    "H0D_Artisanat_Autre_Bonus_Origine",
    "H0D_Artisanat_Autre_Classe",
    "H0D_Artisanat_Autre_Divers",
    "H0D_Artisanat_Autre_Nom",
    "H0D_Artisanat_Autre_Rangs",
    "H0D_Artisanat_Chimique_Bonus_Origine",
    "H0D_Artisanat_Chimique_Classe",
    "H0D_Artisanat_Chimique_Divers",
    "H0D_Artisanat_Chimique_Rangs",
    "H0D_Artisanat_Ecriture_Bonus_Origine",
    "H0D_Artisanat_Ecriture_Classe",
    "H0D_Artisanat_Ecriture_Divers",
    "H0D_Artisanat_Ecriture_Rangs",
    "H0D_Artisanat_Electronique_Bonus_Origine",
    "H0D_Artisanat_Electronique_Classe",
    "H0D_Artisanat_Electronique_Divers",
    "H0D_Artisanat_Electronique_Rangs",
    "H0D_Artisanat_Mecanique_Bonus_Origine",
    "H0D_Artisanat_Mecanique_Classe",
    "H0D_Artisanat_Mecanique_Divers",
    "H0D_Artisanat_Mecanique_Rangs",
    "H0D_Artisanat_Pharmaceutique_Bonus_Origine",
    "H0D_Artisanat_Pharmaceutique_Classe",
    "H0D_Artisanat_Pharmaceutique_Divers",
    "H0D_Artisanat_Pharmaceutique_Rangs",
    "H0D_Artisanat_Structurel_Bonus_Origine",
    "H0D_Artisanat_Structurel_Classe",
    "H0D_Artisanat_Structurel_Divers",
    "H0D_Artisanat_Structurel_Rangs",
    "H0D_Focus_Bonus_Origine",
    "H0D_Skill_Acrobaties_Bonus_Origine",
    "H0D_Skill_Athletisme_Bonus_Origine",
    "H0D_Skill_Diplomatie_Bonus_Origine",
    "H0D_Skill_Discretion_Bonus_Origine",
    "H0D_Skill_Perception_Bonus_Origine",
    "H0D_Skill_Reparation_Bonus_Origine",
    "H0D_Skill_Soins_Bonus_Origine",
    "H0D_Skill_Survie_Bonus_Origine",
    "H0D_Skill_Technologie_Bonus_Origine"
  ]),
  "actor-creature": new Set([
    "H0D_Creature_DD_Capacites",
    "H0D_Creature_Perception",
    "H0D_Creature_Perception_Portee",
    "H0D_Creature_Sens_Speciaux",
    "H0D_Creature_Sens_Portee"
  ]),
  "actor-machine": new Set([
    "H0D_Machine_Perception_Base",
    "H0D_Machine_Mod_Perception_Temp",
    "H0D_Machine_Perception_Portee_Base"
  ]),
  "item-arme": new Set([
    // Champs neutres apparus sur les anciennes armes ordinaires. Catégorie et
    // Origine restent volontairement exclues car elles demandent un vrai choix.
    "H0D_Arme_Zone",
    "H0D_Arme_Recharge",
    "H0D_Arme_Cout",
    "H0D_Arme_Amelioration_1_Installee",
    "H0D_Arme_Amelioration_1_Nom",
    "H0D_Arme_Amelioration_1_Rang",
    "H0D_Arme_Amelioration_1_Type",
    "H0D_Arme_Amelioration_1_Valeur",
    "H0D_Arme_Amelioration_1_Effet",
    "H0D_Arme_Amelioration_2_Installee",
    "H0D_Arme_Amelioration_2_Nom",
    "H0D_Arme_Amelioration_2_Rang",
    "H0D_Arme_Amelioration_2_Type",
    "H0D_Arme_Amelioration_2_Valeur",
    "H0D_Arme_Amelioration_2_Effet",
    "H0D_Arme_Amelioration_3_Installee",
    "H0D_Arme_Amelioration_3_Nom",
    "H0D_Arme_Amelioration_3_Rang",
    "H0D_Arme_Amelioration_3_Type",
    "H0D_Arme_Amelioration_3_Valeur",
    "H0D_Arme_Amelioration_3_Effet"
  ]),
  "item-piece": new Set([
    "H0D_Composant_Capteur_Specialise",
    "H0D_Composant_Capteur_Mode",
    "H0D_Composant_Capteur_Cible",
    "H0D_Composant_Capteur_Portee",
    "H0D_Composant_Capteur_Bonus_Perception"
  ]),
  "item-armure": new Set([
    "H0D_Armure_Malus",
    "H0D_Armure_Etat",
    "H0D_Armure_Amelioration_1_Installee",
    "H0D_Armure_Amelioration_1_Nom",
    "H0D_Armure_Amelioration_1_Rang",
    "H0D_Armure_Amelioration_1_Type",
    "H0D_Armure_Amelioration_1_Valeur",
    "H0D_Armure_Amelioration_1_Effet",
    "H0D_Armure_Amelioration_2_Installee",
    "H0D_Armure_Amelioration_2_Nom",
    "H0D_Armure_Amelioration_2_Rang",
    "H0D_Armure_Amelioration_2_Type",
    "H0D_Armure_Amelioration_2_Valeur",
    "H0D_Armure_Amelioration_2_Effet",
    "H0D_Armure_Amelioration_3_Installee",
    "H0D_Armure_Amelioration_3_Nom",
    "H0D_Armure_Amelioration_3_Rang",
    "H0D_Armure_Amelioration_3_Type",
    "H0D_Armure_Amelioration_3_Valeur",
    "H0D_Armure_Amelioration_3_Effet"
  ]),
  "item-don-talent": new Set([
    "H0D_DT_Connaissance_Cible_Perso"
  ]),
  "item-objet": new Set([
    "H0D_Objet_Sous_Type",
    "H0D_Objet_Recharge",
    "H0D_Objet_Origine",
    "H0D_Objet_Compatibilite",
    "H0D_Objet_Munition_Effet_Court"
  ])
};

function isSafeAdditiveMissing(templateKey, missingKeys=[]) {
  if (!missingKeys.length) return false;
  const allowed=SAFE_ADDITIVE_MISSING_KEYS[templateKey];
  return !!allowed && missingKeys.every(key=>allowed.has(key));
}

function trustedSafeReloadBackup(doc) {
  const backup=doc?.flags?.world?.h0dSafeReloadBackupV2;
  if (!backup || !backup.props || typeof backup.props!=="object") return null;
  if (String(backup.templateId || "")!==templateId(doc)) return null;
  if (backup.uuid && String(backup.uuid)!==String(doc?.uuid || "")) return null;
  return backup.props;
}

function safeMissingRecoveryPlan(doc,templateKey,missingKeys=[]) {
  if (!missingKeys.length) return {safe:false,recoveredValues:{},defaultKeys:[]};
  const allowed=SAFE_ADDITIVE_MISSING_KEYS[templateKey] || new Set();
  const backup=trustedSafeReloadBackup(doc);
  const recoveredValues={};
  const defaultKeys=[];

  for (const key of missingKeys) {
    if (allowed.has(key)) {
      defaultKeys.push(key);
      continue;
    }
    if (backup && has(backup,key)) {
      recoveredValues[key]=clone(backup[key]);
      continue;
    }
    return {safe:false,recoveredValues:{},defaultKeys:[]};
  }

  return {safe:true,recoveredValues,defaultKeys};
}
const templateCache = new Map();
let equipmentReferenceCache = null;

// Weapon reference names. The v1.0.10 list keeps the Hache de chasse from the current Excel workbook.
// Mechanical values remain read from the validated reference compendiums; armors/shields use the embedded Excel-derived reference file.
const WEAPON_REFERENCE = [
  {name:"Arc à bobine", scope:"pj"},
  {name:"Arc Long de chasseur", scope:"pj"},
  {name:"Arc court du chasseur", scope:"pj"},
  {name:"Baton-Harpon", scope:"pj"},
  {name:"Lance-Cable", scope:"pj"},
  {name:"Filet de retenue", scope:"pj"},
  {name:"Fronde mécanique", scope:"pj"},
  {name:"Fronde de chasse", scope:"pj"},
  {name:"Javelot de chasse", scope:"pj"},
  {name:"couteau de lancer", scope:"pj"},
  {name:"Marteau du clan", scope:"pj"},
  {name:"Masse d'arme du clan", scope:"pj"},
  {name:"Lance de chasse courte", scope:"pj"},
  {name:"Lance de chasse longue", scope:"pj"},
  {name:"Hache de chasse", scope:"pj"},
  {name:"Couteau de dépeçage", scope:"pj"},
  {name:"Couteau de soin", scope:"pj"},
  {name:"Arc lourd d'Aloy", scope:"aloy", aliases:["Aloy — Arc lourd amélioré"]},
  {name:"Lance d'Aloy", scope:"aloy", aliases:["Aloy — Lance de piratage améliorée"]},
  {name:"Lance-Cable", scope:"aloy", aliases:["Aloy — Lance-Cable amélioré"]},
  {name:"Lance-Bombe", scope:"aloy", aliases:["Aloy — Lance-bombes élémentaire amélioré", "Aloy — Lance-bombe élémentaire amélioré"]}
];

const WEAPON_MECHANICAL_KEYS = [
  "H0D_Arme_Categorie", "H0D_Arme_Carac_Attaque", "H0D_Arme_Carac_Degats",
  "H0D_Arme_Bonus_Attaque", "H0D_Arme_Degats", "H0D_Arme_Bonus_Degats",
  "H0D_Arme_Type_Degats", "H0D_Arme_Portee", "H0D_Arme_Mains",
  "H0D_Arme_Critique_Seuil", "H0D_Arme_Critique_Multiplicateur",
  "H0D_Arme_Zone", "H0D_Arme_Recharge", "H0D_Arme_Mode_Munition",
  "H0D_Arme_Type_Munition", "H0D_Arme_Element", "H0D_Arme_Traits_Table"
];

const WEAPON_NUMERIC_KEYS = new Set([
  "H0D_Arme_Bonus_Attaque", "H0D_Arme_Bonus_Degats", "H0D_Arme_Portee",
  "H0D_Arme_Critique_Seuil", "H0D_Arme_Critique_Multiplicateur"
]);

// La Hache de chasse est nouvelle : sa mécanique vient du classeur canonique,
// pas d'un ancien export de compendium. Les autres armes restent adossées aux
// compendiums déjà validés pendant les tests v0.5.2.
const WEAPON_REFERENCE_OVERRIDES = {
  "hache de chasse": {
    H0D_Arme_Categorie:"melee",
    H0D_Arme_Carac_Attaque:"FOR",
    H0D_Arme_Carac_Degats:"FOR",
    H0D_Arme_Bonus_Attaque:0,
    H0D_Arme_Degats:"1d8",
    H0D_Arme_Bonus_Degats:0,
    H0D_Arme_Type_Degats:"Tranchant",
    H0D_Arme_Portee:0,
    H0D_Arme_Mains:"1",
    H0D_Arme_Critique_Seuil:20,
    H0D_Arme_Critique_Multiplicateur:2,
    H0D_Arme_Element:"Aucun",
    H0D_Arme_Traits_Table:[{
      H0D_Arme_Trait_Type:"outil", H0D_Arme_Trait_Perso:"",
      H0D_Arme_Trait_Valeur:0, H0D_Arme_Trait_Parametre:"Aucun", H0D_Arme_Trait_Note:""
    }]
  }
};

function clone(v) { return foundry.utils.deepClone(v); }
function has(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
function bool(v) { return v === true || v === "true" || v === 1 || v === "1"; }
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function templateId(doc) { return String(doc?.system?.template || ""); }
function routeFor(path) { return foundry.utils.getRoute ? foundry.utils.getRoute(path) : path; }
function nowStamp() { return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-"); }
function newRunId() { return `${Date.now()}-${foundry.utils.randomID?.(8) || Math.random().toString(36).slice(2,10)}`; }
function normalizeName(v) {
  return String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[’']/g, "'").replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();
}
function jsonEqual(a,b) { return JSON.stringify(a) === JSON.stringify(b); }
function safeFilename(v) { return String(v).replace(/[^a-zA-Z0-9À-ÿ_.-]+/g,"-").replace(/-+/g,"-"); }

async function confirmDialog(title, content, yes="Continuer") {
  return foundry.applications.api.DialogV2.confirm({
    window:{title}, content,
    yes:{label:yes, icon:"fa-solid fa-check"},
    no:{label:"Annuler", icon:"fa-solid fa-xmark"}
  });
}

async function infoDialog(title, content, ok="Fermer") {
  return foundry.applications.api.DialogV2.prompt({
    window:{title},
    content,
    modal:true,
    rejectClose:false,
    ok:{label:ok, icon:"fa-solid fa-check"}
  });
}

async function promptAuditExport(report,{final=false}={}) {
  if (!report) return;
  const templates=report.counts?.templates || {};
  const documents=report.counts?.documents || {};
  const triage=report.warningTriage || {};
  const exportNow=await foundry.applications.api.DialogV2.confirm({
    window:{title:final ? "H0D — Audit final terminé" : "H0D — Audit terminé"},
    content:`
      <p><strong>${final ? "✅ Vérification finale terminée." : "✅ Audit terminé en lecture seule."}</strong></p>
      <p>Templates : <strong>${templates.ok ?? 0} OK</strong> · ${templates.update ?? 0} mise(s) à jour · ${templates.absent ?? 0} absent(s)<br>
      Fiches : <strong>${documents.ok ?? 0} saines</strong> · ${documents.warnings ?? 0} avertissement(s) · ${documents.errors ?? 0} erreur(s)<br>
      Candidats à migration sûre : <strong>${Number(triage.versionOnlyCandidates || 0)+Number(triage.additiveSafeCandidates || 0)}</strong></p>
      <p class="notes">Le fichier proposé contient exactement ce rapport : aucun second audit ne sera relancé pour l'export.</p>
    `,
    yes:{label:"Exporter le rapport JSON",icon:"fa-solid fa-file-export"},
    no:{label:"Fermer",icon:"fa-solid fa-xmark"}
  });
  if (exportNow) await exportAudit(report);
}

function markAuditFinalRecommended(reason="Modification du monde",{preserveReport=false}={}) {
  if (!preserveReport) H0DTemplateManagerState.lastAudit=null;
  H0DTemplateManagerState.auditDirty=true;
  H0DTemplateManagerState.lastMutation=reason;
}

async function refreshAuditSilently(reason="Maintenance du monde") {
  const report=await auditWorld();
  H0DTemplateManagerState.lastAudit=report;
  markAuditFinalRecommended(reason,{preserveReport:true});
  return report;
}

async function syncChoiceDialog() {
  const fd = await foundry.applications.api.DialogV2.input({
    window:{title:"H0D — Synchroniser le monde"},
    content:`
      <p>Choisis exactement les documents à resynchroniser avec les templates installés.</p>
      <div class="form-group"><label>Documents</label><select name="mode">
        <option value="actor">Actors uniquement</option>
        <option value="item">Items uniquement</option>
        <option value="all">Actors + Items</option>
      </select></div>
      <div class="form-group"><label>Inclure les compendiums Items déverrouillés</label><input type="checkbox" name="packs"></div>
      <p class="notes">Aucun snapshot JSON automatique. Les documents synchronisés reçoivent une sauvegarde interne (5 cycles maximum). Utilise « Exporter snapshot » si tu veux un export complet avant l’opération.</p>`,
    ok:{label:"Synchroniser",icon:"fa-solid fa-arrows-rotate"}
  });
  if (!fd) return null;
  return {mode:String(fd.mode || "actor"), packs:bool(fd.packs)};
}

async function loadTemplate(entryOrId) {
  const entry = typeof entryOrId === "string" ? TEMPLATE_INDEX.find(e => e.id === entryOrId) : entryOrId;
  if (!entry) throw new Error(`Template H0D inconnu : ${entryOrId}`);
  if (templateCache.has(entry.id)) return clone(templateCache.get(entry.id));
  const response = await fetch(routeFor(`modules/${MODULE_ID}/data/templates/${entry.file}`));
  if (!response.ok) throw new Error(`Impossible de charger ${entry.file} (${response.status}).`);
  const data = await response.json();
  templateCache.set(entry.id, data);
  return clone(data);
}

function installedTemplate(entry) {
  const collection = entry.kind === "Actor" ? game.actors : game.items;
  const direct = collection?.get(entry.id);
  if (direct) return direct;
  if (entry.kind === "Item") {
    return collection?.find(d => d.type === "_equippableItemTemplate" && String(d.system?.uniqueId || "") === entry.id) || null;
  }
  return null;
}

async function templateStatus(entry) {
  const doc = installedTemplate(entry);
  const source = await loadTemplate(entry);
  const wantedUnique = Number(source.system?.templateSystemUniqueVersion ?? 0);
  if (!doc) return {code:"absent", label:"Absent", icon:"fa-solid fa-circle-plus", installed:"—", wanted:entry.version, doc:null};
  const installedUnique = Number(doc.system?.templateSystemUniqueVersion ?? 0);
  if (doc.name === entry.name && installedUnique === wantedUnique) {
    return {code:"ok", label:"Canonique", icon:"fa-solid fa-circle-check", installed:entry.version, wanted:entry.version, doc};
  }
  const m = String(doc.name || "").match(/v([0-9.]+)\s*$/i);
  return {code:"update", label:"Mise à jour disponible", icon:"fa-solid fa-arrows-rotate", installed:m?.[1] || doc.name, wanted:entry.version, doc};
}

function componentKeySets(templateData) {
  const labels = new Set();
  const inputs = new Set();
  const all = new Set();
  function walk(node, insideTable=false) {
    if (Array.isArray(node)) { for (const v of node) walk(v, insideTable); return; }
    if (!node || typeof node !== "object") return;
    const key = String(node.key || "");
    if (key) {
      all.add(key);
      if (node.type === "label") labels.add(key);
      else if (["numberField","textField","textArea","select","checkbox","dynamicTable","radioButton","meter"].includes(node.type)) {
        // Child fields of a dynamicTable live inside row objects, not at system.props root.
        if (!insideTable || node.type === "dynamicTable") inputs.add(key);
      }
    }
    const nextInside = insideTable || node.type === "dynamicTable";
    for (const v of Object.values(node)) walk(v, nextInside);
  }
  walk(templateData?.system || {}, false);
  return {labels,inputs,all};
}

function componentInputDefaults(templateData) {
  const defaults=new Map();
  function walk(node, insideTable=false) {
    if (Array.isArray(node)) { for (const v of node) walk(v,insideTable); return; }
    if (!node || typeof node!=="object") return;
    const key=String(node.key || "");
    const type=String(node.type || "");
    const isInput=["numberField","textField","textArea","select","checkbox","dynamicTable","radioButton","meter"].includes(type);
    if (key && isInput && (!insideTable || type==="dynamicTable")) {
      let value;
      if (type==="checkbox") value=has(node,"defaultChecked") ? bool(node.defaultChecked) : bool(node.defaultValue);
      else if (has(node,"defaultValue")) value=clone(node.defaultValue);
      else if (type==="dynamicTable") value={};
      else value="";
      defaults.set(key,clone(value));
    }
    const nextInside=insideTable || type==="dynamicTable";
    for (const v of Object.values(node)) walk(v,nextInside);
  }
  walk(templateData?.system || {},false);
  return defaults;
}

function editableInputSnapshot(templateData, props) {
  const out={};
  const simpleTypes=new Set(["numberField","textField","textArea","select","checkbox","radioButton","meter"]);

  function collectRowKeys(node, keys) {
    if (Array.isArray(node)) { for (const v of node) collectRowKeys(v,keys); return; }
    if (!node || typeof node!=="object") return;
    const key=String(node.key || "");
    const type=String(node.type || "");
    if (key && simpleTypes.has(type)) keys.add(key);
    for (const v of Object.values(node)) collectRowKeys(v,keys);
  }

  function walk(node, insideDynamic=false) {
    if (Array.isArray(node)) { for (const v of node) walk(v,insideDynamic); return; }
    if (!node || typeof node!=="object") return;
    const key=String(node.key || "");
    const type=String(node.type || "");

    if (!insideDynamic && key && simpleTypes.has(type) && has(props,key)) {
      out[key]=clone(props[key]);
    }

    if (!insideDynamic && key && type==="dynamicTable" && has(props,key)) {
      const rowKeys=new Set();
      collectRowKeys(node.rowLayout || node.contents || [],rowKeys);
      const original=props[key];
      const kept=[];
      for (const [rowId,rowRaw] of tableEntries(original)) {
        const row=rowRaw && typeof rowRaw==="object" ? rowRaw : {};
        const slim={};
        if (has(row,"$deleted")) slim.$deleted=clone(row.$deleted);
        for (const rowKey of rowKeys) if (has(row,rowKey)) slim[rowKey]=clone(row[rowKey]);
        kept.push([rowId,slim]);
      }
      out[key]=tableBuildLike(original,kept);
      return;
    }

    const nextInside=insideDynamic || type==="dynamicTable";
    for (const v of Object.values(node)) walk(v,nextInside);
  }

  walk(templateData?.system || {},false);
  return out;
}

function diffShape(before, after, prefix="") {
  const diffs=[];
  if (Array.isArray(before)) {
    if (!Array.isArray(after)) return [prefix || "<racine>"];
    for (let i=0;i<before.length;i++) diffs.push(...diffShape(before[i],after[i],prefix ? `${prefix}[${i}]` : `[${i}]`));
    return diffs;
  }
  if (before && typeof before==="object") {
    if (!after || typeof after!=="object") return [prefix || "<racine>"];
    for (const key of Object.keys(before)) {
      const p=prefix ? `${prefix}.${key}` : key;
      diffs.push(...diffShape(before[key],after[key],p));
    }
    return diffs;
  }
  if (!jsonEqual(before,after)) diffs.push(prefix || "<valeur>");
  return diffs;
}

function tableEntries(v) {
  if (Array.isArray(v)) return v.map((row,i)=>[String(i),row]);
  if (v && typeof v === "object") return Object.entries(v);
  return [];
}
function tableBuildLike(original, entries) {
  if (Array.isArray(original)) return entries.map(([,row])=>row);
  const out={}; for (const [id,row] of entries) out[id]=row; return out;
}
function newRowId() { return foundry.utils.randomID ? foundry.utils.randomID(16) : Math.random().toString(36).slice(2,18); }

function migrateArmorProps(original) {
  const p=clone(original || {});
  const oldTable=p.H0D_Armure_Traits_Table;
  const sourceEntries=tableEntries(oldTable);
  const targetEntries=[];
  const supported=new Set(["renforce","ignifuge","anti_froid","anti_choc","anti_acide","lourd","isole","discret","souple","modulaire","etanche","ancien","fragile","autre"]);
  const effectMap={DEF:"renforce",ResistanceFeu:"ignifuge",ResistanceGel:"anti_froid",ResistanceChoc:"anti_choc",ResistanceAcide:"anti_acide",Lourd:"lourd"};
  const typeMap={thermique:"ignifuge",renforce:"renforce",discret:"discret",isole:"isole",anti_choc:"anti_choc",anti_acide:"anti_acide",souple:"souple",modulaire:"modulaire",etanche:"etanche",ancien:"ancien",fragile:"fragile",lourd:"lourd",autre:"autre",ignifuge:"ignifuge",anti_froid:"anti_froid"};
  const typeLabel={thermique:"Thermique",renforce:"Renforcé",discret:"Discret",isole:"Isolé",anti_choc:"Anti-choc",anti_acide:"Anti-acide",souple:"Souple",modulaire:"Modulaire",etanche:"Étanche",ancien:"Ancien",fragile:"Fragile",lourd:"Lourd",autre:"Autre"};
  for (const [rowId,oldRaw] of sourceEntries) {
    const oldRow=oldRaw && typeof oldRaw === "object" ? oldRaw : {};
    const oldType=String(oldRow.H0D_Armure_Trait_Type || "autre");
    const oldEffect=String(oldRow.H0D_Armure_Trait_Effet_Actif_Calc ?? oldRow.H0D_Armure_Trait_Effet ?? "");
    const oldValue=num(oldRow.H0D_Armure_Trait_Valeur_Active_Calc ?? oldRow.H0D_Armure_Trait_Valeur ?? 0);
    const oldParam=String(oldRow.H0D_Armure_Trait_Parametre_Actif_Calc ?? oldRow.H0D_Armure_Trait_Parametre ?? "");
    const active=has(oldRow,"H0D_Armure_Trait_Actif") ? bool(oldRow.H0D_Armure_Trait_Actif) : true;
    let type=effectMap[oldEffect] || typeMap[oldType] || (supported.has(oldType) ? oldType : "autre");
    let perso=String(oldRow.H0D_Armure_Trait_Perso || "");
    let value=active ? oldValue : 0;
    let param=type === "isole" ? oldParam : "";
    let note=String(oldRow.H0D_Armure_Trait_Note || "");
    if (oldEffect && oldEffect !== "Aucun" && !effectMap[oldEffect]) {
      type="autre";
      if (!perso) perso=typeLabel[oldType] || oldType || "Ancien trait";
      const migrated=`Ancien effet ${oldEffect}${oldValue ? ` (${oldValue})` : ""}${oldParam && oldParam !== "aucun" ? ` — ${oldParam}` : ""}`;
      note=note ? `${note} · ${migrated}` : migrated;
      value=0;
    }
    if (!active) note=note ? `${note} · anciennement inactif` : "Anciennement inactif";
    targetEntries.push([rowId,{H0D_Armure_Trait_Type:type,H0D_Armure_Trait_Perso:perso,H0D_Armure_Trait_Valeur:value,H0D_Armure_Trait_Parametre:param,H0D_Armure_Trait_Note:note}]);
  }
  for (const [key,type,note] of [
    ["H0D_Armure_Resistance_Feu","ignifuge","ancienne résistance Feu"],
    ["H0D_Armure_Resistance_Gel","anti_froid","ancienne résistance Gel"],
    ["H0D_Armure_Resistance_Choc","anti_choc","ancienne résistance Choc"],
    ["H0D_Armure_Resistance_Acide","anti_acide","ancienne résistance Acide"]
  ]) {
    const value=num(p[key]);
    if (value !== 0) targetEntries.push([newRowId(),{H0D_Armure_Trait_Type:type,H0D_Armure_Trait_Perso:"",H0D_Armure_Trait_Valeur:value,H0D_Armure_Trait_Parametre:"",H0D_Armure_Trait_Note:note}]);
    delete p[key];
  }
  const oldText=String(p.H0D_Armure_Resistances || "").trim();
  if (oldText) {
    const current=String(p.H0D_Armure_Description || "").trim();
    const migrated=`Anciennes résistances : ${oldText}`;
    if (!current.includes(migrated)) p.H0D_Armure_Description=current ? `${current}\n${migrated}` : migrated;
  }
  delete p.H0D_Armure_Resistances;
  p.H0D_Armure_Traits_Table=tableBuildLike(oldTable,targetEntries);
  return p;
}

function migrateMachineWeaponProps(original) {
  const p=clone(original || {});
  const wasSpecial=bool(p.H0D_ArmeMachine_Attaque_Speciale);
  if (wasSpecial && String(p.H0D_ArmeMachine_Mode || "") !== "Speciale") p.H0D_ArmeMachine_Mode="Speciale";
  if (String(p.H0D_ArmeMachine_Mode || "") === "Speciale" && num(p.H0D_ArmeMachine_Recharge) < 1) p.H0D_ArmeMachine_Recharge=1;
  delete p.H0D_ArmeMachine_Attaque_Speciale;
  delete p.H0D_ArmeMachine_Etat_Code_Calc;
  return p;
}

function migrateProps(tid, props) {
  if (tid === "dEeBbuthkI0CVMa3") return migrateArmorProps(props);
  if (tid === "H0DWeaponMach001") return migrateMachineWeaponProps(props);
  return clone(props || {});
}

async function pushBackup(doc, runId, scope) {
  const old = clone(doc.getFlag?.(MODULE_ID, BACKUP_KEY) || []);
  old.push({
    runId, createdAt:new Date().toISOString(), uuid:doc.uuid, name:doc.name, img:doc.img,
    documentName:doc.documentName, scope, templateId:templateId(doc),
    templateSystemUniqueVersion:Number(doc.system?.templateSystemUniqueVersion ?? 0),
    props:clone(doc.system?.props || {})
  });
  while (old.length > MAX_BACKUPS) old.shift();
  await doc.setFlag(MODULE_ID, BACKUP_KEY, old);
}

function collectWorldEntries(mode="all") {
  const entries=[];
  const includeActors=mode === "actor" || mode === "all";
  const includeItems=mode === "item" || mode === "all";
  if (includeActors) {
    for (const actor of game.actors.contents) {
      if (actor.type === "_template") continue;
      if (ACTOR_IDS.has(templateId(actor))) entries.push({doc:actor,kind:"Actor",scope:"Actor monde"});
    }
  }
  if (includeItems) {
    for (const item of game.items.contents) {
      if (item.type === "_equippableItemTemplate") continue;
      if (ITEM_IDS.has(templateId(item)) || templateId(item) === LEGACY_TRAIT_ID) entries.push({doc:item,kind:"Item",scope:"Item monde"});
    }
    for (const actor of game.actors.contents) {
      if (actor.type === "_template") continue;
      for (const item of actor.items.contents) if (ITEM_IDS.has(templateId(item)) || templateId(item) === LEGACY_TRAIT_ID) entries.push({doc:item,kind:"Item",scope:`Embarqué — ${actor.name}`});
    }
  }
  return entries;
}


async function collectSafeVersionCandidates() {
  const results=[];
  for (const entry of collectWorldEntries("all")) {
    const tid=templateId(entry.doc);
    const tpl=TEMPLATE_INDEX.find(e=>e.id===tid);
    if (!tpl || !SAFE_VERSION_KEYS.has(tpl.key)) continue;
    const source=await loadTemplate(tpl);
    const wantedVersion=Number(source.system?.templateSystemUniqueVersion ?? 0);
    const installed=installedTemplate(tpl);
    // Une fiche ne peut être migrée sûrement que si le template canonique installé
    // est déjà celui livré par le module. Sinon reloadTemplate() rechargerait l'ancienne structure.
    if (!installed || Number(installed.system?.templateSystemUniqueVersion ?? 0)!==wantedVersion) continue;
    const {inputs}=componentKeySets(source);
    const props=entry.doc.system?.props || {};
    const missing=[...inputs].filter(k=>!has(props,k));
    const stale=Number(entry.doc.system?.templateSystemUniqueVersion ?? 0)!==wantedVersion;
    const recovery=safeMissingRecoveryPlan(entry.doc,tpl.key,missing);
    const additiveSafe=recovery.safe;
    const versionOnly=stale && missing.length===0;
    // Les ajouts explicitement allowlistés sont sûrs même si le document porte
    // déjà la version canonique : certaines anciennes fiches ont été marquées à
    // jour sans avoir reçu les nouveaux champs du template.
    if (versionOnly || additiveSafe) {
      // Ne pas conserver la référence Document : le reload d'un Actor peut recréer
      // ses Embedded Items et invalider les objets collectés au début du cycle.
      results.push({
        uuid:entry.doc.uuid,
        name:entry.doc.name,
        kind:entry.kind,
        scope:entry.scope,
        templateEntry:tpl,
        wantedVersion,
        migrationKind:additiveSafe
          ? (Object.keys(recovery.recoveredValues).length ? "backup-recovery" : "additive-safe")
          : "version-only",
        missingKeys:clone(missing),
        recoveredValues:clone(recovery.recoveredValues),
        defaultKeys:clone(recovery.defaultKeys)
      });
    }
  }
  return results;
}

async function resolveFreshDocument(entry) {
  const doc=await fromUuid(entry.uuid);
  if (!doc) throw new Error(`Document introuvable au moment de la migration (${entry.uuid}).`);
  if (templateId(doc)!==entry.templateEntry.id) throw new Error(`Template modifié entre audit et migration (${templateId(doc)} au lieu de ${entry.templateEntry.id}).`);
  return doc;
}

async function safeVersionReload(entry, runId) {
  let doc=null;
  let originalProps={};
  let originalVersion=0;
  let reloadAttempted=false;
  try {
    doc=await resolveFreshDocument(entry);
    originalProps=clone(doc.system?.props || {});
    originalVersion=Number(doc.system?.templateSystemUniqueVersion ?? 0);
    const validationTemplate=await loadTemplate(entry.templateEntry);
    const originalEditable=editableInputSnapshot(validationTemplate,originalProps);
    await pushBackup(doc,runId,`Migration version sûre — ${entry.scope}`);

    const wantedVersion=Number(entry.wantedVersion);
    const needsReload=originalVersion!==wantedVersion;
    const hasAdditive=(entry.missingKeys || []).length>0;

    if (needsReload) {
      if (!doc.templateSystem?.reloadTemplate) throw new Error("API CSB templateSystem.reloadTemplate() introuvable.");
      reloadAttempted=true;
      await doc.templateSystem.reloadTemplate();

      // reloadTemplate peut remplacer l'Embedded Item lui-même. On résout donc
      // à nouveau l'UUID puis on restaure strictement toutes les valeurs locales.
      doc=await resolveFreshDocument(entry);
      const fresh=clone(doc.system?.props || {});
      const restored=clone(fresh);
      for (const [key,value] of Object.entries(originalProps)) restored[key]=clone(value);
      await doc.update({"system.props":restored});
      doc=await resolveFreshDocument(entry);
    }

    const addedKeys=[];
    const recoveredKeys=[];
    if (hasAdditive) {
      // Les clés neutres explicitement allowlistées reçoivent leur valeur par défaut
      // canonique. Une clé non allowlistée n'est restaurée que si le backup sûr
      // pré-reload du même UUID et du même template contient sa valeur exacte.
      const allowed=SAFE_ADDITIVE_MISSING_KEYS[entry.templateEntry.key];
      const source=await loadTemplate(entry.templateEntry);
      const defaults=componentInputDefaults(source);
      const next=clone(doc.system?.props || {});
      const recoveredValues=entry.recoveredValues || {};

      for (const key of entry.missingKeys || []) {
        if (has(next,key)) continue;

        if (has(recoveredValues,key)) {
          next[key]=clone(recoveredValues[key]);
          addedKeys.push(key);
          recoveredKeys.push(key);
          continue;
        }

        if (!allowed?.has(key)) throw new Error(`Ajout direct refusé : clé ni allowlistée ni récupérable depuis le backup sûr : ${key}`);
        if (!defaults.has(key)) throw new Error(`Valeur par défaut canonique introuvable pour : ${key}`);
        next[key]=clone(defaults.get(key));
        addedKeys.push(key);
      }

      if (addedKeys.length) {
        await doc.update({"system.props":next});
        doc=await resolveFreshDocument(entry);
      }
    }

    const finalProps=doc.system?.props || {};
    const finalEditable=editableInputSnapshot(validationTemplate,finalProps);
    const changedLocal=diffShape(originalEditable,finalEditable);
    const stillMissing=(entry.missingKeys || []).filter(key=>!has(finalProps,key));
    const finalVersion=Number(doc.system?.templateSystemUniqueVersion ?? 0);

    if (changedLocal.length) throw new Error(`Valeurs locales modifiées pendant la migration : ${changedLocal.join(", ")}`);
    if (stillMissing.length) throw new Error(`Champs additifs toujours absents après migration : ${stillMissing.join(", ")}`);
    for (const [key,value] of Object.entries(entry.recoveredValues || {})) {
      if (!has(finalProps,key) || !jsonEqual(finalProps[key],value)) {
        throw new Error(`Valeur récupérée depuis le backup non préservée : ${key}`);
      }
    }
    if (finalVersion!==wantedVersion) throw new Error(`Version finale inattendue (${finalVersion}, attendu ${wantedVersion}).`);

    let migrationKind="version-only";
    if (recoveredKeys.length && needsReload) migrationKind="version+backup-recovery";
    else if (recoveredKeys.length) migrationKind="backup-recovery";
    else if (hasAdditive && needsReload) migrationKind="version+additive-safe-direct";
    else if (hasAdditive) migrationKind="additive-safe-direct";

    return {
      ok:true,uuid:entry.uuid,name:entry.name,scope:entry.scope,
      templateKey:entry.templateEntry.key,from:originalVersion,to:finalVersion,
      migrationKind,addedKeys,recoveredKeys
    };
  } catch(err) {
    console.error(`H0D Template Manager — migration version sûre ${entry.name}`,err);
    try {
      doc=await fromUuid(entry.uuid);
      if (doc && Object.keys(originalProps).length) {
        if (!reloadAttempted) {
          // Aucun reload : retour exact aux props capturées avant tentative.
          await doc.update({"system.props":clone(originalProps)});
        } else {
          // Après reload, conserver la structure recréée par CSB mais remettre
          // toutes les valeurs locales capturées avant l'opération.
          const current=clone(doc.system?.props || {});
          const restored=clone(current);
          for (const [key,value] of Object.entries(originalProps)) restored[key]=clone(value);
          await doc.update({"system.props":restored});
        }
      }
    } catch(restoreErr) {
      console.error(`H0D Template Manager — restauration locale après erreur ${entry.name}`,restoreErr);
    }
    return {ok:false,uuid:entry.uuid,name:entry.name,scope:entry.scope,templateKey:entry.templateEntry.key,from:originalVersion,wanted:Number(entry.wantedVersion),error:String(err?.message || err)};
  }
}

function safeCandidateKey(c) {
  return `${c.templateEntry?.key || "?"}|${c.scope || "?"}|${c.uuid || c.name || "?"}`;
}

async function migrateSafeVersions() {
  const initialCandidates=await collectSafeVersionCandidates();
  if (!initialCandidates.length) {
    ui.notifications.info("H0D : aucun candidat à la migration sûre dans les familles autorisées.");
    return [];
  }
  const counts={};
  for (const key of SAFE_VERSION_KEYS) counts[key]=0;
  for (const c of initialCandidates) counts[c.templateEntry.key]=(counts[c.templateEntry.key]||0)+1;
  const detail=[...SAFE_VERSION_KEYS]
    .filter(key=>counts[key]>0)
    .map(key=>`<strong>${counts[key]}</strong> ${SAFE_VERSION_LABELS[key] || key}`)
    .join(" · ");
  const additiveCount=initialCandidates.filter(c=>c.migrationKind!=="version-only").length;
  const ok=await confirmDialog(
    "H0D — Migrer les données sûres",
    `<p>Mettre à niveau <strong>${initialCandidates.length} fiche(s)</strong> :</p>
     <p>${detail}</p>
     <p><strong>${initialCandidates.length-additiveCount}</strong> candidat(s) « version seule » · <strong>${additiveCount}</strong> évolution(s) additive(s) sûre(s) / récupération(s) sûre(s).</p>
     <p>Les évolutions additives autorisées couvrent les champs neutres dont la valeur canonique par défaut est sans effet. Une clé qui exige normalement un vrai choix mécanique, comme la catégorie d'arme, n'est restaurée que si le backup sûr pré-reload du <strong>même document</strong> et du <strong>même template</strong> contient sa valeur exacte. Le manager n'invente donc toujours aucun rang, statut de classe, origine ou choix mécanique.</p><p>Les clés absentes allowlistées sont ajoutées avec les valeurs par défaut du template ; les clés récupérables sont recopiées depuis le backup sûr puis vérifiées après écriture. Si une mise à jour de version est aussi nécessaire, reloadTemplate() est exécuté puis les champs sont complétés dans la même passe, sans modifier les valeurs locales existantes.</p>
     <p>Le manager traite les candidats <strong>un par un en les recollectant après chaque tentative</strong>. Les autres cas avec champs manquants ou warnings mixtes restent exclus. Les valeurs locales, dynamicTables et propriétés legacy sont conservées. Une sauvegarde interne est créée par fiche ; aucun snapshot JSON n'est téléchargé automatiquement.</p>`,
    "Migrer les données sûres"
  );
  if (!ok) return [];
  const runId=newRunId();
  await game.settings.set(MODULE_ID,LAST_CYCLE_SETTING,runId);
  const results=[];
  const failed=new Set();
  const hardLimit=Math.max(100, initialCandidates.length*4);

  // Important pour les Embedded Items CSB : un reloadTemplate() peut reconstruire
  // la collection embarquée. On ne parcourt donc plus une liste figée. Après chaque
  // tentative, on recollecte les documents actuels depuis le monde et on reprend le
  // prochain candidat encore réellement éligible (version seule ou ajout allowlisté).
  for (let attempt=0; attempt<hardLimit; attempt++) {
    const current=await collectSafeVersionCandidates();
    const candidate=current.find(c=>!failed.has(safeCandidateKey(c)));
    if (!candidate) break;
    console.log(`H0D Template Manager — migration sûre ${results.length+1} — ${candidate.name}`);
    const result=await safeVersionReload(candidate,runId);
    results.push(result);
    if (!result.ok) failed.add(safeCandidateKey(candidate));
  }

  const remaining=await collectSafeVersionCandidates();
  const good=results.filter(r=>r.ok), bad=results.filter(r=>!r.ok);
  H0DTemplateManagerState.lastSafeMigration={
    runId,createdAt:new Date().toISOString(),initial:initialCandidates.length,
    attempted:results.length,ok:good.length,errors:bad.length,remaining:remaining.length,
    remainingCandidates:remaining.map(c=>({uuid:c.uuid,name:c.name,scope:c.scope,templateKey:c.templateEntry.key})),
    results
  };
  const suffix=remaining.length ? `, ${remaining.length} candidat(s) restant(s)` : ", 0 candidat restant";
  ui.notifications[(bad.length || remaining.length) ? "warn" : "info"](`H0D : migration données sûres — ${good.length} OK${bad.length ? `, ${bad.length} erreur(s)` : ""}${suffix}.`);
  return results;
}

async function collectPackEntries({onlyManaged=true, unlockedOnly=false}={}) {
  const entries=[];
  for (const pack of game.packs) {
    if (pack.documentName !== "Item") continue;
    if (unlockedOnly && pack.locked) continue;
    try {
      const docs=await pack.getDocuments();
      for (const item of docs) {
        const tid=templateId(item);
        if (!onlyManaged || ITEM_IDS.has(tid) || tid === LEGACY_TRAIT_ID) entries.push({doc:item,kind:"Item",scope:`Compendium — ${pack.metadata.label}`,pack});
      }
    } catch(err) { console.warn(`H0D Template Manager — pack ignoré ${pack.collection}`,err); }
  }
  return entries;
}

function isSharedAuditPack(pack) {
  const n=normalizeName(`${pack.collection} ${pack.metadata?.label || ""} ${pack.metadata?.name || ""}`);
  return n.includes("world.arme") || n.includes(" item (partage)") || n.includes("h0d_compendium") || n.includes("horizon zero dawn_compendium");
}

async function createSnapshot(reason="manuel", {download=true}={}) {
  const data={
    format:"H0D_TEMPLATE_MANAGER_SNAPSHOT", formatVersion:2, moduleVersion:MODULE_VERSION,
    createdAt:new Date().toISOString(), reason,
    world:{id:game.world?.id,title:game.world?.title,system:game.system?.id,systemVersion:game.system?.version},
    registry:TEMPLATE_INDEX.map(e=>({key:e.key,family:e.family,id:e.id,name:e.name,version:e.version,file:`data/templates/${e.file}`})),
    actors:game.actors.contents.map(a=>a.toObject()),
    items:game.items.contents.map(i=>i.toObject()),
    compendiums:[]
  };
  for (const pack of game.packs) {
    if (pack.documentName !== "Item") continue;
    try {
      const index=await pack.getIndex({fields:["system.template"]});
      const relevant=[...index].some(row=>MANAGED_IDS.has(String(row.system?.template || "")) || String(row.system?.template || "") === LEGACY_TRAIT_ID);
      if (!relevant && !isSharedAuditPack(pack)) continue;
      const docs=await pack.getDocuments();
      data.compendiums.push({collection:pack.collection,title:pack.metadata.label,locked:pack.locked,documents:docs.map(d=>d.toObject())});
    } catch(err) {
      if (isSharedAuditPack(pack)) data.compendiums.push({collection:pack.collection,title:pack.metadata.label,locked:pack.locked,error:String(err?.message || err)});
    }
  }
  if (download) {
    const filename=`H0D-template-manager-snapshot-${safeFilename(reason)}-${nowStamp()}.json`;
    foundry.utils.saveDataToFile(JSON.stringify(data,null,2),"application/json",filename);
    ui.notifications.info(`H0D : snapshot exporté (${reason}).`);
  }
  return data;
}

async function updateTemplate(entry) {
  const source=await loadTemplate(entry);
  let doc=installedTemplate(entry);
  if (doc) {
    if (doc.id !== entry.id) throw new Error(`${entry.name} existe avec un ID différent (${doc.id}). Mise à jour refusée.`);
    const sourceData=clone(source);
    await doc.update({name:sourceData.name, system:sourceData.system});
    return {state:"updated",name:entry.name};
  }
  const createData=clone(source);
  createData.folder=null;
  delete createData._stats;
  const cls=entry.kind === "Actor" ? Actor : Item;
  doc=await cls.create(createData,{keepId:true});
  if (!doc) throw new Error(`Création impossible : ${entry.name}`);
  return {state:"created",name:entry.name};
}

async function installAllTemplates() {
  const ok=await confirmDialog("H0D — Installer / mettre à jour", `<p>Le manager va installer ou remplacer les <strong>${TEMPLATE_INDEX.length} templates canoniques</strong> par ID stable.</p><p>Les fiches existantes ne seront <strong>pas</strong> resynchronisées automatiquement. Aucun snapshot JSON n’est exporté automatiquement.</p>`,"Installer / mettre à jour");
  if (!ok) return;
  const results=[];
  for (const entry of TEMPLATE_INDEX) {
    try { results.push(await updateTemplate(entry)); }
    catch(err) { console.error(`H0D Template Manager — ${entry.name}`,err); results.push({state:"error",name:entry.name,error:String(err?.message || err)}); }
  }
  const errors=results.filter(r=>r.state === "error");
  ui.notifications[errors.length ? "warn" : "info"](`H0D : templates traités (${results.length-errors.length} OK, ${errors.length} erreur(s)).`);
  return results;
}

async function safeReload(entry, runId) {
  const doc=entry.doc;
  const tid=templateId(doc);
  const templateEntry=TEMPLATE_INDEX.find(e=>e.id===tid);
  if (!templateEntry) return {ok:false,kind:entry.kind,name:doc.name,scope:entry.scope,error:`Template ${tid} non géré.`};
  const original=clone(doc.system?.props || {});
  try {
    await pushBackup(doc,runId,entry.scope);
    const templateData=await loadTemplate(templateEntry);
    const {labels}=componentKeySets(templateData);
    const working=migrateProps(tid,original);
    if (!jsonEqual(working,original)) await doc.update({"system.props":working});
    if (!doc.templateSystem?.reloadTemplate) throw new Error("API CSB templateSystem.reloadTemplate() introuvable.");
    await doc.templateSystem.reloadTemplate();
    const fresh=clone(doc.system?.props || {});
    const restored=clone(fresh);
    let kept=0,removed=0;
    for (const [key,value] of Object.entries(working)) {
      if (has(fresh,key) && !labels.has(key)) { restored[key]=clone(value); kept++; }
      else if (!has(fresh,key)) removed++;
    }
    await doc.update({"system.props":restored});
    return {ok:true,kind:entry.kind,name:doc.name,scope:entry.scope,template:templateEntry.name,kept,added:Object.keys(fresh).filter(k=>!has(working,k)).length,removed};
  } catch(err) {
    console.error(`H0D Template Manager — synchro ${doc.name}`,err);
    return {ok:false,kind:entry.kind,name:doc.name,scope:entry.scope,error:String(err?.message || err)};
  }
}

async function synchronize(mode="all", includePacks=false) {
  const runId=newRunId();
  await game.settings.set(MODULE_ID,LAST_CYCLE_SETTING,runId);
  const entries=collectWorldEntries(mode).filter(e=>MANAGED_IDS.has(templateId(e.doc)));
  if (includePacks && (mode === "item" || mode === "all")) entries.push(...(await collectPackEntries({onlyManaged:true,unlockedOnly:true})).filter(e=>ITEM_IDS.has(templateId(e.doc))));
  if (!entries.length) { ui.notifications.warn("H0D : aucun document à synchroniser."); return []; }
  const results=[];
  for (let i=0;i<entries.length;i++) {
    const e=entries[i];
    console.log(`H0D Template Manager — ${i+1}/${entries.length} — [${e.kind}] ${e.doc.name}`);
    results.push(await safeReload(e,runId));
  }
  const good=results.filter(r=>r.ok), bad=results.filter(r=>!r.ok);
  const actors=good.filter(r=>r.kind === "Actor").length;
  const items=good.filter(r=>r.kind === "Item").length;
  ui.notifications[bad.length ? "warn" : "info"](`H0D : ${actors} Actor(s), ${items} Item(s) synchronisé(s)${bad.length ? `, ${bad.length} erreur(s)` : ""}.`);
  return results;
}

async function restoreLastCycle() {
  const runId=game.settings.get(MODULE_ID,LAST_CYCLE_SETTING);
  if (!runId) { ui.notifications.warn("H0D : aucun cycle de sauvegarde connu dans ce monde."); return; }
  const ok=await confirmDialog("H0D — Restaurer dernier cycle", `<p>Restaurer toutes les fiches possédant une sauvegarde du cycle <code>${runId}</code> ?</p><p>Cette action concerne le monde et les compendiums Items actuellement déverrouillés.</p>`,"Restaurer");
  if (!ok) return;
  const entries=[...collectWorldEntries("all"), ...(await collectPackEntries({onlyManaged:false,unlockedOnly:true}))];
  let restored=0,errors=0;
  for (const entry of entries) {
    const backups=clone(entry.doc.getFlag?.(MODULE_ID,BACKUP_KEY) || []);
    const backup=[...backups].reverse().find(b=>b.runId === runId);
    if (!backup?.props) continue;
    try {
      await entry.doc.update({"system.props":clone(backup.props)});
      restored++;
    } catch(err) { errors++; console.error(`H0D Template Manager — restauration ${entry.doc.name}`,err); }
  }
  ui.notifications[errors ? "warn" : "info"](`H0D : ${restored} document(s) restauré(s)${errors ? `, ${errors} erreur(s)` : ""}.`);
  return {restored,errors};
}

async function legacyTraitUsages() {
  const usages=[];
  for (const entry of collectWorldEntries("item")) if (templateId(entry.doc) === LEGACY_TRAIT_ID) usages.push({uuid:entry.doc.uuid,name:entry.doc.name,scope:entry.scope});
  for (const entry of await collectPackEntries({onlyManaged:false,unlockedOnly:false})) if (templateId(entry.doc) === LEGACY_TRAIT_ID) usages.push({uuid:entry.doc.uuid,name:entry.doc.name,scope:entry.scope});
  return usages;
}

async function retireLegacyTrait() {
  const legacy=game.items.get(LEGACY_TRAIT_ID);
  if (!legacy || legacy.type !== "_equippableItemTemplate") { ui.notifications.info("H0D_Trait est déjà retiré."); return; }
  const usages=await legacyTraitUsages();
  if (usages.length) {
    ui.notifications.warn(`H0D_Trait est encore utilisé par ${usages.length} Item(s). Suppression refusée.`);
    console.table(usages);
    return;
  }
  const ok=await confirmDialog("H0D — Retirer le template Trait", `<p><strong>Aucune utilisation de H0D_Trait v2.6 n'a été trouvée.</strong></p><p>Le template peut être supprimé du monde. Aucun snapshot JSON n’est exporté automatiquement.</p>`,"Retirer H0D_Trait");
  if (!ok) return;
  await legacy.delete();
  ui.notifications.info("H0D : template H0D_Trait v2.6 retiré.");
  return true;
}

function cleanTraitTable(v) {
  const rows=tableEntries(v).map(([,row])=>row).filter(row=>row && !bool(row.$deleted)).map(row=>({
    H0D_Arme_Trait_Type:row.H0D_Arme_Trait_Type ?? "",
    H0D_Arme_Trait_Perso:row.H0D_Arme_Trait_Perso ?? "",
    H0D_Arme_Trait_Valeur:String(row.H0D_Arme_Trait_Valeur ?? ""),
    H0D_Arme_Trait_Parametre:row.H0D_Arme_Trait_Parametre ?? ""
  }));
  return rows;
}
function weaponMechanicalValue(props,key) {
  if (key === "H0D_Arme_Traits_Table") return cleanTraitTable(props?.[key]);
  if (WEAPON_NUMERIC_KEYS.has(key)) return num(props?.[key]);
  return props?.[key] ?? "";
}
function weaponExpectedProps(ref) {
  const props=clone(ref?.doc?.system?.props || {});
  const override=WEAPON_REFERENCE_OVERRIDES[normalizeName(ref?.name || "")];
  if (override) for (const [key,value] of Object.entries(override)) props[key]=clone(value);
  return props;
}

// CSB 6 stocke les dynamicTable runtime sous forme d'objet indexé et ajoute
// $deleted à chaque ligne. L'audit normalise en tableau pour comparer, mais une
// réparation doit réinjecter le format natif afin d'éviter que CSB recrée une
// ligne vide (cas de la Hache de chasse observé en v1.0.8/v1.0.9).
function weaponTraitTableNative(raw) {
  const out={};
  cleanTraitTable(raw).forEach((row,i)=>{
    out[String(i)]={
      $deleted:false,
      H0D_Arme_Trait_Type:String(row.H0D_Arme_Trait_Type ?? ""),
      H0D_Arme_Trait_Perso:String(row.H0D_Arme_Trait_Perso ?? ""),
      H0D_Arme_Trait_Valeur:num(row.H0D_Arme_Trait_Valeur ?? 0),
      H0D_Arme_Trait_Parametre:String(row.H0D_Arme_Trait_Parametre ?? ""),
      H0D_Arme_Trait_Note:""
    };
  });
  return out;
}
function weaponDiff(current, ref) {
  const diffs=[];
  const cp=current.system?.props || {}, rp=weaponExpectedProps(ref);
  for (const key of WEAPON_MECHANICAL_KEYS) {
    const a=weaponMechanicalValue(cp,key), b=weaponMechanicalValue(rp,key);
    if (!jsonEqual(a,b)) diffs.push({key,current:a,expected:b});
  }
  return diffs;
}

function tableStorageKind(v) {
  if (Array.isArray(v)) return "array";
  if (v && typeof v === "object") return "object";
  if (v == null) return "missing";
  return typeof v;
}

function weaponTraitDiagnostic(current, ref) {
  const currentRaw=current?.system?.props?.H0D_Arme_Traits_Table;
  const referenceRaw=ref?.doc?.system?.props?.H0D_Arme_Traits_Table;
  const override=WEAPON_REFERENCE_OVERRIDES[normalizeName(ref?.name || "")];
  const overrideRaw=override?.H0D_Arme_Traits_Table;
  const templateRaw=game.items.get("O6qwtv7ozECILPHV")?.system?.props?.H0D_Arme_Traits_Table;
  return {
    currentStorage:tableStorageKind(currentRaw),
    referenceStorage:tableStorageKind(referenceRaw),
    overrideStorage:tableStorageKind(overrideRaw),
    templateStorage:tableStorageKind(templateRaw),
    currentRaw:clone(currentRaw ?? null),
    referenceRaw:clone(referenceRaw ?? null),
    overrideRaw:clone(overrideRaw ?? null),
    templateRaw:clone(templateRaw ?? null)
  };
}

function collectWeaponTraitSamples(maps, wantedType="outil", limit=3) {
  const out=[];
  const seen=new Set();
  for (const map of [maps?.pj,maps?.aloy]) {
    if (!map) continue;
    for (const doc of map.values()) {
      if (!doc || seen.has(doc.uuid)) continue;
      seen.add(doc.uuid);
      const raw=doc.system?.props?.H0D_Arme_Traits_Table;
      const rows=cleanTraitTable(raw);
      if (!rows.some(r=>String(r.H0D_Arme_Trait_Type || "") === wantedType)) continue;
      out.push({name:doc.name,uuid:doc.uuid,storage:tableStorageKind(raw),raw:clone(raw ?? null),clean:rows});
      if (out.length >= limit) return out;
    }
  }
  return out;
}


async function loadEquipmentReference() {
  if (equipmentReferenceCache) return clone(equipmentReferenceCache);
  const response=await fetch(routeFor(`modules/${MODULE_ID}/reference/equipment-reference.json`));
  if (!response.ok) throw new Error(`Impossible de charger le référentiel équipement (${response.status}).`);
  const data=await response.json();
  equipmentReferenceCache=data;
  return clone(data);
}

function cleanArmorTraits(v) {
  const elemental=new Set(["ignifuge","anti_froid","anti_choc","anti_acide"]);
  return tableEntries(v)
    .map(([,row])=>row)
    .filter(row=>row && !bool(row.$deleted))
    .map(row=>({
      type:String(row.H0D_Armure_Trait_Type ?? ""),
      perso:String(row.H0D_Armure_Trait_Perso ?? ""),
      value:num(row.H0D_Armure_Trait_Valeur ?? 0),
      param:String(row.H0D_Armure_Trait_Parametre ?? "")
    }))
    .filter(row=>!elemental.has(row.type))
    .map(row=>({type:row.type,perso:row.perso,value:row.value,param:row.param}))
    .sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
function armorCleanTraitIdentity(row) {
  const type=String(row?.type || "");
  const perso=String(row?.perso || "");
  return type === "autre" ? `autre:${normalizeName(perso)}` : type;
}

function armorResistanceTotals(v) {
  const totals={feu:0,gel:0,choc:0,acide:0};
  const map={ignifuge:"feu",anti_froid:"gel",anti_choc:"choc",anti_acide:"acide"};
  for (const [,row] of tableEntries(v)) {
    if (!row || bool(row.$deleted)) continue;
    const key=map[String(row.H0D_Armure_Trait_Type || "")];
    if (key) totals[key]+=num(row.H0D_Armure_Trait_Valeur);
  }
  return totals;
}

function armorReferenceDiff(item, ref) {
  const p=item.system?.props || {};
  const mechanical=[];
  const narrative=[];
  const expected={
    H0D_Armure_Type:ref.type,
    H0D_Armure_Zone:ref.zone,
    H0D_Armure_Bonus_Defense:num(ref.bonusDefense),
    H0D_Armure_Encombrement:num(ref.charges),
    H0D_Armure_Malus:String(ref.mobility ?? "")
  };
  for (const [key,wanted] of Object.entries(expected)) {
    const current=(key === "H0D_Armure_Bonus_Defense" || key === "H0D_Armure_Encombrement") ? num(p[key]) : String(p[key] ?? "");
    if (!jsonEqual(current,wanted)) mechanical.push({key,current,expected:wanted});
  }
  const currentRes=armorResistanceTotals(p.H0D_Armure_Traits_Table);
  for (const key of ["feu","gel","choc","acide"]) {
    const wanted=num(ref.resistances?.[key]);
    if (currentRes[key] !== wanted) mechanical.push({key:`resistance.${key}`,current:currentRes[key],expected:wanted});
  }
  if (ref.compareTraits) {
    const wantedTraits=(ref.traits || []).map(row=>({type:String(row.type||""),perso:String(row.perso||""),value:num(row.value),param:String(row.param||"")})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const managedIds=new Set(wantedTraits.map(armorCleanTraitIdentity));
    // Les traits locaux hors référentiel sont conservés et ne doivent pas créer
    // de faux mismatch. En revanche, doublons/variantes d'un trait géré restent visibles.
    const currentTraits=cleanArmorTraits(p.H0D_Armure_Traits_Table).filter(row=>managedIds.has(armorCleanTraitIdentity(row)));
    if (!jsonEqual(currentTraits,wantedTraits)) mechanical.push({key:"H0D_Armure_Traits_Table",current:currentTraits,expected:wantedTraits});
  }
  const currentOrigin=String(p.H0D_Armure_Origine ?? "");
  const currentDescription=String(p.H0D_Armure_Description ?? "");
  if (normalizeName(currentOrigin) !== normalizeName(ref.origin || "")) narrative.push({key:"H0D_Armure_Origine",current:currentOrigin,expected:ref.origin || ""});
  if ((ref.description || "-") !== "-" && normalizeName(currentDescription) !== normalizeName(ref.description || "")) narrative.push({key:"H0D_Armure_Description",current:currentDescription,expected:ref.description || ""});
  return {mechanical,narrative};
}

function matchArmorReference(item, refs) {
  const n=normalizeName(item.name);
  return refs.find(ref=>[ref.name,...(ref.aliases || [])].map(normalizeName).includes(n)) || null;
}

async function auditArmors() {
  const reference=await loadEquipmentReference();
  const refs=reference.armorShieldReferences || [];
  const records=[];
  let pjActors=0, embedded=0, armors=0, shields=0;
  for (const actor of game.actors.contents) {
    if (actor.type === "_template" || templateId(actor) !== "uympqkQiS6MHHmIx") continue;
    pjActors++;
    for (const item of actor.items.contents) {
      if (templateId(item) !== "dEeBbuthkI0CVMa3") continue;
      embedded++;
      const itemType=String(item.system?.props?.H0D_Armure_Type || "");
      if (itemType === "bouclier") shields++; else armors++;
      const ref=matchArmorReference(item,refs);
      if (!ref) {
        records.push({uuid:item.uuid,name:item.name,actorName:actor.name,status:"unreferenced",referenceName:null,mechanical:[],narrative:[],sourceWarnings:[]});
        continue;
      }
      const diff=armorReferenceDiff(item,ref);
      records.push({
        uuid:item.uuid,name:item.name,actorName:actor.name,
        status:diff.mechanical.length ? "mismatch" : "ok",referenceName:ref.name,
        mechanical:diff.mechanical,narrative:diff.narrative,sourceWarnings:ref.sourceWarnings || [],
        referenceInfo:{mobility:String(ref.mobility ?? ""),maxDex:ref.maxDex ?? null,resistanceText:String(ref.resistanceText ?? "-")}
      });
    }
  }
  const mechanicalDiffs=records.reduce((n,r)=>n+r.mechanical.length,0);
  const narrativeDiffs=records.reduce((n,r)=>n+r.narrative.length,0);
  const sourceWarnings=refs.reduce((n,r)=>n+(r.sourceWarnings?.length || 0),0);
  return {
    reference:{format:reference.format,formatVersion:reference.formatVersion,sourceWorkbook:reference.sourceWorkbook,sourceSheet:reference.sourceSheet,references:refs.length},
    records,
    refs:refs.map(r=>({name:r.name,aliases:r.aliases || [],type:r.type,compareTraits:r.compareTraits,maxDex:r.maxDex ?? null,resistanceText:r.resistanceText ?? "-",sourceWarnings:r.sourceWarnings || []})),
    summary:{referenceItems:refs.length,pjActors,embeddedItems:embedded,armors,shields,matched:records.filter(r=>r.referenceName).length,ok:records.filter(r=>r.status === "ok").length,mismatch:records.filter(r=>r.status === "mismatch").length,mechanicalDiffs,narrativeDiffs,unreferenced:records.filter(r=>r.status === "unreferenced").length,sourceWarnings}
  };
}

async function findWeaponReferencePacks() {
  let pjPack=game.packs.get("world.arme") || game.packs.find(p=>p.documentName === "Item" && normalizeName(p.metadata.label) === "arme") || null;
  let shared=game.packs.find(p=>p.documentName === "Item" && (normalizeName(p.metadata.label).includes("item (partage)") || normalizeName(p.collection).includes("h0d_compendium"))) || null;
  return {pjPack,shared};
}

async function buildWeaponReferenceMap() {
  const {pjPack,shared}=await findWeaponReferencePacks();
  const maps={pj:new Map(),aloy:new Map(),packs:{pj:pjPack?.collection || null,aloy:shared?.collection || null}};
  if (pjPack) {
    for (const doc of await pjPack.getDocuments()) maps.pj.set(normalizeName(doc.name),doc);
  }
  if (shared) {
    for (const doc of await shared.getDocuments()) maps.aloy.set(normalizeName(doc.name),doc);
  }
  const refs=[];
  for (const ref of WEAPON_REFERENCE) {
    const map=ref.scope === "aloy" ? maps.aloy : maps.pj;
    const names=[ref.name,...(ref.aliases || [])].map(normalizeName);
    const doc=names.map(n=>map.get(n)).find(Boolean) || null;
    refs.push({...ref,doc});
  }
  return {maps,refs};
}

function matchWeaponRef(item, scope, refs) {
  const n=normalizeName(item.name);
  for (const ref of refs.filter(r=>r.scope === scope)) {
    const names=[ref.name,...(ref.aliases || [])].map(normalizeName);
    if (names.includes(n)) return ref;
  }
  return null;
}

async function auditWeapons() {
  const {refs,maps}=await buildWeaponReferenceMap();
  const records=[];
  let pjActors=0, embedded=0, aloyEmbedded=0, pjEmbedded=0;
  for (const actor of game.actors.contents) {
    if (actor.type === "_template") continue;
    const isAloy=normalizeName(actor.name) === "aloy";
    const isPJ=templateId(actor) === "uympqkQiS6MHHmIx";
    if (!isAloy && !isPJ) continue;
    if (isPJ) pjActors++;
    const scope=isAloy ? "aloy" : "pj";
    for (const item of actor.items.contents) {
      if (templateId(item) !== "O6qwtv7ozECILPHV") continue;
      embedded++; if (scope === "aloy") aloyEmbedded++; else pjEmbedded++;
      const ref=matchWeaponRef(item,scope,refs);
      if (!ref?.doc) { records.push({uuid:item.uuid,name:item.name,actorName:actor.name,scope,status:"unreferenced",referenceName:ref?.name || null,mechanical:[],readOnly:false}); continue; }
      const mechanical=weaponDiff(item,ref);
      const traitMismatch=mechanical.some(d=>d.key === "H0D_Arme_Traits_Table");
      records.push({
        uuid:item.uuid,name:item.name,actorName:actor.name,scope,
        status:mechanical.length ? "mismatch" : "ok",referenceName:ref.name,mechanical,readOnly:false,
        traitDiagnostic:traitMismatch ? weaponTraitDiagnostic(item,ref) : null
      });
    }
  }
  const found=refs.filter(r=>r.doc).length, missing=refs.length-found;
  const mechanicalDiffs=records.reduce((n,r)=>n+r.mechanical.length,0);
  const repairable=records.filter(r=>r.status === "mismatch").length;
  return {
    reference:{format:"H0D_WEAPON_REFERENCE",formatVersion:2,source:"Compendiums validés après tests v0.5.2",weapons:refs.length},
    compendiums:[maps.packs.pj,maps.packs.aloy].filter(Boolean),
    records, refs:refs.map(r=>({name:r.name,scope:r.scope,found:!!r.doc,uuid:r.doc?.uuid || null})),
    traitDiagnostics:{
      purpose:"v1.0.9 — diagnostic lecture seule de la structure runtime des dynamicTable d'armes",
      outilSamples:collectWeaponTraitSamples(maps,"outil",3)
    },
    summary:{referenceWeapons:refs.length,referenceFound:found,referenceMissing:missing,pjActors,embeddedWeapons:embedded,pjEmbeddedWeapons:pjEmbedded,aloyEmbeddedWeapons:aloyEmbedded,mechanicalDiffs,repairableWeapons:repairable,unreferenced:records.filter(r=>r.status === "unreferenced").length}
  };
}

function armorTraitIdentity(row) {
  const type=String(row?.H0D_Armure_Trait_Type || "");
  const perso=String(row?.H0D_Armure_Trait_Perso || "");
  return type === "autre" ? `autre:${normalizeName(perso)}` : type;
}

function armorCanonicalRows(ref) {
  const rows=[];
  const elemental=[
    ["ignifuge",ref.resistances?.feu],["anti_froid",ref.resistances?.gel],
    ["anti_choc",ref.resistances?.choc],["anti_acide",ref.resistances?.acide]
  ];
  for (const trait of (ref.traits || [])) rows.push({
    H0D_Armure_Trait_Type:String(trait.type || "autre"),
    H0D_Armure_Trait_Perso:String(trait.perso || ""),
    H0D_Armure_Trait_Valeur:num(trait.value),
    H0D_Armure_Trait_Parametre:String(trait.param || ""),
    H0D_Armure_Trait_Note:""
  });
  for (const [type,value] of elemental) if (num(value) !== 0) rows.push({
    H0D_Armure_Trait_Type:type,H0D_Armure_Trait_Perso:"",
    H0D_Armure_Trait_Valeur:num(value),H0D_Armure_Trait_Parametre:"",H0D_Armure_Trait_Note:""
  });
  return rows;
}

function buildArmorTraitTable(original, ref) {
  const source=tableEntries(original);
  const canonical=armorCanonicalRows(ref);
  const canonicalIds=new Set(canonical.map(armorTraitIdentity));
  const elementalIds=new Set(["ignifuge","anti_froid","anti_choc","anti_acide"]);
  // Conserver les traits locaux supplémentaires ; remplacer uniquement les traits
  // couverts explicitement par la référence et les résistances élémentaires.
  const kept=source.filter(([,row])=>{
    if (!row || bool(row.$deleted)) return false;
    const id=armorTraitIdentity(row);
    return !canonicalIds.has(id) && !elementalIds.has(id);
  }).map(([id,row])=>[id,clone(row)]);
  for (const row of canonical) kept.push([newRowId(),row]);
  return tableBuildLike(original,kept);
}

function armorRepairPlan(props, ref) {
  // On utilise la migration uniquement en mémoire pour comprendre les anciennes
  // lignes de traits. Les autres propriétés legacy/narratives ne sont pas réécrites ici.
  const migrated=migrateArmorProps(props || {});
  return {
    scalars:{
      H0D_Armure_Type:ref.type,
      H0D_Armure_Zone:ref.zone,
      H0D_Armure_Bonus_Defense:num(ref.bonusDefense),
      H0D_Armure_Encombrement:num(ref.charges),
      H0D_Armure_Malus:String(ref.mobility ?? "")
    },
    traits:buildArmorTraitTable(migrated.H0D_Armure_Traits_Table,ref)
  };
}

async function replaceDynamicTableProp(doc, key, desired) {
  const current=doc.system?.props?.[key];
  // Les arrays sont remplacés nativement. Les objets de dynamicTable sont fusionnés
  // par Document.update : il faut donc supprimer explicitement les anciennes lignes
  // avant d'écrire la table canonique, sinon chaque réparation duplique les traits.
  if (Array.isArray(current) || Array.isArray(desired)) {
    await doc.update({[`system.props.${key}`]:clone(desired)});
    return;
  }
  if (current && typeof current === "object") {
    const removals={};
    for (const rowId of Object.keys(current)) removals[`system.props.${key}.-=${rowId}`]=null;
    if (Object.keys(removals).length) await doc.update(removals);
  }
  await doc.update({[`system.props.${key}`]:clone(desired || {})});
}

async function repairEquipment() {
  const weaponReport=await auditWeapons();
  const armorReport=await auditArmors();
  const repairableWeapons=weaponReport.records.filter(r=>r.status === "mismatch");
  const repairableArmors=armorReport.records.filter(r=>r.status === "mismatch");
  const total=repairableWeapons.length+repairableArmors.length;
  if (!total) { ui.notifications.info("H0D : aucun équipement référencé à réparer mécaniquement."); return; }
  const ok=await confirmDialog("H0D — Réparer équipements", `<p><strong>${repairableWeapons.length} arme(s)</strong> et <strong>${repairableArmors.length} armure(s)/bouclier(s)</strong> présentent des différences mécaniques.</p><p>Seuls les champs mécaniques validés sont remplacés. Les noms, images, état équipé, notes et textes narratifs locaux restent intacts. Les équipements hors référentiel sont ignorés. MAX DEX et Résistances texte restent informatifs. Aucun snapshot JSON automatique ; une sauvegarde interne est conservée pour chaque équipement modifié.</p>` ,"Réparer équipements");
  if (!ok) return;
  const runId=newRunId();
  await game.settings.set(MODULE_ID,LAST_CYCLE_SETTING,runId);
  const {refs:weaponRefs}=await buildWeaponReferenceMap();
  const armorReference=await loadEquipmentReference();
  const armorRefs=armorReference.armorShieldReferences || [];
  let weaponsDone=0,armorsDone=0,errors=0;

  for (const rec of repairableWeapons) {
    try {
      const doc=await fromUuid(rec.uuid);
      if (!doc) throw new Error("Document introuvable");
      const ref=weaponRefs.find(r=>r.scope === rec.scope && r.name === rec.referenceName);
      if (!ref?.doc) throw new Error("Référence arme introuvable");
      await pushBackup(doc,runId,`Réparation équipement — ${rec.actorName}`);
      const rp=weaponExpectedProps(ref);
      const update={};
      for (const key of WEAPON_MECHANICAL_KEYS) {
        if (key === "H0D_Arme_Traits_Table") continue;
        update[`system.props.${key}`]=clone(rp[key]);
      }
      if (Object.keys(update).length) await doc.update(update);
      if (rec.mechanical?.some(d=>d.key === "H0D_Arme_Traits_Table")) {
        const nativeTraits=weaponTraitTableNative(rp.H0D_Arme_Traits_Table);
        await replaceDynamicTableProp(doc,"H0D_Arme_Traits_Table",nativeTraits);
      }
      weaponsDone++;
    } catch(err) { errors++; console.error("H0D Template Manager — réparation arme",rec,err); }
  }

  for (const rec of repairableArmors) {
    try {
      const doc=await fromUuid(rec.uuid);
      if (!doc) throw new Error("Document introuvable");
      const ref=armorRefs.find(r=>r.name === rec.referenceName);
      if (!ref) throw new Error("Référence armure/bouclier introuvable");
      await pushBackup(doc,runId,`Réparation équipement — ${rec.actorName}`);
      const plan=armorRepairPlan(doc.system?.props || {},ref);
      const update={};
      for (const [key,value] of Object.entries(plan.scalars)) update[`system.props.${key}`]=clone(value);
      if (Object.keys(update).length) await doc.update(update);
      await replaceDynamicTableProp(doc,"H0D_Armure_Traits_Table",plan.traits);
      armorsDone++;
    } catch(err) { errors++; console.error("H0D Template Manager — réparation armure/bouclier",rec,err); }
  }
  ui.notifications[errors ? "warn" : "info"](`H0D : ${weaponsDone} arme(s) et ${armorsDone} armure(s)/bouclier(s) réparé(s)${errors ? `, ${errors} erreur(s)` : ""}.`);
  return {weaponsDone,armorsDone,errors};
}


function buildWarningTriage(docs, sharedCompendiums=[]) {
  const warningDocs=docs.filter(d=>d.status==="warning");
  const errorDocs=docs.filter(d=>d.status==="error");
  const hasCode=(doc,code)=>(doc.warnings || []).some(w=>w.code===code);
  const missingKeysOf=doc=>(doc.warnings || []).find(w=>w.code==="missing-props")?.keys || [];
  const templateKeyOf=doc=>TEMPLATE_INDEX.find(e=>e.id===doc.templateId)?.key || "";
  const additiveSafeDoc=doc=>hasCode(doc,"missing-props")
    && (isSafeAdditiveMissing(templateKeyOf(doc),missingKeysOf(doc)) || doc.safeRecovery?.safe===true);
  const staleOnly=warningDocs.filter(d=>hasCode(d,"stale-template-version") && !hasCode(d,"missing-props"));
  const additiveSafe=warningDocs.filter(additiveSafeDoc);
  const missingOnly=warningDocs.filter(d=>hasCode(d,"missing-props") && !hasCode(d,"stale-template-version") && !additiveSafeDoc(d));
  const staleAndMissing=warningDocs.filter(d=>hasCode(d,"missing-props") && hasCode(d,"stale-template-version") && !additiveSafeDoc(d));
  const legacyInfoDocs=docs.filter(d=>(d.info || []).some(i=>i.code==="legacy-props"));

  const byTemplate=TEMPLATE_INDEX.map(entry=>{
    const related=docs.filter(d=>d.templateId===entry.id);
    const warnings=related.filter(d=>d.status==="warning");
    const errors=related.filter(d=>d.status==="error");
    return {
      key:entry.key,
      name:entry.name,
      total:related.length,
      ok:related.filter(d=>d.status==="ok").length,
      warnings:warnings.length,
      errors:errors.length,
      staleOnly:warnings.filter(d=>hasCode(d,"stale-template-version") && !hasCode(d,"missing-props")).length,
      missingOnly:warnings.filter(d=>hasCode(d,"missing-props") && !hasCode(d,"stale-template-version") && !additiveSafeDoc(d)).length,
      additiveSafe:warnings.filter(additiveSafeDoc).length,
      mixed:warnings.filter(d=>hasCode(d,"missing-props") && hasCode(d,"stale-template-version") && !additiveSafeDoc(d)).length,
      legacy:related.filter(d=>(d.info || []).some(i=>i.code==="legacy-props")).length
    };
  }).filter(r=>r.total>0);

  const missingKeyCounts=new Map();
  for (const doc of warningDocs) {
    for (const warning of (doc.warnings || [])) {
      if (warning.code!=="missing-props") continue;
      for (const key of (warning.keys || [])) missingKeyCounts.set(key,(missingKeyCounts.get(key)||0)+1);
    }
  }
  const topMissingProps=[...missingKeyCounts.entries()]
    .map(([key,count])=>({key,count}))
    .sort((a,b)=>b.count-a.count || a.key.localeCompare(b.key))
    .slice(0,12);

  const scopeMap=new Map();
  for (const doc of warningDocs) scopeMap.set(doc.scope,(scopeMap.get(doc.scope)||0)+1);
  const byScope=[...scopeMap.entries()].map(([scope,warnings])=>({scope,warnings})).sort((a,b)=>b.warnings-a.warnings || a.scope.localeCompare(b.scope));

  const sharedWarnings=(sharedCompendiums || []).reduce((sum,p)=>sum+Number(p.warnings||0),0);
  const sharedErrors=(sharedCompendiums || []).reduce((sum,p)=>sum+Number(p.errors||0),0);

  return {
    warningDocuments:warningDocs.length,
    errorDocuments:errorDocs.length,
    warningEntries:warningDocs.reduce((sum,d)=>sum+(d.warnings || []).length,0),
    versionOnlyCandidates:staleOnly.length,
    additiveSafeCandidates:additiveSafe.length,
    missingOnlyCandidates:missingOnly.length,
    mixedCandidates:staleAndMissing.length,
    legacyInfoDocuments:legacyInfoDocs.length,
    byTemplate,
    byScope,
    topMissingProps,
    shared:{warnings:sharedWarnings,errors:sharedErrors}
  };
}

async function auditWorld() {
  const templateRows=[];
  for (const entry of TEMPLATE_INDEX) templateRows.push({...entry,status:await templateStatus(entry)});
  const legacy=game.items.get(LEGACY_TRAIT_ID);
  const legacyUsages=legacy ? await legacyTraitUsages() : [];
  const docs=[];
  for (const entry of collectWorldEntries("all")) {
    const tid=templateId(entry.doc);
    if (!MANAGED_IDS.has(tid)) continue;
    const tplEntry=TEMPLATE_INDEX.find(e=>e.id === tid);
    const source=await loadTemplate(tplEntry);
    const {inputs,all}=componentKeySets(source);
    const props=entry.doc.system?.props || {};
    const missing=[...inputs].filter(k=>!has(props,k));
    const legacyProps=Object.keys(props).filter(k=>k.startsWith("H0D_") && !all.has(k));
    const stale=Number(entry.doc.system?.templateSystemUniqueVersion ?? 0) !== Number(source.system?.templateSystemUniqueVersion ?? 0);
    const recovery=safeMissingRecoveryPlan(entry.doc,tplEntry.key,missing);
    const errors=[]; const warnings=[]; const info=[];
    if (missing.length) warnings.push({code:"missing-props",count:missing.length,keys:missing});
    if (stale) warnings.push({code:"stale-template-version",current:entry.doc.system?.templateSystemUniqueVersion,wanted:source.system?.templateSystemUniqueVersion});
    if (legacyProps.length) info.push({code:"legacy-props",count:legacyProps.length,keys:legacyProps});
    docs.push({
      uuid:entry.doc.uuid,name:entry.doc.name,documentName:entry.doc.documentName,scope:entry.scope,
      templateId:tid,templateName:tplEntry.name,status:errors.length?"error":warnings.length?"warning":"ok",
      errors,warnings,info,
      safeRecovery:missing.length ? {
        safe:recovery.safe,
        recoveredKeys:Object.keys(recovery.recoveredValues),
        defaultKeys:clone(recovery.defaultKeys)
      } : null
    });
  }
  const shared=[];
  for (const pack of game.packs) {
    if (pack.documentName !== "Item" || !isSharedAuditPack(pack)) continue;
    try {
      const docsIn=await pack.getDocuments();
      let ok=0,warnings=0,errors=0,managed=0;
      for (const doc of docsIn) {
        const tid=templateId(doc); if (!MANAGED_IDS.has(tid)) continue; managed++;
        const tpl=TEMPLATE_INDEX.find(e=>e.id===tid); const source=await loadTemplate(tpl); const {inputs}=componentKeySets(source);
        const miss=[...inputs].filter(k=>!has(doc.system?.props || {},k));
        const stale=Number(doc.system?.templateSystemUniqueVersion ?? 0)!==Number(source.system?.templateSystemUniqueVersion ?? 0);
        if (miss.length || stale) warnings++; else ok++;
      }
      shared.push({collection:pack.collection,title:pack.metadata.label,locked:pack.locked,managed,ok,warnings,errors});
    } catch(err) { shared.push({collection:pack.collection,title:pack.metadata.label,locked:pack.locked,managed:0,ok:0,warnings:0,errors:1,error:String(err?.message || err)}); }
  }
  const weaponReference=await auditWeapons();
  const armorReference=await auditArmors();
  const warningTriage=buildWarningTriage(docs,shared);
  const counts={templates:{ok:templateRows.filter(r=>r.status.code==="ok").length,update:templateRows.filter(r=>r.status.code==="update").length,absent:templateRows.filter(r=>r.status.code==="absent").length},documents:{ok:docs.filter(d=>d.status==="ok").length,warnings:docs.filter(d=>d.status==="warning").length,errors:docs.filter(d=>d.status==="error").length},legacyTraitUsages:legacyUsages.length};
  const report={format:"H0D_TEMPLATE_MANAGER_INTEGRITY_REPORT",formatVersion:2,moduleVersion:MODULE_VERSION,createdAt:new Date().toISOString(),world:{id:game.world?.id,title:game.world?.title,system:game.system?.id,systemVersion:game.system?.version},registry:TEMPLATE_INDEX,templates:templateRows.map(r=>({key:r.key,id:r.id,name:r.name,version:r.version,status:r.status.code,label:r.status.label,installed:r.status.installed,wanted:r.status.wanted})),documents:docs,sharedCompendiums:shared,legacyTrait:{installed:!!legacy,usages:legacyUsages},weaponReference,armorReference,warningTriage,safeVersionMigration:H0DTemplateManagerState.lastSafeMigration,counts};
  H0DTemplateManagerState.lastAudit=report;
  return report;
}

async function exportAudit(report=null) {
  let current=report;
  if (!current) {
    ui.notifications.info("H0D : nouvel audit en cours avant export…");
    current=await auditWorld();
    H0DTemplateManagerState.auditDirty=false;
    H0DTemplateManagerState.lastMutation="";
  }
  foundry.utils.saveDataToFile(JSON.stringify(current,null,2),"application/json",`H0D-template-manager-audit-${nowStamp()}.json`);
  ui.notifications.info("H0D : rapport d'audit exporté.");
  return current;
}

const H0DTemplateManagerState={lastAudit:null,lastSafeMigration:null,app:null,auditDirty:false,lastMutation:""};

const {ApplicationV2,HandlebarsApplicationMixin}=foundry.applications.api;
class H0DTemplateManagerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS={
    id:"h0d-template-manager",
    classes:["h0d-template-manager"],
    tag:"div",
    window:{title:"H0D — Template Manager",icon:"fa-solid fa-shield-halved",resizable:true},
    position:{width:1180,height:780},
    actions:{
      audit:H0DTemplateManagerApp._audit,
      installAll:H0DTemplateManagerApp._installAll,
      synchronize:H0DTemplateManagerApp._synchronize,
      restore:H0DTemplateManagerApp._restore,
      snapshot:H0DTemplateManagerApp._snapshot,
      openTemplate:H0DTemplateManagerApp._openTemplate,
      updateTemplate:H0DTemplateManagerApp._updateTemplate,
      auditTemplate:H0DTemplateManagerApp._auditTemplate,
      retireTrait:H0DTemplateManagerApp._retireTrait,
      repairEquipment:H0DTemplateManagerApp._repairEquipment,
      migrateSafeVersions:H0DTemplateManagerApp._migrateSafeVersions
    }
  };
  static PARTS={main:{template:`modules/${MODULE_ID}/templates/manager.hbs`}};
  async _prepareContext(options={}) {
    const context=await super._prepareContext(options);
    const templates=[];
    for (const entry of TEMPLATE_INDEX) templates.push({...entry,status:await templateStatus(entry)});
    const legacy=game.items.get(LEGACY_TRAIT_ID);
    const legacyUsages=legacy ? await legacyTraitUsages() : [];
    const audit=H0DTemplateManagerState.lastAudit;
    const auditDirty=H0DTemplateManagerState.auditDirty;
    const weaponSummary=audit?.weaponReference?.summary || {
      referenceWeapons:"—",referenceFound:"—",referenceMissing:"—",pjEmbeddedWeapons:"—",aloyEmbeddedWeapons:"—",
      mechanicalDiffs:"—",repairableWeapons:0,unreferenced:"—"
    };
    const armorSummary=audit?.armorReference?.summary || {
      referenceItems:"—",embeddedItems:"—",armors:"—",shields:"—",ok:"—",matched:"—",
      mechanicalDiffs:"—",mismatch:0,unreferenced:"—",sourceWarnings:"—"
    };
    const safeVersionCandidates=audit?.warningTriage
      ? Number(audit.warningTriage.versionOnlyCandidates||0)+Number(audit.warningTriage.additiveSafeCandidates||0)
      : 0;
    return foundry.utils.mergeObject(context,{
      moduleVersion:MODULE_VERSION,
      actorTemplates:templates.filter(e=>e.kind==="Actor"),
      itemTemplates:templates.filter(e=>e.kind==="Item"),
      legacy:{installed:!!legacy,name:legacy?.name || "H0D_Trait v2.6",usages:legacyUsages.length,canRemove:!!legacy && legacyUsages.length===0},
      auditSummary:audit ? {available:true,createdAt:audit.createdAt,...audit.counts} : {available:false},
      auditState:{
        available:!!audit,
        dirty:auditDirty,
        label:auditDirty ? "Audit final recommandé" : (audit ? "Refaire l’audit" : "Audit monde"),
        hint:auditDirty
          ? `Le monde a été modifié${H0DTemplateManagerState.lastMutation ? ` : ${H0DTemplateManagerState.lastMutation}` : ""}. Relancer un audit global est recommandé.`
          : (audit ? "Relancer un audit global en lecture seule." : "Lancer l’audit global en lecture seule.")
      },
      warningTriage:audit?.warningTriage ? {available:true,...audit.warningTriage} : {available:false},
      safeVersionCandidates,
      weaponSummary,
      armorSummary,
      hasEquipmentRepair:!!audit && (Number(weaponSummary.repairableWeapons||0)+Number(armorSummary.mismatch||0))>0,
      lastCycle:game.settings.get(MODULE_ID,LAST_CYCLE_SETTING) || "—"
    },{inplace:false});
  }
  static async _audit() {
    const final=H0DTemplateManagerState.auditDirty;
    ui.notifications.info(final ? "H0D : audit final en cours…" : "H0D : audit en cours…");
    const report=await auditWorld();
    H0DTemplateManagerState.lastAudit=report;
    H0DTemplateManagerState.auditDirty=false;
    H0DTemplateManagerState.lastMutation="";
    ui.notifications.info(final ? "H0D : audit final terminé." : "H0D : audit terminé (lecture seule).");
    await this.render({force:true});
    await promptAuditExport(report,{final});
  }
  static async _installAll() {
    const results=await installAllTemplates();
    if (results) markAuditFinalRecommended("installation / mise à jour des templates");
    await this.render({force:true});
  }
  static async _synchronize() {
    const choice=await syncChoiceDialog();
    if (!choice) return;
    const results=await synchronize(choice.mode,choice.packs);
    if (results?.some(r=>r.ok)) await refreshAuditSilently("synchronisation du monde");
    await this.render({force:true});
  }
  static async _restore() {
    const result=await restoreLastCycle();
    if (result?.restored>0) markAuditFinalRecommended("restauration des données");
    await this.render({force:true});
  }
  static async _snapshot() { await createSnapshot("manuel"); }
  static async _openTemplate(event,target) { const entry=TEMPLATE_INDEX.find(e=>e.key===target.dataset.key); const doc=entry&&installedTemplate(entry); if (!doc) return ui.notifications.warn("H0D : template absent."); doc.sheet?.render(true); }
  static async _updateTemplate(event,target) { const entry=TEMPLATE_INDEX.find(e=>e.key===target.dataset.key); if (!entry) return; const ok=await confirmDialog("H0D — Mettre à jour un template",`<p>Mettre à jour <strong>${entry.name}</strong> uniquement ?</p><p>Les fiches utilisant ce template ne seront pas resynchronisées automatiquement. Aucun snapshot JSON n’est exporté automatiquement.</p>`,"Mettre à jour"); if (!ok) return; await updateTemplate(entry); markAuditFinalRecommended(`mise à jour de ${entry.name}`); await this.render({force:true}); }
  static async _auditTemplate(event,target) { const key=target.dataset.key; const report=await auditWorld(); const entry=TEMPLATE_INDEX.find(e=>e.key===key); const docs=report.documents.filter(d=>d.templateId===entry?.id); const bad=docs.filter(d=>d.status!=="ok"); ui.notifications.info(`H0D : ${entry?.name || key} — ${docs.length} fiche(s), ${bad.length} à examiner.`); H0DTemplateManagerState.lastAudit=report; await this.render({force:true}); }
  static async _retireTrait() { const removed=await retireLegacyTrait(); if (removed) markAuditFinalRecommended("retrait du template legacy"); await this.render({force:true}); }
  static async _repairEquipment() {
    const result=await repairEquipment();
    if (result && (result.weaponsDone+result.armorsDone)>0) await refreshAuditSilently("réparation des équipements");
    await this.render({force:true});
  }
  static async _migrateSafeVersions() {
    const liveCandidates=await collectSafeVersionCandidates();
    if (!liveCandidates.length) {
      H0DTemplateManagerState.lastAudit=await auditWorld();
      await infoDialog(
        "H0D — Aucune migration nécessaire",
        "<p><strong>✅ Aucun candidat sûr n'est actuellement détecté.</strong></p><p>Le bouton était probablement encore affiché à partir d'un audit précédent. Le monde vient d'être réaudité et l'interface va être actualisée.</p>",
        "Fermer"
      );
      await this.render({force:true});
      return;
    }

    const previousRunId=H0DTemplateManagerState.lastSafeMigration?.runId || null;
    await migrateSafeVersions();
    const migration=H0DTemplateManagerState.lastSafeMigration;

    // Annulation ou absence de candidat : ne pas afficher un ancien bilan comme s'il
    // venait d'être exécuté.
    if (!migration || migration.runId === previousRunId) {
      H0DTemplateManagerState.lastAudit=await auditWorld();
      await this.render({force:true});
      return;
    }

    const audit=await auditWorld();
    H0DTemplateManagerState.lastAudit=audit;
    const triage=audit.warningTriage || {};
    const safeRemaining=Number(triage.versionOnlyCandidates || 0)+Number(triage.additiveSafeCandidates || 0);
    const success=Number(migration.errors || 0)===0
      && Number(migration.remaining || 0)===0
      && safeRemaining===0;

    const title=success
      ? "H0D — Migration terminée avec succès"
      : "H0D — Migration terminée avec anomalies";
    const verdict=success
      ? "<p><strong>✅ MIGRATION RÉUSSIE</strong></p>"
      : "<p><strong>⚠️ MIGRATION À VÉRIFIER</strong></p>";
    const content=`
      ${verdict}
      <p><strong>${migration.ok}</strong> fiche(s) migrée(s) avec succès sur <strong>${migration.initial}</strong> candidat(s) initiaux.</p>
      <p>Erreurs pendant la migration : <strong>${migration.errors}</strong><br>
      Candidats sûrs encore détectés : <strong>${safeRemaining}</strong><br>
      Warnings monde restants après réaudit : <strong>${triage.warningDocuments ?? audit.counts?.documents?.warnings ?? "—"}</strong><br>
      Erreurs monde après réaudit : <strong>${triage.errorDocuments ?? audit.counts?.documents?.errors ?? "—"}</strong></p>
      <p class="notes">Un réaudit de contrôle vient d'être exécuté automatiquement pour ce bilan. Le bouton principal restera toutefois sur « Audit final recommandé » afin de permettre une vérification globale explicite après toutes les opérations.</p>
    `;

    ui.notifications[success ? "info" : "warn"](
      success
        ? `H0D : migration réussie — ${migration.ok}/${migration.initial} fiche(s), 0 candidat sûr restant.`
        : `H0D : migration à vérifier — ${migration.ok}/${migration.initial} OK, ${migration.errors} erreur(s), ${safeRemaining} candidat(s) sûr(s) restant(s).`
    );
    try {
      await infoDialog(title,content,"Fermer");
    } catch(err) {
      console.error("H0D Template Manager — impossible d'afficher le bilan final de migration.",err);
      ui.notifications.warn("H0D : migration terminée, mais la fenêtre de bilan n'a pas pu s'afficher. Lance l'audit final pour vérifier l'état global.");
    }
    markAuditFinalRecommended("migration des données sûres",{preserveReport:true});
    await this.render({force:true});
  }
}


function getManagedTemplate(keyOrId) {
  const wanted=String(keyOrId || "");
  const entry=TEMPLATE_INDEX.find(e=>e.key===wanted || e.id===wanted);
  return entry ? installedTemplate(entry) : null;
}

function openManager() {
  if (!game.user?.isGM) return ui.notifications.warn("H0D Template Manager est réservé au MJ.");
  const existing=foundry.applications.instances.get("h0d-template-manager");
  if (existing) return existing.bringToFront();
  const app=new H0DTemplateManagerApp();
  H0DTemplateManagerState.app=app;
  return app.render({force:true});
}


/* Macro universelle ajoutée sans modifier ni supprimer la macro historique.
 * Une macro personnelle de même nom est également préservée sans réécriture.
 */
async function ensureAttacksMacro() {
  if (!game.user?.isGM) return;
  const name="H0D — Attaques";
  const existing=game.macros?.getName(name);
  if (existing) {
    // Pas de mise à jour silencieuse d'une macro de combat utilisée en partie.
    if (existing.command !== "game.h0dTemplateManager.openAttacks();") {
      console.warn("H0D Template Manager | Une macro nommée H0D — Attaques existe déjà : conservée sans modification.");
    }
    return existing;
  }
  try {
    return await Macro.create({
      name,type:"script",scope:"global",img:"icons/weapons/fist/boxing-gloves.webp",
      command:"game.h0dTemplateManager.openAttacks();",
      flags:{"h0d-template-manager":{managedAttackLauncher:true}}
    });
  } catch (err) {
    console.error("H0D Template Manager | Impossible de créer la nouvelle macro Attaques (ancienne macro intacte).",err);
    ui.notifications?.warn?.("H0D : macro Attaques non créée automatiquement, consulter la console.");
    return null;
  }
}

Hooks.once("init",()=>{
  game.settings.register(MODULE_ID,LAST_CYCLE_SETTING,{scope:"world",config:false,type:String,default:""});
});

Hooks.on("getSceneControlButtons",controls=>{
  if (!game.user?.isGM || !controls.tokens?.tools) return;
  controls.tokens.tools.h0dTemplateManager={
    name:"h0dTemplateManager",title:"H0D — Template Manager",icon:"fa-solid fa-shield-halved",
    order:Object.keys(controls.tokens.tools).length,button:true,visible:true,
    onChange:()=>openManager()
  };
});

Hooks.once("ready",async()=>{
  const api={
    open:openManager,
    openAttacks:openH0DAttacks,
    audit:auditWorld,
    exportAudit,
    exportSnapshot:createSnapshot,
    installTemplates:installAllTemplates,
    synchronizeActors:()=>synchronize("actor",false),
    synchronizeItems:(packs=false)=>synchronize("item",packs),
    synchronizeAll:(packs=false)=>synchronize("all",packs),
    restoreLastCycle,
    auditWeapons,
    auditArmors,
    repairEquipment,
    retireLegacyTrait,
    getTemplate:getManagedTemplate,
    registry:()=>clone(TEMPLATE_INDEX)
  };
  const mod=game.modules.get(MODULE_ID);
  if (mod) mod.api=api;
  game.h0dTemplateManager=api;
  await ensureAttacksMacro();
  console.log(`H0D Template Manager v${MODULE_VERSION} prêt — interface ApplicationV2, API builders active.`);
});
