import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const base=new URL("../data/templates/",import.meta.url);
const older=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.18.json",base),"utf8"));
const latest=JSON.parse(await readFile(new URL("H0D_Actor-template-creature-v1.19.json",base),"utf8"));
const fields=latest.system.body.contents[0].contents[0].contents[0].contents[1].contents[1];
const previous=older.system.body.contents[0].contents[0].contents[0].contents[1].contents[1];
assert.equal(latest._id,older._id,"Stable template ID required");
assert.equal(latest.system.templateSystemUniqueVersion,3034657901);
assert.equal(fields.rows,"2");
assert.equal(fields.cols,"6");
assert.equal(fields.contents.length,2);
assert.deepEqual(fields.contents[0],previous.contents[0],"Editable ability fields must remain byte-equivalent");
const stats=["FOR","DEX","CON","INT","SAG","CHA"];
for(const [index,stat] of stats.entries()){
 const roll=fields.contents[1][index];
 assert.equal(roll.key,"H0D_Creature_"+stat+"_Jet");
 assert.equal(roll.type,"label");
 assert.equal(roll.icon,"dice-d20");
 assert.equal(roll.rollMessageToChat,true);
 assert.ok(roll.rollMessage.includes("H0D_Creature_"+stat+"_MOD"),"Wrong ability bonus for "+stat);
 assert.ok(roll.rollMessage.includes("[1d20]"),"Missing d20 for "+stat);
}
const expected=structuredClone(latest);
expected.name=older.name;
expected.system.templateSystemUniqueVersion=older.system.templateSystemUniqueVersion;
expected.system.body.contents[0].contents[0].contents[0].contents[1].contents[1]=previous;
assert.deepEqual(expected,older,"Unexpected changes outside roll labels");
console.log("OK: 6 creature ability dice, unchanged 6 fields and combat formulas");
