const MODULE_ID = "h0d-template-manager";
const SETTING = "ammoRecoveryState";

const RECOVERABLE_AMMO_TYPES = new Set(["Fleche","Carreau","Projectile"]);

const RECOVERY_RATES = Object.freeze({
  Faune:      {standard:75, reinforced:90},
  Faction:    {standard:60, reinforced:80},
  Machines:   {standard:25, reinforced:60}
});

function clone(v) {
  return foundry.utils.deepClone(v);
}

function num(v) {
  const n=Number(v);
  return Number.isFinite(n) ? n : 0;
}

function esc(v) {
  return String(v ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function isResponsibleGM() {
  if (!game.user?.isGM) return false;
  const activeGM=game.users?.activeGM;
  return !activeGM || activeGM.id===game.user.id;
}

function readState() {
  try {
    const raw=game.settings.get(MODULE_ID,SETTING) || "{}";
    const parsed=JSON.parse(raw);
    return parsed && typeof parsed==="object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeState(state) {
  await game.settings.set(MODULE_ID,SETTING,JSON.stringify(state || {}));
}

function isPlayerOwnedActor(actor) {
  if (!actor) return false;
  const OWNER=CONST.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3;
  return (game.users ?? []).some(user=>
    !user.isGM &&
    actor.testUserPermission?.(user,OWNER)
  );
}

function itemProps(item) {
  return item?.system?.props ?? {};
}

function recoverableWeaponEntry(actor,item) {
  const p=itemProps(item);
  if (String(p.H0D_Arme_Mode_Munition || "")!=="Chargeur") return null;

  const ammoType=String(p.H0D_Arme_Type_Munition || "");
  if (!RECOVERABLE_AMMO_TYPES.has(ammoType)) return null;

  const current=Math.max(0,Math.floor(num(p.H0D_Arme_Munitions)));
  return {
    actorUuid:actor.uuid,
    actorId:actor.id,
    actorName:actor.name,
    itemUuid:item.uuid,
    itemId:item.id,
    itemName:item.name,
    ammoType,
    start:current
  };
}

async function captureCombatAmmo(combat) {
  if (!isResponsibleGM() || !combat?.id) return;

  const state=readState();
  if (state[combat.id]?.startedAt) return;

  const entries=[];
  const seenActors=new Set();

  for (const combatant of combat.combatants ?? []) {
    const actor=combatant.actor;
    if (!actor || seenActors.has(actor.id) || !isPlayerOwnedActor(actor)) continue;
    seenActors.add(actor.id);

    for (const item of actor.items ?? []) {
      const entry=recoverableWeaponEntry(actor,item);
      if (entry) entries.push(entry);
    }
  }

  state[combat.id]={
    combatId:combat.id,
    combatName:combat.name || combat.scene?.name || "Combat",
    startedAt:new Date().toISOString(),
    endedAt:null,
    resolvedAt:null,
    entries
  };
  await writeState(state);
}

async function spentEntriesForRecord(record) {
  const rows=[];
  for (const entry of record?.entries ?? []) {
    const item=await fromUuid(entry.itemUuid);
    if (!item) continue;
    const current=Math.max(0,Math.floor(num(itemProps(item).H0D_Arme_Munitions)));
    const spent=Math.max(0,Number(entry.start || 0)-current);
    if (!spent) continue;
    rows.push({...entry,current,spent});
  }
  return rows;
}

function contextButtons() {
  return [
    ["Faune","🦌","Faune"],
    ["Faction","⚔️","Faction"],
    ["Machines","🤖","Machines"]
  ].map(([value,icon,label],index)=>`
    <label style="display:flex;align-items:center;gap:6px;border:1px solid #777;border-radius:6px;padding:8px 10px;cursor:pointer;">
      <input type="radio" name="context" value="${value}" ${index===0?"checked":""}>
      <span style="font-size:1.2em">${icon}</span>
      <strong>${label}</strong>
    </label>
  `).join("");
}

function recoveryDialogContent(record,rows) {
  const weaponRows=rows.map((row,index)=>`
    <tr>
      <td>${esc(row.actorName)}</td>
      <td>${esc(row.itemName)}</td>
      <td style="text-align:center">${esc(row.ammoType)}</td>
      <td style="text-align:center"><strong>${row.spent}</strong></td>
      <td style="text-align:center">
        <input type="number"
          name="reinforced_${index}"
          value="0"
          min="0"
          max="${row.spent}"
          step="1"
          style="width:70px;text-align:center;">
      </td>
    </tr>
  `).join("");

  return `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <p><strong>${esc(record.combatName || "Combat terminé")}</strong> — choisis le type principal d'opposition.</p>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        ${contextButtons()}
      </div>

      <table style="width:100%">
        <thead>
          <tr>
            <th>PJ</th>
            <th>Arme</th>
            <th>Munition</th>
            <th>Dépensées</th>
            <th>Dont renforcées</th>
          </tr>
        </thead>
        <tbody>${weaponRows}</tbody>
      </table>

      <p style="opacity:.8;margin:0">
        Le reste est considéré comme munition standard. Les taux sont :
        Faune 75% / 90%, Faction 60% / 80%, Machines 25% / 60%
        (standard / renforcée).
      </p>
    </div>
  `;
}

async function rollRecovery(count,chance) {
  if (count<=0) return {count:0,chance,recovered:0,results:[]};
  const roll=await new Roll(`${count}d100`).evaluate();
  const results=(roll.dice?.[0]?.results ?? []).map(r=>Number(r.result));
  const recovered=results.filter(value=>value<=chance).length;
  return {count,chance,recovered,results};
}

async function applyRecovery(record,rows,formData) {
  const context=String(formData.context || "");
  const rates=RECOVERY_RATES[context];
  if (!rates) throw new Error("Choisis Faune, Faction ou Machines.");

  const outcomes=[];

  for (let index=0; index<rows.length; index++) {
    const row=rows[index];
    const reinforcedRaw=Math.floor(num(formData[`reinforced_${index}`]));
    const reinforced=Math.max(0,Math.min(row.spent,reinforcedRaw));
    const standard=row.spent-reinforced;

    const standardRoll=await rollRecovery(standard,rates.standard);
    const reinforcedRoll=await rollRecovery(reinforced,rates.reinforced);
    const recovered=standardRoll.recovered+reinforcedRoll.recovered;

    const item=await fromUuid(row.itemUuid);
    if (item && recovered>0) {
      const current=Math.max(0,Math.floor(num(itemProps(item).H0D_Arme_Munitions)));
      const cap=Math.max(current,Number(row.start || 0));
      await item.update({
        "system.props.H0D_Arme_Munitions":Math.min(cap,current+recovered)
      });
    }

    outcomes.push({
      ...row,
      context,
      standard,
      reinforced,
      standardChance:rates.standard,
      reinforcedChance:rates.reinforced,
      standardRecovered:standardRoll.recovered,
      reinforcedRecovered:reinforcedRoll.recovered,
      recovered
    });
  }

  return outcomes;
}

async function postRecoverySummary(record,outcomes) {
  const totalSpent=outcomes.reduce((sum,x)=>sum+x.spent,0);
  const totalRecovered=outcomes.reduce((sum,x)=>sum+x.recovered,0);
  const context=outcomes[0]?.context || "—";

  const lines=outcomes.map(x=>`
    <tr>
      <td>${esc(x.actorName)}</td>
      <td>${esc(x.itemName)}</td>
      <td style="text-align:center">${x.spent}</td>
      <td style="text-align:center">${x.recovered}</td>
      <td style="text-align:center">${x.spent-x.recovered}</td>
    </tr>
  `).join("");

  await ChatMessage.create({
    content:`
      <div>
        <h3 style="margin:0 0 6px">H0D — Récupération des munitions</h3>
        <p><strong>${esc(record.combatName || "Combat")}</strong> · contexte : <strong>${esc(context)}</strong></p>
        <table style="width:100%">
          <thead><tr><th>PJ</th><th>Arme</th><th>Dépensées</th><th>Récupérées</th><th>Perdues</th></tr></thead>
          <tbody>${lines}</tbody>
        </table>
        <p><strong>Total :</strong> ${totalRecovered}/${totalSpent} munition(s) récupérée(s).</p>
      </div>
    `
  });
}

async function resolveAmmoRecovery(combatId,{automatic=false}={}) {
  if (!isResponsibleGM()) return false;

  const state=readState();
  const record=state[combatId];
  if (!record || record.resolvedAt) return false;

  const rows=await spentEntriesForRecord(record);
  if (!rows.length) {
    delete state[combatId];
    await writeState(state);
    return false;
  }

  const fd=await foundry.applications.api.DialogV2.input({
    window:{title:"H0D — Récupérer les munitions"},
    content:recoveryDialogContent(record,rows),
    ok:{label:"Rendre les munitions",icon:"fa-solid fa-arrows-rotate"},
    rejectClose:false
  });

  if (!fd) {
    if (automatic) {
      ui.notifications.warn("H0D : récupération de munitions laissée en attente.");
    }
    return false;
  }

  const outcomes=await applyRecovery(record,rows,fd);
  record.endedAt ||= new Date().toISOString();
  record.resolvedAt=new Date().toISOString();
  record.context=String(fd.context || "");
  record.outcomes=outcomes.map(x=>({
    actorName:x.actorName,itemName:x.itemName,ammoType:x.ammoType,
    spent:x.spent,standard:x.standard,reinforced:x.reinforced,recovered:x.recovered
  }));
  state[combatId]=record;
  await writeState(state);

  await postRecoverySummary(record,outcomes);
  ui.notifications.info("H0D : récupération des munitions résolue.");
  return true;
}

async function finishCombatAmmo(combat) {
  if (!isResponsibleGM() || !combat?.id) return;
  const state=readState();
  const record=state[combat.id];
  if (!record || record.resolvedAt) return;

  record.endedAt ||= new Date().toISOString();
  state[combat.id]=record;
  await writeState(state);

  await resolveAmmoRecovery(combat.id,{automatic:true});
}

async function latestPendingCombatId() {
  const state=readState();
  const rows=Object.values(state)
    .filter(x=>x && !x.resolvedAt)
    .sort((a,b)=>String(b.endedAt || b.startedAt || "").localeCompare(String(a.endedAt || a.startedAt || "")));
  return rows[0]?.combatId || null;
}

export function registerAmmoRecoverySettings() {
  game.settings.register(MODULE_ID,SETTING,{
    scope:"world",
    config:false,
    type:String,
    default:"{}"
  });
}

export function registerAmmoRecoveryHooks() {
  Hooks.on("combatStart",combat=>{
    captureCombatAmmo(combat).catch(err=>console.error(MODULE_ID+" | ammo combatStart",err));
  });

  Hooks.on("updateCombat",(combat,changes)=>{
    if (!combat?.started) return;
    captureCombatAmmo(combat).catch(err=>console.error(MODULE_ID+" | ammo updateCombat",err));
  });

  Hooks.on("combatEnd",combat=>{
    finishCombatAmmo(combat).catch(err=>{
      console.error(MODULE_ID+" | ammo combatEnd",err);
      ui.notifications?.warn?.("H0D : impossible d'ouvrir la récupération des munitions.");
    });
  });

  Hooks.on("deleteCombat",combat=>{
    finishCombatAmmo(combat).catch(err=>console.error(MODULE_ID+" | ammo deleteCombat",err));
  });
}

export async function openPendingAmmoRecovery() {
  const combatId=await latestPendingCombatId();
  if (!combatId) {
    ui.notifications.info("H0D : aucune récupération de munitions en attente.");
    return false;
  }
  return resolveAmmoRecovery(combatId,{automatic:false});
}

export function ammoRecoveryRates() {
  return clone(RECOVERY_RATES);
}
