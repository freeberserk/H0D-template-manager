/* H0D — Attaques : moteur autonome distribué par H0D Template Manager.
 * La macro historique « H0D — Attaques ennemi » n'est jamais modifiée.
 * Version initiale dérivée de l'export utilisateur v1.1.
 * Note : comme v1.1, ce lanceur n'applique pas automatiquement les dégâts
 * ni ne consomme les munitions. Pour ces fonctions, utiliser la fiche CSB.
 */
export async function openH0DAttacks() {
/*
 * H0D — ATTAQUES v1.2 (Template Manager)
 * Foundry VTT v14 / Custom System Builder
 *
 * Sélectionner UN token (PJ, PNJ, créature ou machine).
 * Optionnel : cibler UN token adverse.
 *
 * Compatible :
 * - H0D Machine
 * - H0D Créature / PNJ / Faction
 * - H0D Personnage joueur (PJ)
 */

const DialogV2 = foundry.applications.api.DialogV2;

/* --------------------------------------------------------- */
/* UTILITAIRES                                               */
/* --------------------------------------------------------- */

const num = v => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const bool = v =>
  v === true || v === "true" || v === 1 || v === "1";

const esc = v => String(v ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const sign = n => `${n >= 0 ? "+" : ""}${n}`;

function actorProps(actor) {
  return actor?.system?.props ?? {};
}

function itemProps(item) {
  return item?.system?.props ?? {};
}

function improvementTotal(props, prefix, type) {
  let total = 0;
  for (let i = 1; i <= 3; i++) {
    if (!bool(props[`${prefix}_Amelioration_${i}_Installee`])) continue;
    if (String(props[`${prefix}_Amelioration_${i}_Type`] || "Aucun") !== type) continue;
    total += num(props[`${prefix}_Amelioration_${i}_Valeur`]);
  }
  return total;
}

/* --------------------------------------------------------- */
/* ATTAQUANT                                                 */
/* --------------------------------------------------------- */

const controlled = canvas.tokens.controlled;

if (controlled.length !== 1) {
  return ui.notifications.warn(
    "H0D : sélectionnez exactement un token."
  );
}

const token = controlled[0];
const actor = token.actor;

if (!actor) {
  return ui.notifications.error(
    "H0D : aucun acteur associé au token."
  );
}

const ap = actorProps(actor);

/* --------------------------------------------------------- */
/* TYPE D'ACTEUR                                             */
/* --------------------------------------------------------- */

const isMachine =
  Object.prototype.hasOwnProperty.call(ap, "H0D_Machine_Attaque_Base") ||
  Object.prototype.hasOwnProperty.call(ap, "H0D_Machine_PV_Actuels") ||
  Object.prototype.hasOwnProperty.call(ap, "H0D_Machine_DEF_Corps_Base");

const isCreature =
  Object.prototype.hasOwnProperty.call(ap, "H0D_Creature_Attaque_Base") ||
  Object.prototype.hasOwnProperty.call(ap, "H0D_Creature_PV_Actuels") ||
  Object.prototype.hasOwnProperty.call(ap, "H0D_Creature_DEF_Base");

const isPJ =
  !isMachine && !isCreature &&
  (Object.prototype.hasOwnProperty.call(ap, "H0D_BBA") ||
   Object.prototype.hasOwnProperty.call(ap, "H0D_FOR") ||
   Object.prototype.hasOwnProperty.call(ap, "H0D_Defense_Totale_Calc"));

if (!isMachine && !isCreature && !isPJ) {
  return ui.notifications.warn(
    "H0D : fiche non reconnue (PJ, Créature/PNJ/Faction ou Machine attendue)."
  );
}

/* --------------------------------------------------------- */
/* CIBLE                                                     */
/* --------------------------------------------------------- */

function getTarget() {
  const targets = Array.from(game.user.targets ?? []);

  if (targets.length === 1) {
    return targets[0];
  }

  return null;
}

function resolveDefense(targetActor) {
  if (!targetActor) return null;

  const p = actorProps(targetActor);

  const keys = [
    "H0D_Defense_Totale_Calc",
    "H0D_Defense_Totale",
    "H0D_Creature_DEF_Total_Calc",
    "H0D_Creature_DEF_Total",
    "H0D_Machine_DEF_Total_Calc",
    "H0D_Machine_DEF_Total"
  ];

  for (const key of keys) {
    if (
      Object.prototype.hasOwnProperty.call(p, key) &&
      p[key] !== "" &&
      Number.isFinite(Number(p[key]))
    ) {
      return Number(p[key]);
    }
  }

  return null;
}

/* --------------------------------------------------------- */
/* COOLDOWN ARME STANDARD                                    */
/* --------------------------------------------------------- */

function standardCooldown(item) {
  const p = itemProps(item);

  const duration = Math.max(
    0,
    num(p.H0D_Arme_Trait_Cooldown_Total)
  );

  if (!duration) {
    return {
      duration: 0,
      active: false,
      elapsed: 0,
      remaining: 0,
      mode: "Auto",
      text: "Prête"
    };
  }

  const state =
    item.getFlag(
      "custom-system-builder",
      "h0dCooldown"
    ) || {};

  const mode = String(state.mode || "Auto");
  let active = state.active === true;
  let elapsed = Math.max(
    0,
    num(state.elapsed)
  );

  const combat = game.combat;
  const round = num(combat?.round);

  if (active && mode === "Auto") {
    const sameCombat =
      combat &&
      round > 0 &&
      String(state.combatId || "") ===
        String(combat.id || "") &&
      num(state.startRound) > 0;

    if (sameCombat) {
      elapsed = Math.max(
        0,
        round - num(state.startRound)
      );

      if (elapsed >= duration) {
        active = false;
        elapsed = duration;
      }
    } else {
      active = false;
      elapsed = duration;
    }
  }

  const remaining = active
    ? Math.max(0, duration - elapsed)
    : 0;

  return {
    duration,
    active,
    elapsed,
    remaining,
    mode,
    text: active
      ? `Recharge ${elapsed}/${duration}`
      : "Prête"
  };
}

/* --------------------------------------------------------- */
/* COOLDOWN ARME MACHINE                                     */
/* --------------------------------------------------------- */

function machineCooldown(item) {
  const p = itemProps(item);

  const duration = Math.max(
    0,
    num(p.H0D_ArmeMachine_Recharge)
  );

  if (!duration) {
    return {
      duration: 0,
      active: false,
      elapsed: 0,
      remaining: 0,
      mode: "Auto",
      text: "Prête"
    };
  }

  const mode = String(
    p.H0D_ArmeMachine_Cooldown_Mode || "Auto"
  );

  let active = bool(
    p.H0D_ArmeMachine_Cooldown_Actif
  );

  let elapsed = Math.max(
    0,
    num(p.H0D_ArmeMachine_Recharge_Compteur)
  );

  const combat = game.combat;
  const round = num(combat?.round);

  if (active && mode === "Auto") {
    const sameCombat =
      combat &&
      round > 0 &&
      String(
        p.H0D_ArmeMachine_Cooldown_CombatId || ""
      ) === String(combat.id || "") &&
      num(
        p.H0D_ArmeMachine_Cooldown_DebutRound
      ) > 0;

    if (sameCombat) {
      elapsed = Math.max(
        0,
        round -
        num(
          p.H0D_ArmeMachine_Cooldown_DebutRound
        )
      );

      if (elapsed >= duration) {
        active = false;
        elapsed = duration;
      }
    } else {
      active = false;
      elapsed = duration;
    }
  }

  return {
    duration,
    active,
    elapsed,
    remaining: active
      ? Math.max(0, duration - elapsed)
      : 0,
    mode,
    text: active
      ? `Recharge ${elapsed}/${duration}`
      : "Prête"
  };
}

/* --------------------------------------------------------- */
/* LISTE DES ARMES                                           */
/* --------------------------------------------------------- */

function getWeapons() {
  return actor.items.filter(item => {
    const p = itemProps(item);

    if (isMachine) {
      return Object.prototype.hasOwnProperty.call(
        p,
        "H0D_ArmeMachine_Mode"
      );
    }

    return Object.prototype.hasOwnProperty.call(
      p,
      "H0D_Arme_Categorie"
    );
  });
}

const weapons = getWeapons();

if (!weapons.length) {
  return ui.notifications.warn(
    `H0D : aucune attaque trouvée sur ${actor.name}.`
  );
}


/* --------------------------------------------------------- */
/* ATTAQUES PJ : formules du template PJ v3.67                */
/* --------------------------------------------------------- */
function pjMod(stat) {
  const key = "H0D_" + stat + "_MOD";
  if (ap[key] !== undefined && ap[key] !== "") return num(ap[key]);
  return Math.floor((num(ap["H0D_" + stat]) - 10) / 2);
}
function pjCategoryAbility(item) {
  const p=itemProps(item);
  const category=String(p.H0D_Arme_Categorie || "");
  const stat = category === "melee" ? "FOR" :
    category === "distance" ? "DEX" : String(p.H0D_Arme_Carac_Attaque || "");
  return stat === "FOR" || stat === "DEX" ? pjMod(stat) : 0;
}
function pjAttackBonus(item) {
  const p=itemProps(item);
  const cat=String(p.H0D_Arme_Categorie || "");
  const melee = cat === "melee";
  const ranged = cat === "distance" || cat === "jet";
  const heavyPenalty =
    num(p.H0D_Arme_Trait_Lourd_FOR_Min_Calc) > num(ap.H0D_FOR) ? -2 : 0;
  return num(ap.H0D_BBA) + pjCategoryAbility(item) +
    num(ap.H0D_Taille_Mod_Calc) + num(p.H0D_Arme_Bonus_Attaque) +
    improvementTotal(p, "H0D_Arme", "Attaque") +
    num(ap.H0D_Encombrement_Malus_Calc) +
    num(ap.H0D_DT_Bonus_Attaque_Global_Total) +
    (melee ? num(ap.H0D_DT_Bonus_Attaque_Melee_Total) :
     ranged ? num(ap.H0D_DT_Bonus_Attaque_Distance_Total) : 0) +
    num(p.H0D_Arme_Trait_Attaque_Total) +
    num(ap.H0D_EQ_Trait_Attaque_Global_Total) + heavyPenalty;
}
function pjDamageFlat(item) {
  const p=itemProps(item);
  const cat=String(p.H0D_Arme_Categorie || "");
  const stat=String(p.H0D_Arme_Carac_Degats || "");
  return (stat === "FOR" || stat === "DEX" ? pjMod(stat) : 0) +
    num(p.H0D_Arme_Bonus_Degats) +
    improvementTotal(p, "H0D_Arme", "Degats") +
    num(ap.H0D_EQ_Trait_Degats_Global_Total) +
    num(ap.H0D_DT_Bonus_Degats_Global_Total) +
    (cat === "melee" ? num(ap.H0D_DT_Bonus_Degats_Melee_Total) :
     (cat === "distance" || cat === "jet") ?
       num(ap.H0D_DT_Bonus_Degats_Distance_Total) : 0);
}
function pjUsable(item) {
  const p=itemProps(item);
  if (Object.prototype.hasOwnProperty.call(p,"H0D_Arme_Equipee") &&
      !bool(p.H0D_Arme_Equipee)) {
    return {usable:false,reason:"Non équipée"};
  }
  return creatureUsable(item);
}

/* --------------------------------------------------------- */
/* BONUS ATTAQUE CRÉATURE                                    */
/* --------------------------------------------------------- */

function creatureAttackBonus(item) {
  const p = itemProps(item);

  const category = String(
    p.H0D_Arme_Categorie || ""
  );

  let ability = 0;

  if (category === "melee") {
    ability = num(
      ap.H0D_Creature_FOR_MOD
    );
  } else if (category === "distance") {
    ability = num(
      ap.H0D_Creature_DEX_MOD
    );
  } else {
    const carac = String(
      p.H0D_Arme_Carac_Attaque || ""
    );

    if (carac === "FOR") {
      ability = num(
        ap.H0D_Creature_FOR_MOD
      );
    }

    if (carac === "DEX") {
      ability = num(
        ap.H0D_Creature_DEX_MOD
      );
    }
  }

  return (
    num(ap.H0D_Creature_Attaque_Base) +
    num(ap.H0D_Creature_Attaque_Divers) +
    num(ap.H0D_Creature_Mod_Attaque_Total) +
    num(ap.H0D_Creature_EQ_Attaque_Total) +
    ability +
    num(p.H0D_Arme_Bonus_Attaque) +
    improvementTotal(p, "H0D_Arme", "Attaque") +
    num(p.H0D_Arme_Trait_Attaque_Total)
  );
}

/* --------------------------------------------------------- */
/* BONUS DÉGÂTS CRÉATURE                                     */
/* --------------------------------------------------------- */

function creatureDamageFlat(item) {
  const p = itemProps(item);

  let ability = 0;

  const carac = String(
    p.H0D_Arme_Carac_Degats || ""
  );

  if (carac === "FOR") {
    ability = num(
      ap.H0D_Creature_FOR_MOD
    );
  }

  if (carac === "DEX") {
    ability = num(
      ap.H0D_Creature_DEX_MOD
    );
  }

  return (
    num(ap.H0D_Creature_Degats_Divers) +
    num(ap.H0D_Creature_Mod_Degats_Total) +
    num(ap.H0D_Creature_EQ_Degats_Total) +
    ability +
    num(p.H0D_Arme_Bonus_Degats) +
    improvementTotal(p, "H0D_Arme", "Degats")
  );
}

/* --------------------------------------------------------- */
/* DISPONIBILITÉ MACHINE                                     */
/* --------------------------------------------------------- */

function machineUsable(item) {
  const p = itemProps(item);

  const state = String(
    p.H0D_ArmeMachine_Etat || "Intacte"
  );

  const pv = num(
    p.H0D_ArmeMachine_PV_Actuels
  );

  if (state === "Detruite") {
    return {
      usable: false,
      reason: "Détruite"
    };
  }

  if (state === "Detachee") {
    return {
      usable: false,
      reason: "Détachée"
    };
  }

  if (pv <= 0) {
    return {
      usable: false,
      reason: "0 PV"
    };
  }

  const cd = machineCooldown(item);

  if (cd.active) {
    return {
      usable: false,
      reason: cd.text
    };
  }

  return {
    usable: true,
    reason: "Prête"
  };
}

/* --------------------------------------------------------- */
/* DISPONIBILITÉ CRÉATURE                                    */
/* --------------------------------------------------------- */

function creatureUsable(item) {
  const p = itemProps(item);

  if (
    Object.prototype.hasOwnProperty.call(
      p,
      "H0D_Arme_Active"
    ) &&
    !bool(p.H0D_Arme_Active)
  ) {
    return {
      usable: false,
      reason: "Inactive"
    };
  }

  const cd = standardCooldown(item);

  if (cd.active) {
    return {
      usable: false,
      reason: cd.text
    };
  }

  return {
    usable: true,
    reason: "Prête"
  };
}

/* --------------------------------------------------------- */
/* INFOS ATTAQUE                                             */
/* --------------------------------------------------------- */

function getAttackInfo(item) {
  const p = itemProps(item);

  if (isMachine) {
    const mode = String(
      p.H0D_ArmeMachine_Mode || "—"
    );

    const blinded =
      bool(
        ap.H0D_Machine_Etat_Aveuglee
      ) &&
      ["Distance", "Zone"].includes(mode);

    const attack =
      num(
        ap.H0D_Machine_Attaque_Effective_Calc
      ) +
      num(
        p.H0D_ArmeMachine_Bonus_Attaque
      ) +
      (blinded ? -4 : 0);

    return {
      item,
      machine: true,
      name: item.name,
      category: mode,
      type: String(
        p.H0D_ArmeMachine_Type || "—"
      ),
      attack,
      damage: String(
        p.H0D_ArmeMachine_Degats || "0"
      ),
      damageFlat: 0,
      damageType: String(
        p.H0D_ArmeMachine_Type_Degats || "—"
      ),
      element: String(
        p.H0D_ArmeMachine_Element || "Aucun"
      ),
      range: String(
        p.H0D_ArmeMachine_Portee || "—"
      ),
      zone: String(
        p.H0D_ArmeMachine_Zone || ""
      ),
      special: String(
        p.H0D_ArmeMachine_Effet_Special || ""
      ),
      notes: String(
        p.H0D_ArmeMachine_Notes || ""
      ),
      usable: machineUsable(item),
      cooldown: machineCooldown(item)
    };
  }


  if (isPJ) {
    return {
      item, machine:false, name:item.name,
      category:String(p.H0D_Arme_Categorie || "—"),
      type:"", attack:pjAttackBonus(item),
      damage:String(p.H0D_Arme_Degats || "0"),
      damageFlat:pjDamageFlat(item),
      damageType:String(p.H0D_Arme_Type_Degats || "—"),
      element:String(p.H0D_Arme_Element || "Aucun"),
      range:num(p.H0D_Arme_Portee) + num(p.H0D_Arme_Trait_Portee_Total),
      zone:String(p.H0D_Arme_Zone || ""),
      special:String(p.H0D_Arme_Effet_Special || ""),
      notes:String(p.H0D_Arme_Notes || ""),
      usable:pjUsable(item), cooldown:standardCooldown(item)
    };
  }

  return {
    item,
    machine: false,
    name: item.name,
    category: String(
      p.H0D_Arme_Categorie || "—"
    ),
    type: "",
    attack: creatureAttackBonus(item),
    damage: String(
      p.H0D_Arme_Degats || "0"
    ),
    damageFlat: creatureDamageFlat(item),
    damageType: String(
      p.H0D_Arme_Type_Degats || "—"
    ),
    element: "",
    range:
      num(p.H0D_Arme_Portee) +
      num(
        p.H0D_Arme_Trait_Portee_Total
      ),
    zone: "",
    special: String(
      p.H0D_Arme_Effet_Special || ""
    ),
    notes: String(
      p.H0D_Arme_Notes || ""
    ),
    usable: creatureUsable(item),
    cooldown: standardCooldown(item)
  };
}

/* --------------------------------------------------------- */
/* ACTIVER COOLDOWN APRÈS ATTAQUE                            */
/* --------------------------------------------------------- */

async function startCooldown(info) {
  const item = info.item;
  const p = itemProps(item);

  const duration =
    info.cooldown.duration;

  if (duration <= 0) return;

  const combat = game.combat;
  const round = num(
    combat?.round
  );

  if (info.machine) {
    const mode = String(
      p.H0D_ArmeMachine_Cooldown_Mode ||
      "Auto"
    );

    if (
      mode === "Auto" &&
      combat &&
      round > 0
    ) {
      await item.update({
        "system.props.H0D_ArmeMachine_Cooldown_Actif": true,
        "system.props.H0D_ArmeMachine_Recharge_Compteur": 0,
        "system.props.H0D_ArmeMachine_Cooldown_CombatId": combat.id,
        "system.props.H0D_ArmeMachine_Cooldown_DebutRound": round
      });
    } else {
      await item.update({
        "system.props.H0D_ArmeMachine_Cooldown_Actif": true,
        "system.props.H0D_ArmeMachine_Recharge_Compteur": 0
      });
    }

    return;
  }

  const existing =
    item.getFlag(
      "custom-system-builder",
      "h0dCooldown"
    ) || {};

  const mode = String(
    existing.mode || "Auto"
  );

  if (
    mode === "Auto" &&
    combat &&
    round > 0
  ) {
    await item.setFlag(
      "custom-system-builder",
      "h0dCooldown",
      {
        mode: "Auto",
        active: true,
        elapsed: 0,
        combatId: combat.id,
        startRound: round
      }
    );
  } else {
    await item.setFlag(
      "custom-system-builder",
      "h0dCooldown",
      {
        mode: "Manuel",
        active: true,
        elapsed: 0,
        combatId: "",
        startRound: 0
      }
    );
  }
}

/* --------------------------------------------------------- */
/* LANCER UNE ATTAQUE                                        */
/* --------------------------------------------------------- */

async function attack(info, situational) {
  const target = getTarget();

  const targetActor =
    target?.actor ?? null;

  const defense =
    resolveDefense(targetActor);

  const attackRoll =
    await new Roll("1d20").evaluate();

  const natural =
    Number(attackRoll.total);

  const total =
    natural +
    info.attack +
    situational;

  let verdict =
    "NON COMPARÉ";

  if (defense !== null) {
    verdict =
      natural === 20 ||
      total >= defense
        ? "TOUCHÉ"
        : "RATÉ";
  }

  let damageTotal = null;

  if (
    verdict === "TOUCHÉ" ||
    defense === null
  ) {
    const formula =
      info.damage +
      (
        info.damageFlat
          ? ` + (${info.damageFlat})`
          : ""
      );

    const damageRoll =
      await new Roll(formula).evaluate();

    damageTotal =
      damageRoll.total;
  }

  const targetName =
    target?.name ||
    targetActor?.name ||
    "Aucune cible";

  const details = [];

  if (info.damageType) {
    details.push(
      info.damageType
    );
  }

  if (
    info.element &&
    info.element !== "Aucun"
  ) {
    details.push(
      info.element
    );
  }

  const content = `
    <div style="
      border:1px solid #777;
      border-radius:6px;
      padding:8px;
      background:#f5f5f5;
    ">

      <h3 style="
        margin:0 0 6px 0;
      ">
        ${esc(actor.name)}
        — ${esc(info.name)}
      </h3>

      <table style="
        width:100%;
      ">

        <tr>
          <td>Cible</td>
          <td style="
            text-align:right;
          ">
            <strong>
              ${esc(targetName)}
            </strong>
          </td>
        </tr>

        <tr>
          <td>Jet</td>
          <td style="
            text-align:right;
          ">
            d20
            <strong>
              ${natural}
            </strong>
            ${sign(
              info.attack +
              situational
            )}
            =
            <strong>
              ${total}
            </strong>
          </td>
        </tr>

        <tr>
          <td>Résultat</td>
          <td style="
            text-align:right;
          ">
            <strong>
              ${verdict}
            </strong>
          </td>
        </tr>

        ${
          damageTotal !== null
            ? `
              <tr>
                <td>Dégâts</td>
                <td style="
                  text-align:right;
                ">
                  <strong>
                    ${damageTotal}
                  </strong>

                  ${
                    details.length
                      ? ` — ${esc(
                          details.join(" · ")
                        )}`
                      : ""
                  }
                </td>
              </tr>
            `
            : ""
        }

      </table>

      ${
        info.special
          ? `
            <hr>

            <div>
              <strong>
                Effet :
              </strong>

              ${esc(
                info.special
              )}
            </div>
          `
          : ""
      }

    </div>
  `;

  const speaker =
    ChatMessage.getSpeaker({
      actor,
      token: token.document
    });

  const gmIds =
    ChatMessage
      .getWhisperRecipients("GM")
      .map(u => u.id);

  const messageData = {
    speaker,
    content
  };

  if (!isPJ) {
    if (!gmIds.length) {
      ui.notifications.error(
        "H0D : aucun destinataire MJ disponible ; attaque ennemie non publiée."
      );
      return;
    }
    messageData.whisper = gmIds;
  }

  await ChatMessage.create(messageData);

  /* DEF ET MARGE MJ UNIQUEMENT */

  if (defense !== null) {
    const margin =
      total - defense;

    if (gmIds.length) {
      await ChatMessage.create({
        speaker,
        whisper: gmIds,

        content: `
          <strong>
            H0D — détail MJ
          </strong>
          <br>

          ${esc(actor.name)}
          →
          ${esc(targetName)}
          <br>

          DEF :
          <strong>
            ${defense}
          </strong>
          <br>

          Marge :
          <strong>
            ${sign(margin)}
          </strong>
        `
      });
    }
  }

  await startCooldown(info);
}

/* --------------------------------------------------------- */
/* INTERFACE PRINCIPALE                                      */
/* --------------------------------------------------------- */

while (true) {
  const infos =
    weapons.map(
      getAttackInfo
    );

  const firstAvailable =
    infos.findIndex(
      i => i.usable.usable
    );

  const rows =
    infos.map(
      (info, index) => {

        const available =
          info.usable.usable;

        const statusColor =
          available
            ? "#3a7a3a"
            : "#9a3535";

        const damageText =
          info.damage +
          (
            info.damageFlat
              ? ` ${sign(
                  info.damageFlat
                )}`
              : ""
          );

        const numericRange =
          Number(
            info.range
          );

        const range =
          numericRange > 0
            ? `${info.range} m`
            : (
                String(info.range) &&
                String(info.range) !== "0"
                  ? String(
                      info.range
                    )
                  : "—"
              );

        return `
          <div style="
            border:1px solid #777;
            border-radius:6px;
            padding:7px;
            margin-bottom:6px;
            opacity:${
              available
                ? "1"
                : "0.65"
            };
          ">

            <label style="
              display:flex;
              gap:8px;
              align-items:center;
            ">

              <input
                type="radio"
                name="weapon"
                value="${info.item.id}"

                ${
                  available
                    ? ""
                    : "disabled"
                }

                ${
                  available &&
                  index ===
                    firstAvailable
                    ? "checked"
                    : ""
                }
              >

              <strong style="
                flex:1;
              ">
                ${esc(
                  info.name
                )}
              </strong>

              <span>
                ATQ
                ${sign(
                  info.attack
                )}
              </span>

              <span>
                ${esc(
                  damageText
                )}
              </span>

              <span style="
                color:${statusColor};
                font-weight:bold;
              ">
                ${esc(
                  info.usable.reason
                )}
              </span>

            </label>

            <details style="
              margin-top:5px;
            ">

              <summary>
                Détails
              </summary>

              <table style="
                width:100%;
                margin-top:4px;
              ">

                <tr>
                  <td>
                    Catégorie
                  </td>
                  <td>
                    ${esc(
                      info.category
                    )}
                  </td>
                </tr>

                ${
                  info.type
                    ? `
                      <tr>
                        <td>
                          Type
                        </td>
                        <td>
                          ${esc(
                            info.type
                          )}
                        </td>
                      </tr>
                    `
                    : ""
                }

                <tr>
                  <td>
                    Dégâts
                  </td>
                  <td>
                    ${esc(
                      damageText
                    )}
                    ·
                    ${esc(
                      info.damageType
                    )}
                  </td>
                </tr>

                <tr>
                  <td>
                    Portée
                  </td>
                  <td>
                    ${esc(
                      range
                    )}
                  </td>
                </tr>

                ${
                  info.zone
                    ? `
                      <tr>
                        <td>
                          Zone
                        </td>
                        <td>
                          ${esc(
                            info.zone
                          )}
                        </td>
                      </tr>
                    `
                    : ""
                }

                ${
                  info.element &&
                  info.element !== "Aucun"
                    ? `
                      <tr>
                        <td>
                          Élément
                        </td>
                        <td>
                          ${esc(
                            info.element
                          )}
                        </td>
                      </tr>
                    `
                    : ""
                }

                ${
                  info.cooldown.duration
                    ? `
                      <tr>
                        <td>
                          Cooldown
                        </td>
                        <td>
                          ${
                            info.cooldown.duration
                          }
                          round(s)
                        </td>
                      </tr>
                    `
                    : ""
                }

              </table>

              ${
                info.special
                  ? `
                    <p>
                      <strong>
                        Effet spécial :
                      </strong>
                      <br>

                      ${esc(
                        info.special
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                info.notes
                  ? `
                    <p>
                      <strong>
                        Notes :
                      </strong>
                      <br>

                      ${esc(
                        info.notes
                      )}
                    </p>
                  `
                  : ""
              }

            </details>

          </div>
        `;
      }
    ).join("");

  const target =
    getTarget();

  const content = `
    <div>

      <div style="
        margin-bottom:8px;
        padding:6px;
        border:1px solid #777;
        border-radius:5px;
      ">

        <strong>
          ${esc(actor.name)}
        </strong>

        <br>

        ${
          target
            ? `
              Cible :
              <strong>
                ${esc(
                  target.name
                )}
              </strong>
            `
            : `
              <span style="
                color:#b07020;
              ">
                Aucune cible sélectionnée
              </span>
            `
        }

      </div>

      ${rows}

      <hr>

      <div class="form-group">

        <label>
          Modificateur situationnel
        </label>

        <input
          type="number"
          name="situational"
          value="0"
          step="1"
        >

      </div>

      <p style="
        font-size:0.9em;
        opacity:0.75;
      ">
        Sélectionnez une attaque
        puis cliquez sur Attaquer.
      </p>

    </div>
  `;

  const fd =
    await DialogV2.input({
      window: {
        title:
          `H0D — Attaques : ${actor.name}`
      },

      content,

      ok: {
        label: "Attaquer",
        icon:
          "fa-solid fa-dice-d20"
      }
    });

  if (!fd) {
    break;
  }

  /* ------------------------------------------------------- */
  /* CORRECTION FOUNDRY V14                                  */
  /* ------------------------------------------------------- */

  const weaponId =
    fd.weapon;

  const situational =
    num(
      fd.situational
    );

  if (!weaponId) {
    ui.notifications.warn(
      "H0D : choisissez une attaque."
    );

    continue;
  }

  const chosen =
    infos.find(
      i =>
        i.item.id ===
        weaponId
    );

  if (!chosen) {
    ui.notifications.error(
      "H0D : attaque introuvable."
    );

    continue;
  }

  if (
    !chosen.usable.usable
  ) {
    ui.notifications.warn(
      `${chosen.name} : ${chosen.usable.reason}.`
    );

    continue;
  }

  await attack(
    chosen,
    situational
  );
}
}
