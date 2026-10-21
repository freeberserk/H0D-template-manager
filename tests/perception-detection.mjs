import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const load = async path => JSON.parse(await readFile(new URL("../"+path, import.meta.url), "utf8"));
const walk = (root, fn) => {
  if (Array.isArray(root)) return root.forEach(v => walk(v, fn));
  if (!root || typeof root !== "object") return;
  fn(root);
  for (const v of Object.values(root)) walk(v, fn);
};
const findKey = (root,key) => {
  let hit=null;
  walk(root,o=>{ if(!hit && o.key===key) hit=o; });
  return hit;
};

const creature=await load("data/templates/H0D_Actor-template-creature-v1.26.json");
const machine=await load("data/templates/H0D_Actor-template-machine-v3.17.json");
const piece=await load("data/templates/H0D_Piece_Detachable-v2.7.json");

for (const key of ["H0D_Creature_Perception","H0D_Creature_Perception_Jet","H0D_Creature_Detection_Calc","H0D_Creature_Perception_Portee","H0D_Creature_Sens_Speciaux","H0D_Creature_Sens_Portee"])
  assert.ok(findKey(creature,key), "Champ créature absent : "+key);

for (const key of ["H0D_Machine_Perception_Base","H0D_Machine_Mod_Perception_Temp","H0D_Machine_Perception_Effective_Calc","H0D_Machine_Detection_Calc","H0D_Machine_Perception_Portee_Base","H0D_Machine_Perception_Bonus_Pieces_Calc"])
  assert.ok(findKey(machine,key), "Champ machine absent : "+key);

const machineText=JSON.stringify(machine);
assert.ok(machineText.includes("H0D_Machine_Etat_Aveuglee ? -4 : 0"), "Le malus Aveuglée -4 PER n'est pas câblé");
assert.ok(machineText.includes("H0D_Machine_Composant_Perception_Bonus_Hid"), "Agrégat PER composants absent");

for (const key of ["H0D_Composant_Capteur_Specialise","H0D_Composant_Capteur_Mode","H0D_Composant_Capteur_Cible","H0D_Composant_Capteur_Portee","H0D_Composant_Capteur_Bonus_Perception"])
  assert.ok(findKey(piece,key), "Champ capteur absent : "+key);

console.log("Perception / détection templates OK");
