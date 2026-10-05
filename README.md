# H0D Template Manager

Gestionnaire central des templates de **JDR Zero Dawn** pour **Foundry VTT v14 + Custom System Builder 6.x**.

## Objectif de la v0.1.0

Éviter qu'une mise à jour de template fasse perdre les informations des PJ, créatures, machines, armes ou autres Items H0D.

Le module embarque les **12 templates canoniques** du patch critique v1.3 :

### Actors
- H0D_Actor-template-PJ v3.54
- H0D_Actor-template-creature v1.13
- H0D_Actor-template-machine v3.8

### Items
- H0D_Arme v2.4
- H0D_Armure v1.7
- H0D_Objet v2.8
- H0D_Ressource v2.4
- H0D_Don_Talent v2.4
- H0D_Modificateur v1.2
- H0D_Trait v2.6
- H0D_arme_Machine v3.8
- H0D_Pièce_Détachable v2.4

Les IDs historiques sont conservés et deviennent les identifiants de référence H0D.

## Accès

En tant que MJ, ouvrir les **contrôles Token** puis cliquer sur l'icône bouclier : **H0D Template Manager**.

API également disponible :

```js
game.modules.get("h0d-template-manager").api.open();
```

## Fonctions

### Audit
Analyse les templates installés et tous les documents du monde liés aux IDs H0D :
- Actors du monde ;
- Items du monde ;
- Items embarqués dans les Actors.

Aucune donnée n'est modifiée pendant l'audit.

### Installer / mettre à jour
Installe les 12 templates canoniques dans deux dossiers dédiés :
- `H0D — Templates Actors`
- `H0D — Templates Items`

Avant toute écriture, un snapshot JSON complet est téléchargé.

### Synchroniser le monde
Pour chaque document H0D :
1. export d'un snapshot complet ;
2. sauvegarde locale de `system.props`, du nom, de l'image et des informations de template ;
3. `templateSystem.reloadTemplate()` ;
4. restauration des anciennes valeurs dont les clés existent encore ;
5. conservation des nouvelles clés à leur valeur par défaut.

Les clés réellement supprimées ne sont pas réinjectées dans `system.props`, mais restent présentes dans la sauvegarde du document et dans le snapshot JSON.

Le module conserve jusqu'aux **5 derniers backups** sur chaque document.

### Restaurer le dernier cycle
Restaure le nom, l'image et `system.props` enregistrés avant le dernier cycle de synchronisation.

Cette fonction ne rétrograde pas automatiquement les templates : le snapshot JSON reste la sécurité complète si un rollback intégral est nécessaire.

### Exporter snapshot
Télécharge un JSON contenant :
- les 12 références canoniques ;
- les templates actuellement installés ;
- les Actors H0D du monde avec leurs Items embarqués ;
- les Items H0D présents directement dans le monde.

## Sécurité

Le module **ne modifie jamais automatiquement** un Actor ou un Item au démarrage. Toutes les opérations d'écriture demandent une action du MJ.

Les images existantes des documents sont conservées lors d'une synchronisation CSB.

## API pour les autres modules H0D

```js
const tm = game.modules.get("h0d-template-manager")?.api;
const machineTemplate = tm?.getTemplate("actor-machine");
const weaponTemplate = tm?.getTemplate("item-arme-machine");
```

Le but est que Machine Builder, Loot et les futurs modules utilisent progressivement cette source centrale au lieu de redétecter les templates chacun de leur côté.

## Évolution prévue

Priorité suivante déjà identifiée : **audit et sauvegarde des compendiums partagés**, afin de sécuriser le contenu déjà propagé entre mondes avant une migration de templates.

La v0.1.0 n'écrit volontairement dans aucun compendium.
