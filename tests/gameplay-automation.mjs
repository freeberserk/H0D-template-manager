import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load = async path => JSON.parse(await readFile(new URL("../"+path, import.meta.url), "utf8"));
const walk = (root, fn) => {
  if (Array.isArray(root)) return root.forEach(v => walk(v, fn));
  if (!root || typeof root !== "object") return;
  fn(root);
  for (const v of Object.values(root)) walk(v, fn);
};
const findKey = (root, key) => {
  let hit=null;
  walk(root,o=>{ if (!hit && o.key===key) hit=o; });
  return hit;
};

const weapon=await load("data/templates/H0D_Arme-v2.8.json");
const armor=await load("data/templates/H0D_Armure-v2.0.json");
const pj=await load("data/templates/H0D_Actor-template-PJ-v3.72.json");
const creature=await load("data/templates/H0D_Actor-template-creature-v1.27.json");

for (let i=1;i<=3;i++) {
  assert.ok(findKey(weapon,`H0D_Arme_Amelioration_${i}_Type`), "Type amélioration arme manquant "+i);
  assert.ok(findKey(weapon,`H0D_Arme_Amelioration_${i}_Valeur`), "Valeur amélioration arme manquante "+i);
  assert.ok(findKey(armor,`H0D_Armure_Amelioration_${i}_Type`), "Type amélioration armure manquant "+i);
  assert.ok(findKey(armor,`H0D_Armure_Amelioration_${i}_Valeur`), "Valeur amélioration armure manquante "+i);
}
assert.ok(findKey(weapon,"H0D_Arme_Amelioration_Attaque_Total"),"Total attaque amélioration arme absent");
assert.ok(findKey(weapon,"H0D_Arme_Amelioration_Degats_Total"),"Total dégâts amélioration arme absent");
assert.ok(findKey(armor,"H0D_Armure_Amelioration_Defense_Total"),"Total DEF amélioration armure absent");
assert.ok(findKey(armor,"H0D_Armure_Amelioration_Discretion_Total"),"Total Discrétion amélioration armure absent");

assert.ok(findKey(creature,"H0D_Creature_DD_Capacites"),"DD capacités PNJ absent");
assert.ok(findKey(creature,"H0D_Creature_DD_Conseille_Aff"),"DD conseillé PNJ absent");
assert.ok(findKey(creature,"H0D_Creature_DD_Effectif_Aff"),"DD effectif PNJ absent");

const pjText=JSON.stringify(pj);
assert.ok(pjText.includes("H0D_Arme_Amelioration_Attaque_Total"),"PJ n'intègre pas le bonus d'attaque des améliorations");
assert.ok(pjText.includes("H0D_Arme_Amelioration_Degats_Total"),"PJ n'intègre pas le bonus de dégâts des améliorations");
assert.ok(pjText.includes("H0D_Armure_Amelioration_Defense_Total"),"PJ n'intègre pas le bonus DEF des améliorations");
assert.ok(pjText.includes("H0D_EQ_Armure_Amelioration_Discretion_Hid"),"PJ n'agrège pas les bonus de compétence d'armure");

for (const key of [
  "H0D_DT_Bonus_DEF_Perm_Total","H0D_DT_Bonus_Initiative_Total","H0D_DT_Bonus_Vigueur_Total",
  "H0D_DT_Bonus_Reflexes_Total","H0D_DT_Bonus_Volonte_Total","H0D_DT_Bonus_PV_Total",
  "H0D_DT_Bonus_Attaque_Global_Total","H0D_DT_Bonus_Degats_Global_Total",
  "H0D_DT_Bonus_Skill_Discretion_Total","H0D_DT_Bonus_Skill_Focus_Total"
]) assert.ok(findKey(pj,key), "Agrégat Don/Talent absent : "+key);

const creatureText=JSON.stringify(creature);
assert.ok(creatureText.includes("H0D_Arme_Amelioration_Attaque_Total"),"Créature n'intègre pas les améliorations d'attaque");
assert.ok(creatureText.includes("H0D_Arme_Amelioration_Degats_Total"),"Créature n'intègre pas les améliorations de dégâts");
assert.ok(creatureText.includes("H0D_Armure_Amelioration_Defense_Total"),"Créature n'intègre pas les améliorations de DEF");

console.log("Gameplay automation templates OK");
