export const H0D_LEVEL_CLASSES = Object.freeze({
  Fort:          {label:"Héros Fort",          die:"1d8",  dieLabel:"d8",  dieMax:8,  skillBase:3, rankKey:"H0D_Classe_Fort_Rangs"},
  Rapide:        {label:"Héros Rapide",        die:"1d8",  dieLabel:"d8",  dieMax:8,  skillBase:5, rankKey:"H0D_Classe_Rapide_Rangs"},
  Robuste:       {label:"Héros Robuste",       die:"1d10", dieLabel:"d10", dieMax:10, skillBase:3, rankKey:"H0D_Classe_Robuste_Rangs"},
  Intelligent:   {label:"Héros Intelligent",   die:"1d6",  dieLabel:"d6",  dieMax:6,  skillBase:9, rankKey:"H0D_Classe_Intelligent_Rangs"},
  Devoue:        {label:"Héros Dévoué",        die:"1d6",  dieLabel:"d6",  dieMax:6,  skillBase:5, rankKey:"H0D_Classe_Devoue_Rangs"},
  Charismatique: {label:"Héros Charismatique", die:"1d6",  dieLabel:"d6",  dieMax:6,  skillBase:7, rankKey:"H0D_Classe_Charismatique_Rangs"}
});

export const H0D_CAMPAIGN_MAX_LEVEL = 15;
export const H0D_BASE_CLASS_MAX_RANK = 10;

const MODULE_ID="h0d-template-manager";
const HISTORY_KEY="H0D_Skill_Progression";

