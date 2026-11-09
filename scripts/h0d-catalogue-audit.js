// H0D Catalogue est une référence externe facultative : aucune résolution
// heuristique de nom et aucun écrasement des Items au moment de l'audit.
const EQUIPMENT_BUILDER = "h0d-equipment-builder";
const TEMPLATE_BY_KIND = Object.freeze({
  weapon:"O6qwtv7ozECILPHV",
  armor:"dEeBbuthkI0CVMa3"
});
// Exclus volontairement : état équipé/actif, munitions restantes, quantités,
// emplacement, noms, textes, tables de traits, améliorations personnelles.
export const CATALOGUE_MECHANICAL_FIELDS = Object.freeze({
  weapon:Object.freeze([
    "H0D_Arme_Categorie","H0D_Arme_Carac_Attaque","H0D_Arme_Carac_Degats",
    "H0D_Arme_Degats","H0D_Arme_Type_Degats","H0D_Arme_Portee",
    "H0D_Arme_Mains","H0D_Arme_Critique_Seuil","H0D_Arme_Critique_Multiplicateur",
    "H0D_Arme_Mode_Munition","H0D_Arme_Type_Munition","H0D_Arme_Consommation_Munition",
    "H0D_Arme_Recharge","H0D_Arme_Element","H0D_Arme_Encombrement","H0D_Arme_Zone"
  ]),
  armor:Object.freeze([
    "H0D_Armure_Type","H0D_Armure_Zone","H0D_Armure_Bonus_Defense",
    "H0D_Armure_Encombrement","H0D_Armure_Malus"
  ])
});
const NUMERIC_FIELD = /(?:Degats$|Portee$|Mains$|Critique_Seuil$|Critique_Multiplicateur$|Consommation_Munition$|Encombrement$|Bonus_Defense$)/;
function equalValue(a,b,key) {
  if(NUMERIC_FIELD.test(key)&&a!==""&&b!==""&&a!=null&&b!=null){
    const x=Number(a),y=Number(b);
    if(Number.isFinite(x)&&Number.isFinite(y))return x===y;
  }
  return a===b;
}
const getFlag=(item,key)=>item?.getFlag?.(EQUIPMENT_BUILDER,key)??item?.flags?.[EQUIPMENT_BUILDER]?.[key];
export function planCatalogueEquipment(item,definition) {
  const catalogKey=getFlag(item,"catalogKey");
  if(!catalogKey||getFlag(item,"generated")!==true)return {status:"not-managed",diffs:[]};
  if(!definition||definition.key!==catalogKey)return {status:"missing-reference",diffs:[]};
  const kind=definition.kind;
  if(!(kind in CATALOGUE_MECHANICAL_FIELDS))return {status:"read-only-kind",diffs:[]};
  if(definition.templateKey!==("item-"+(kind==="weapon"?"arme":"armure"))||
      item?.system?.template!==TEMPLATE_BY_KIND[kind] ||
      getFlag(item,"sourceTemplateId")!==TEMPLATE_BY_KIND[kind]) {
    return {status:"template-mismatch",diffs:[]};
  }
  if(definition.catalogue?.pret_pour_builder===false||
      definition.catalogue?.parametres_encore_provisoires?.length>0)
    return {status:"unvalidated-reference",diffs:[]};
  const expected=definition.props||{};
  const current=item.system?.props||{};
  const diffs=CATALOGUE_MECHANICAL_FIELDS[kind].filter(key=>
    Object.prototype.hasOwnProperty.call(expected,key)&&
    !equalValue(current[key],expected[key],key)
  ).map(key=>({key,current:current[key]??null,expected:expected[key]}));
  return {status:diffs.length?"repairable":"ok",diffs,kind};
}
export function scanCatalogueEquipment(api,items=[]) {
  const base={available:false,version:null,summary:{tracked:0,ok:0,repairable:0,unmapped:0,excluded:0},records:[]};
  if(typeof api?.getDefinition!=="function")return base;
  const records=[];
  for(const item of items){
    const key=getFlag(item,"catalogKey");
    if(getFlag(item,"generated")!==true||typeof key!=="string"||!key.trim())continue;
    const definition=api.getDefinition(key);
    const plan=planCatalogueEquipment(item,definition);
    records.push({
      uuid:item.uuid,name:item.name,actorName:item.parent?.documentName==="Actor"?item.parent.name:null,
      catalogKey:key,kind:definition?.kind??null,status:plan.status,diffs:plan.diffs
    });
  }
  return {
    available:true,version:api.version??null,
    summary:{
      tracked:records.length,
      ok:records.filter(x=>x.status==="ok").length,
      repairable:records.filter(x=>x.status==="repairable").length,
      unmapped:records.filter(x=>x.status==="missing-reference").length,
      excluded:records.filter(x=>!["ok","repairable","missing-reference"].includes(x.status)).length
    },
    records
  };
}
