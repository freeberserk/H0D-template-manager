export const COMMON_ATTRIBUTE_KEYS = Object.freeze([
  "H0D_Health",
  "H0D_Defense",
  "H0D_Perception",
  "H0D_Detection"
]);

const LEGACY_FALLBACKS = Object.freeze({
  H0D_Defense: [
    "H0D_Defense_Totale_Calc",
    "H0D_Defense_Totale",
    "H0D_Creature_DEF_Total_Calc",
    "H0D_Creature_DEF_Total",
    "H0D_Machine_DEF_Total_Calc",
    "H0D_Machine_DEF_Total_Aff"
  ],
  H0D_Perception: [
    "H0D_Skill_Perception_Total",
    "H0D_Creature_Perception",
    "H0D_Machine_Perception_Effective_Calc",
    "H0D_Machine_Perception_Effective_Aff"
  ],
  H0D_Detection: [
    "H0D_Creature_Detection_Calc",
    "H0D_Machine_Detection_Calc"
  ]
});

function finiteNumber(value) {
  const n=Number(value);
  return Number.isFinite(n) ? n : null;
}

function propValue(actor,key) {
  const p=actor?.system?.props || {};
  return Object.prototype.hasOwnProperty.call(p,key) ? p[key] : undefined;
}

function propNumber(actor,key,zero=false) {
  const value=finiteNumber(propValue(actor,key));
  return value===null && zero ? 0 : value;
}

function legacyDefense(actor) {
  const p=actor?.system?.props || {};

  if (Object.prototype.hasOwnProperty.call(p,"H0D_Creature_DEF_Base")) {
    const base=propNumber(actor,"H0D_Creature_DEF_Base");
    if (base!==null) return Math.max(0,
      base
      + propNumber(actor,"H0D_Creature_DEF_Divers",true)
      + propNumber(actor,"H0D_Creature_Armure_DEF_Total_Calc",true)
      + propNumber(actor,"H0D_Creature_EQ_DEF_Total",true)
      + propNumber(actor,"H0D_Creature_Mod_DEF_Total",true)
    );
  }

  if (Object.prototype.hasOwnProperty.call(p,"H0D_Machine_DEF_Corps_Base")) {
    const base=propNumber(actor,"H0D_Machine_DEF_Corps_Base");
    if (base!==null) return Math.max(0,
      base
      + propNumber(actor,"H0D_Machine_DEF_Bonus_Pieces_Calc",true)
      + propNumber(actor,"H0D_Machine_Mod_DEF_Temp",true)
    );
  }

  if (Object.prototype.hasOwnProperty.call(p,"H0D_DEX_MOD")) {
    const dex=propNumber(actor,"H0D_DEX_MOD",true);
    return 10
      + dex
      + propNumber(actor,"H0D_Defense",true)
      + propNumber(actor,"H0D_Armure_Bonus_Total_Calc",true)
      + propNumber(actor,"H0D_Taille_Mod_Calc",true)
      + propNumber(actor,"H0D_Defense_Divers",true)
      + propNumber(actor,"H0D_DT_Bonus_DEF_Perm_Total",true)
      + propNumber(actor,"H0D_DT_Bonus_DEF_Esquive_Total",true)
      + propNumber(actor,"H0D_EQ_Trait_DEF_Total",true);
  }

  return null;
}

function legacyPerception(actor) {
  const p=actor?.system?.props || {};

  if (Object.prototype.hasOwnProperty.call(p,"H0D_Creature_Perception")) {
    return propNumber(actor,"H0D_Creature_Perception");
  }

  if (Object.prototype.hasOwnProperty.call(p,"H0D_Machine_Perception_Base")) {
    const base=propNumber(actor,"H0D_Machine_Perception_Base");
    if (base!==null) return base
      + propNumber(actor,"H0D_Machine_Perception_Bonus_Pieces_Calc",true)
      + propNumber(actor,"H0D_Machine_Mod_Perception_Temp",true)
      + (p.H0D_Machine_Etat_Aveuglee===true || p.H0D_Machine_Etat_Aveuglee==="true" ? -4 : 0);
  }

  if (Object.prototype.hasOwnProperty.call(p,"H0D_Skill_Perception_Rangs")) {
    return propNumber(actor,"H0D_SAG_MOD",true)
      + propNumber(actor,"H0D_Skill_Perception_Rangs",true)
      + propNumber(actor,"H0D_Skill_Perception_Divers",true)
      + propNumber(actor,"H0D_DT_Bonus_Skill_Perception_Total",true)
      + propNumber(actor,"H0D_Skill_Perception_Bonus_Origine",true);
  }

  return null;
}

export function commonAttributeEntry(actor,key) {
  return actor?.system?.attributeBar?.[key] ?? null;
}

export function commonStat(actor,key,{legacy=true}={}) {
  const entry=commonAttributeEntry(actor,key);
  const direct=finiteNumber(entry?.value);
  if (direct!==null) return direct;

  if (key==="H0D_Health") {
    for (const legacyKey of ["H0D_PV_Actuels","H0D_Creature_PV_Actuels","H0D_Machine_PV_Actuels"]) {
      const value=finiteNumber(propValue(actor,legacyKey));
      if (value!==null) return value;
    }
    return null;
  }

  if (!legacy) return null;

  for (const legacyKey of LEGACY_FALLBACKS[key] || []) {
    const value=finiteNumber(propValue(actor,legacyKey));
    if (value!==null) return value;
  }

  if (key==="H0D_Defense") return legacyDefense(actor);

  if (key==="H0D_Perception") return legacyPerception(actor);

  if (key==="H0D_Detection") {
    const perception=commonStat(actor,"H0D_Perception",{legacy:true});
    return perception!==null ? 10+perception : null;
  }

  return null;
}

export function commonHealth(actor,{legacy=true}={}) {
  const entry=commonAttributeEntry(actor,"H0D_Health");
  let value=finiteNumber(entry?.value);
  let max=finiteNumber(entry?.max);

  if (legacy && value===null) {
    for (const key of ["H0D_PV_Actuels","H0D_Creature_PV_Actuels","H0D_Machine_PV_Actuels"]) {
      value=finiteNumber(propValue(actor,key));
      if (value!==null) break;
    }
  }

  if (legacy && max===null) {
    for (const key of ["H0D_PV_Max_Calc","H0D_Creature_PV_Max_Calc","H0D_Machine_PV_Max_Calc"]) {
      max=finiteNumber(propValue(actor,key));
      if (max!==null) break;
    }
  }

  return {value,max};
}

export function commonStats(actor,{legacy=true}={}) {
  const health=commonHealth(actor,{legacy});
  return {
    H0D_Health:health,
    H0D_Defense:commonStat(actor,"H0D_Defense",{legacy}),
    H0D_Perception:commonStat(actor,"H0D_Perception",{legacy}),
    H0D_Detection:commonStat(actor,"H0D_Detection",{legacy})
  };
}
