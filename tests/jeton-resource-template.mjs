import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const index=read("data/templates/index.json");
const item=index.find(row=>row.id==="H0DResTpl0000001");
assert.equal(item.file,"H0D_Ressource-v2.6.json");
const template=read("data/templates/"+item.file);
assert.equal(template._id,"H0DResTpl0000001");
assert.equal(template.system.templateSystemUniqueVersion,11);
const queue=[template.system];let type;
while(queue.length){const node=queue.pop();if(Array.isArray(node)){queue.push(...node);continue;}
if(node&&typeof node==="object"){if(node.key==="H0D_Ressource_Type")type=node;
queue.push(...Object.values(node));}}
assert.equal(type.options.filter(v=>v.key==="Jeton").length,1);
assert.ok(type.options.some(v=>v.key==="Plaque"));
assert.ok(type.options.some(v=>v.key==="Autre"));
console.log("OK : catégorie Jeton du template Ressource v2.6.");