function num(v) {
  const n=Number(v);
  return Number.isFinite(n) ? n : 0;
}
function bool(v) {
  return v===true || v==="true" || v===1 || v==="1";
}
function clone(v) {
  if (globalThis.foundry?.utils?.deepClone) return foundry.utils.deepClone(v);
  return v===undefined ? undefined : JSON.parse(JSON.stringify(v));
}
function jsonEqualForRestore(a,b) {
  try { return JSON.stringify(a)===JSON.stringify(b); }
  catch (_) { return false; }
}
function esc(v) {
  return String(v ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function activeHistoryEntries(raw) {
  if (!raw || typeof raw!=="object") return [];
  const entries=Array.isArray(raw)
    ? raw.map((row,i)=>[String(i),row])
    : Object.entries(raw);
  return entries.filter(([,row])=>row && typeof row==="object" && !bool(row.$deleted));
}

export function analyzeHistory(raw) {
  const entries=activeHistoryEntries(raw);
  const rows=entries.map(([id,row])=>({
    id,
    row,
    level:num(row.H0D_Skill_Level_Niveau),
    cls:String(row.H0D_Skill_Level_Classe || "")
  }));
  const levels=rows.map(r=>r.level).filter(n=>n>0).sort((a,b)=>a-b);
  const errors=[];
  if (levels.length!==rows.length) errors.push("Une ligne de progression n’a pas de niveau valide.");
  for (let i=0;i<levels.length;i++) {
    if (levels[i]!==i+1) {
      errors.push("L’historique doit contenir exactement une ligne pour chaque niveau, sans trou ni doublon.");
      break;
    }
  }
  for (const r of rows) {
    if (!H0D_LEVEL_CLASSES[r.cls]) {
      errors.push(`Classe inconnue dans l’historique au niveau ${r.level || "?"} : ${r.cls || "vide"}.`);
      break;
    }
  }
  const counts=Object.fromEntries(Object.keys(H0D_LEVEL_CLASSES).map(k=>[k,0]));
  for (const r of rows) if (H0D_LEVEL_CLASSES[r.cls]) counts[r.cls]++;
  return {entries,rows,levels,counts,currentLevel:levels.length,errors};
}

export function classCountsFromHistory(raw) {
  return analyzeHistory(raw).counts;
}

export function storedClassCounts(props={}) {
  const counts={};
  for (const [key,cfg] of Object.entries(H0D_LEVEL_CLASSES)) counts[key]=num(props[cfg.rankKey]);
  return counts;
}

export function classRankUpdatesFromHistory(raw) {
  const counts=classCountsFromHistory(raw);
  const updates={};
  for (const [key,cfg] of Object.entries(H0D_LEVEL_CLASSES)) updates[`system.props.${cfg.rankKey}`]=counts[key];
  return updates;
}

function countsEqual(a,b) {
  return Object.keys(H0D_LEVEL_CLASSES).every(k=>num(a[k])===num(b[k]));
}

function nextRowId(raw) {
  if (Array.isArray(raw)) return String(raw.length);
  const keys=Object.keys(raw || {});
  const numeric=keys.map(k=>Number(k)).filter(Number.isInteger);
  if (numeric.length===keys.length) return String(numeric.length ? Math.max(...numeric)+1 : 0);
  if (globalThis.foundry?.utils?.randomID) return foundry.utils.randomID(16);
  return `lvl-${Date.now()}`;
}

function buildHistoryWithRow(raw, row) {
  if (Array.isArray(raw)) {
    const next=clone(raw);
    next.push(row);
    return next;
  }
  const next=clone(raw || {});
  next[nextRowId(raw)]=row;
  return next;
}

export function buildLevelUpPreview(props={}, cls) {
  const cfg=H0D_LEVEL_CLASSES[cls];
  if (!cfg) return {ok:false,error:"Choisis une classe de héros valide."};

  const history=analyzeHistory(props[HISTORY_KEY]);
  if (history.errors.length) return {ok:false,error:history.errors.join(" ")};

  const stored=storedClassCounts(props);
  if (!countsEqual(stored,history.counts)) {
    return {
      ok:false,
      error:"Les rangs de classe et l’historique ne correspondent pas. Le MJ doit corriger/synchroniser la partie Technique avant de valider un nouveau niveau."
    };
  }

  const nextLevel=history.currentLevel+1;
  if (nextLevel>H0D_CAMPAIGN_MAX_LEVEL) {
    return {ok:false,error:`La campagne est limitée au niveau ${H0D_CAMPAIGN_MAX_LEVEL}.`};
  }
  if (history.counts[cls]>=H0D_BASE_CLASS_MAX_RANK) {
    return {ok:false,error:`${cfg.label} est déjà au rang ${H0D_BASE_CLASS_MAX_RANK}, maximum de la classe de base.`};
  }

  const intScore=num(props.H0D_INT);
  const conScore=num(props.H0D_CON);
  const intMod=Math.floor((intScore-10)/2);
  const conMod=Math.floor((conScore-10)/2);
  const multiplier=nextLevel===1 ? 4 : 1;
  const skillPoints=multiplier*Math.max(1,cfg.skillBase+intMod);
  const actionPoints=5+Math.floor(nextLevel/2);

  return {
    ok:true,cls,cfg,history,nextLevel,intMod,conMod,skillPoints,actionPoints,
    firstLevel:nextLevel===1
  };
}

async function confirmLevelUp(actor, preview) {
  const p=preview;
  const content=`
    <p><strong>${esc(actor.name)}</strong> va passer au <strong>niveau ${p.nextLevel}</strong>.</p>
    <table style="width:100%">
      <tr><td>Classe</td><td><strong>${esc(p.cfg.label)}</strong></td></tr>
      <tr><td>Dé de vie</td><td><strong>${esc(p.cfg.dieLabel)}</strong>${p.firstLevel ? " (maximum au niveau 1)" : ""}</td></tr>
      <tr><td>INT mémorisée</td><td><strong>${p.intMod>=0?"+":""}${p.intMod}</strong></td></tr>
      <tr><td>Points de compétence</td><td><strong>+${p.skillPoints}</strong></td></tr>
      <tr><td>Après validation</td><td>PV restaurés au maximum · dégâts non létaux 0 · PA restaurés à ${p.actionPoints}</td></tr>
    </table>
    <p class="notes">L’historique Technique sera complété automatiquement. Les blessures graves et notes narratives ne sont pas supprimées.</p>`;
  return foundry.applications.api.DialogV2.confirm({
    window:{title:`H0D — Passage au niveau ${p.nextLevel}`},
    content,
    yes:{label:"Valider et lancer le DV",icon:"fa-solid fa-dice-d20"},
    no:{label:"Annuler",icon:"fa-solid fa-xmark"}
  });
}

async function backupLevelState(actor) {
  const p=actor.system?.props || {};
  const keys=[
    HISTORY_KEY,
    ...Object.values(H0D_LEVEL_CLASSES).map(c=>c.rankKey),
    "H0D_PV_Actuels","H0D_Degats_Non_Letaux","H0D_Point_Action_Depense"
  ];
  const props={};
  for (const key of keys) props[key]=clone(p[key]);
  await actor.setFlag(MODULE_ID,"lastLevelUpBackup",{
    createdAt:new Date().toISOString(),
    actorUuid:actor.uuid,
    props
  });
}

export async function syncClassRanks(actor,{notify=false}={}) {
  if (!actor?.system?.props) return {ok:false,error:"Actor invalide."};
  const history=analyzeHistory(actor.system.props[HISTORY_KEY]);
  if (history.errors.length) {
    const error=history.errors.join(" ");
    if (notify) ui.notifications.error("H0D : "+error);
    return {ok:false,error};
  }
  const updates=classRankUpdatesFromHistory(actor.system.props[HISTORY_KEY]);
  const stored=storedClassCounts(actor.system.props);
  if (countsEqual(stored,history.counts)) {
    if (notify) ui.notifications.info("H0D : rangs de classe déjà synchronisés.");
    return {ok:true,changed:false,counts:history.counts};
  }
  await actor.update(updates,{h0dLevelHistorySync:true});
  if (notify) ui.notifications.info("H0D : rangs de classe resynchronisés depuis l’historique.");
  return {ok:true,changed:true,counts:history.counts};
}

export async function runLevelUp(actor, cls) {
  try {
    if (!actor?.system?.props) return "<strong>H0D — Actor introuvable.</strong>";
    if (!actor.isOwner && !game.user?.isGM) return "<strong>H0D — Tu n’as pas les droits pour modifier cette fiche.</strong>";

    const preview=buildLevelUpPreview(actor.system.props,cls);
    if (!preview.ok) {
      ui.notifications.error("H0D : "+preview.error);
      return `<div class="h0d-chat-card h0d-chat-progression h0d-chat-pj"><strong>Passage de niveau bloqué</strong><br>${esc(preview.error)}</div>`;
    }

    const confirmed=await confirmLevelUp(actor,preview);
    if (!confirmed) return "<em>Passage de niveau annulé.</em>";

    await backupLevelState(actor);

    let dieResult=preview.cfg.dieMax;
    if (!preview.firstLevel) {
      const roll=await (new foundry.dice.Roll(preview.cfg.die)).evaluate();
      dieResult=Number(roll.total);
      try {
        if (game.dice3d?.showForRoll) await game.dice3d.showForRoll(roll,game.user,true);
      } catch (_) {}
    }
    const hpGain=Math.max(1,dieResult+preview.conMod);

    const row={
      $deleted:false,
      H0D_Skill_Level_Niveau:String(preview.nextLevel),
      H0D_Skill_Level_Classe:cls,
      H0D_Skill_Level_INT_Mod:String(preview.intMod),
      H0D_Skill_Level_Notes:"",
      H0D_Skill_Level_Points:preview.skillPoints,
      H0D_PV_Level_Jet:String(dieResult),
      H0D_PV_Level_De:preview.cfg.dieLabel,
      H0D_PV_Level_Gain_Aff:hpGain,
      H0D_Skill_Level_Niveau_Auto:""
    };
    const newHistory=buildHistoryWithRow(actor.system.props[HISTORY_KEY],row);
    const newCounts=classCountsFromHistory(newHistory);

    const updates={
      [`system.props.${HISTORY_KEY}`]:newHistory,
      "system.props.H0D_Point_Action_Depense":preview.actionPoints,
      "system.props.H0D_Degats_Non_Letaux":0
    };
    for (const [key,cfg] of Object.entries(H0D_LEVEL_CLASSES)) {
      updates[`system.props.${cfg.rankKey}`]=newCounts[key];
    }

    await actor.update(updates,{h0dLevelUp:true,h0dLevelHistorySync:true});

    // CSB recalcule les champs dérivés pendant l'update. On utilise le nouveau
    // maximum préparé et on applique le soin complet du passage de niveau safe.
    const refreshed=actor.system?.props || {};
    let maxPV=num(refreshed.H0D_PV_Max_Calc || refreshed.H0D_PV_Max_Total);
    if (maxPV<=0) maxPV=Math.max(1,num(refreshed.H0D_PV_Actuels)+hpGain);
    await actor.update({
      "system.props.H0D_PV_Actuels":maxPV,
      "system.props.H0D_Degats_Non_Letaux":0,
      "system.props.H0D_Point_Action_Depense":preview.actionPoints
    },{h0dLevelUpHeal:true});

    ui.notifications.info(`H0D : ${actor.name} passe niveau ${preview.nextLevel} — ${preview.cfg.label}.`);

    return `<div class="h0d-chat-card h0d-chat-progression h0d-chat-pj">
      <div class="h0d-chat-headline">NIVEAU ${preview.nextLevel} — ${esc(preview.cfg.label)}</div>
      <table class="h0d-chat-summary">
        <tr><td><strong>DV</strong></td><td><strong>${esc(preview.cfg.dieLabel)} → ${dieResult}</strong></td></tr>
        <tr><td>CON</td><td>${preview.conMod>=0?"+":""}${preview.conMod} · gain PV <strong>+${hpGain}</strong></td></tr>
        <tr><td>INT mémorisée</td><td>${preview.intMod>=0?"+":""}${preview.intMod}</td></tr>
        <tr><td>Points de compétence</td><td><strong>+${preview.skillPoints}</strong></td></tr>
        <tr><td>Points d’action</td><td><strong>${preview.actionPoints}/${preview.actionPoints}</strong></td></tr>
        <tr><td>Repos sûr</td><td>PV restaurés à <strong>${maxPV}</strong> · dégâts non létaux 0</td></tr>
      </table>
      <div class="h0d-chat-sub">Historique Technique mis à jour automatiquement. Il reste à dépenser les points de compétence et à effectuer les choix de dons/talents disponibles.</div>
    </div>`;
  } catch(err) {
    console.error("H0D — passage de niveau",err);
    ui.notifications.error("H0D : passage de niveau interrompu — "+String(err?.message || err));
    return `<div class="h0d-chat-card h0d-chat-progression h0d-chat-pj"><strong>Passage de niveau interrompu</strong><br>${esc(err?.message || err)}</div>`;
  }
}

async function replaceHistoryExactly(actor, history, options={}) {
  // Une dynamicTable CSB est stockée comme objet indexé. Un actor.update() direct
  // fusionne récursivement cet objet et ne supprime donc pas les lignes ajoutées
  // après le snapshot. Il faut supprimer la propriété avant de la réinjecter.
  await actor.update(
    {[`system.props.-=${HISTORY_KEY}`]: null},
    {...options,h0dLevelHistorySync:true}
  );

  if (history !== undefined) {
    await actor.update(
      {[`system.props.${HISTORY_KEY}`]: clone(history)},
      {...options,h0dLevelHistorySync:true}
    );
  }
}

async function restoreLastLevelUp(actor) {
  if (!game.user?.isGM) {
    ui.notifications.warn("H0D : restauration réservée au MJ.");
    return false;
  }
  const backup=actor.getFlag(MODULE_ID,"lastLevelUpBackup");
  if (!backup?.props) {
    ui.notifications.warn("H0D : aucune sauvegarde de passage de niveau pour cette fiche.");
    return false;
  }
  const ok=await foundry.applications.api.DialogV2.confirm({
    window:{title:"H0D — Annuler le dernier passage de niveau"},
    content:`<p>Restaurer les données de progression sauvegardées pour <strong>${esc(actor.name)}</strong> ?</p><p class="notes">Cela restaure l’historique, les rangs de classe, les PV actuels, les dégâts non létaux et les points d’action capturés avant la dernière validation.</p>`,
    yes:{label:"Restaurer",icon:"fa-solid fa-rotate-left"},
    no:{label:"Annuler",icon:"fa-solid fa-xmark"}
  });
  if (!ok) return false;
  // Restaurer l'historique séparément : une écriture directe fusionnerait
  // la dynamicTable et laisserait survivre la dernière ligne ajoutée.
  await replaceHistoryExactly(
    actor,
    backup.props[HISTORY_KEY],
    {h0dLevelRestore:true}
  );

  const updates={};
  for (const [key,value] of Object.entries(backup.props)) {
    if (key===HISTORY_KEY) continue;
    updates[`system.props.${key}`]=clone(value);
  }
  await actor.update(updates,{h0dLevelRestore:true,h0dLevelHistorySync:true});

  // Vérification forte : le rollback doit retrouver exactement le nombre
  // et le contenu des lignes sauvegardées.
  const restored=actor.system?.props?.[HISTORY_KEY];
  if (!jsonEqualForRestore(restored,backup.props[HISTORY_KEY])) {
    throw new Error("L’historique n’a pas été restauré exactement. Aucune suppression manuelle ne doit être nécessaire.");
  }

  await actor.unsetFlag(MODULE_ID,"lastLevelUpBackup");
  ui.notifications.info("H0D : dernier passage de niveau restauré, historique inclus.");
  return true;
}

function registerHistorySyncHook() {
  Hooks.on("updateActor",async (actor,changes,options,userId)=>{
    if (options?.h0dLevelHistorySync || options?.h0dLevelRestore) return;
    if (userId!==game.user?.id) return;
    const changedHistory=foundry.utils.hasProperty(changes,`system.props.${HISTORY_KEY}`)
      || Object.prototype.hasOwnProperty.call(changes?.system?.props || {},HISTORY_KEY);
    if (!changedHistory) return;
    try {
      await syncClassRanks(actor,{notify:false});
    } catch(err) {
      console.error("H0D — synchronisation historique/classes",err);
    }
  });
}

if (globalThis.Hooks) {
  Hooks.once("ready",()=>{
    globalThis.H0DLevelUp={
      run:runLevelUp,
      sync:syncClassRanks,
      restore:restoreLastLevelUp,
      preview:buildLevelUpPreview,
      classes:H0D_LEVEL_CLASSES
    };
    registerHistorySyncHook();
    console.info("H0D — passage de niveau automatisé prêt.");
  });
}
