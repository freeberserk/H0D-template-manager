import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const src=await readFile(new URL("../scripts/h0d-ammo-recovery.js",import.meta.url),"utf8");
const main=await readFile(new URL("../scripts/h0d-template-manager.js",import.meta.url),"utf8");
const manifest=JSON.parse(await readFile(new URL("../module.json",import.meta.url),"utf8"));

assert.equal(manifest.version,"1.7.24");
assert.ok(main.includes('const MODULE_VERSION = "1.7.24";'),"MODULE_VERSION non alignée");

for(const family of ["Fleche","Carreau","Projectile"])
  assert.ok(src.includes('"'+family+'"'),"Famille récupérable absente : "+family);

assert.ok(src.includes("Faune:      {standard:75, reinforced:90}"),"Taux Faune incorrects");
assert.ok(src.includes("Faction:    {standard:60, reinforced:80}"),"Taux Faction incorrects");
assert.ok(src.includes("Machines:   {standard:25, reinforced:60}"),"Taux Machines incorrects");
assert.equal(src.includes("Mixte:"),false,"La V1 ne doit pas ajouter de contexte Mixte");

assert.ok(src.includes("H0D_Objet_Munition_Active"),"Les vrais objets de munitions doivent être suivis");
assert.ok(src.includes("H0D_Objet_Munition_Famille"),"La famille de munition doit être lue");
assert.ok(src.includes("H0D_Objet_Quantite"),"La quantité d'objet doit servir de compteur");
assert.ok(src.includes('name="reinforced_${index}"'),"Le nombre de munitions renforcées doit être saisissable par lot");
assert.ok(src.includes("combatStart"),"Snapshot début combat absent");
assert.ok(src.includes("combatEnd"),"Déclenchement fin combat absent");
assert.ok(src.includes("deleteCombat"),"Fallback suppression combat absent");
assert.ok(src.includes("promptPendingAmmoRecoveryOnReady"),"Rappel de récupération en attente absent");
assert.ok(src.includes("ACTIVE_PROMPTS"),"Protection contre double dialogue absente");
assert.ok(src.includes('new Roll(\`${count}d100\`)'),"La récupération doit utiliser un vrai pourcentage par munition");
assert.ok(src.includes('"system.props.H0D_Objet_Quantite"'),"Les munitions récupérées doivent retourner dans le lot");

assert.ok(main.includes("registerAmmoRecoverySettings"),"Réglage récupération non enregistré");
assert.ok(main.includes("registerAmmoRecoveryHooks"),"Hooks récupération non enregistrés");
assert.ok(main.includes("recoverAmmo:openPendingAmmoRecovery"),"API de reprise d'une récupération en attente absente");

console.log("Ammo recovery workflow 1.7.24 OK");
