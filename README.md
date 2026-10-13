# H0D Template Manager — v1.7.3

## v1.7.3 — Affichage du niveau PNJ distinct de la Menace / CR
Le template Créature **v1.21** complète le panneau spécifique aux **Caravanes Libres** : l'indication **PNJ ORDINAIRE · NIVEAU N · MENACE / CR M** affiche les deux informations séparément. Pour les profils ordinaires SRD de CR 1–4, le Faction Builder v0.3.2 utilise **niveau PNJ = CR + 1**. Le bonus +1 aux caractéristiques est donc gagné dès **Menace 3 / niveau 4**. Le panneau Scores SRD et les dés cliquables des versions précédentes ne changent pas.

Aucune modification des autres créatures, des calculs de combat, des sauvegardes, de la macro H0D — Attaques ni du template PJ. Mettre à jour le Template Manager, installer le template Créature v1.21 dans le monde, puis **synchroniser les Actors** après snapshot. Harmoniser ensuite les Caravanes déjà générées avec le bouton dédié du Faction Builder v0.3.2.

## v1.7.2 — Scores de caractéristiques pour les Caravanes Libres
Le template Créature **v1.20** ajoute un petit panneau **« SCORES SRD · CARAVANES LIBRES »**, visible uniquement sur ces membres de faction. Il affiche les valeurs brutes FOR/DEX/CON/INT/SAG/CHA, telles que **15/14/13/12/10/8** (réparties selon le métier), distinctes des modificateurs déjà éditables et des dés de jet livrés en v1.19. Les scores sont calculés/générés par **H0D Faction Builder v0.3.1**, qui synchronise aussi le modificateur quand un score est édité dans la fiche. La formule de modificateur est la même que sur les PJ : floor((score−10)/2).

**Installation :** mettre à jour le Template Manager 1.7.2 et le Faction Builder 0.3.1 ; **exporter un snapshot du monde** puis **installer le template Créature v1.20 et synchroniser les Actors** dans le Template Manager. Lancer ensuite le Faction Builder et sélectionner **« Corriger vers les scores SRD »** pour convertir les Caravanes générées par v0.2.1 ou v0.3.0, si leurs valeurs ne sont pas personnalisées.

Aucune modification aux six anciens champs numériques MOD, aux dés, aux créatures non Caravanes, à la fiche PJ ou au moteur H0D — Attaques.

## v1.7.1 — Jets de caractéristiques des Créatures et Factions

Le template Créature passe en **v1.19**, en conservant son identifiant et ses formules de combat. Une deuxième ligne discrète sous les champs FOR, DEX, CON, INT, SAG et CHA propose **Jet FOR / Jet DEX / ...** avec le dé cliquable, exactement comme les jets **1d20 + modificateur** du SRD / des fiches PJ H0D.

**Installation :** après la mise à jour du module, aller dans H0D — Template Manager, installer / mettre à jour le template Créature v1.19, exporter un snapshot de sécurité, puis synchroniser **Actors** pour actualiser les fiches existantes. Le gestionnaire ne synchronise pas automatiquement les fiches. Leurs statistiques, capacités et équipements ne sont pas réinitialisés par l'ajout de boutons.

Les nouveaux modificateurs des **14 Caravanes Libres** et la migration prudente des fiches déjà générées sont livrés séparément par H0D Faction Builder v0.3.0. Le Creature Builder ne change pas.

## v1.7.0 — H0D — Attaques (macro universelle, sans risque sur l'ancienne)

Nouveau moteur séparé `scripts/h0d-attacks.js` dérivé **directement de la macro « H0D — Attaques ennemi » v1.1 exportée du monde Foundry**. À l'ouverture du monde, le Template Manager crée seulement si absente la macro **H0D — Attaques**, qui lance `game.h0dTemplateManager.openAttacks();`. **La macro « H0D — Attaques ennemi » existante est conservée, jamais renommée, effacée ou mise à jour**. Une éventuelle macro déjà nommée « H0D — Attaques » est elle aussi laissée intacte.

Prise en charge : Machines (comme v1.1), Créatures et membres de factions/PNJ (comme v1.1), **PJ** (nouveau : attaque BBA + caractéristique + taille + encombrement + bonus équipement/dons/talents/arme, dégâts avec bonus propres au PJ selon le template PJ v3.67). La détection des PJ n'altère pas les deux branches historiques. Sélectionner **un token**, cibler éventuellement **un token**. Le lanceur utilise le même sélecteur d'armes, le modificateur situationnel, le chat public et le détail privé MJ.

**Important :** comme l'ancienne macro v1.1, ce lanceur **n'applique pas automatiquement les dégâts aux cibles** et **ne consomme pas automatiquement les munitions**. Il ne remplace pas les boutons d'attaque de la fiche CSB ni leurs éventuelles fonctions de consommation/critique. Le fonctionnement des cooldowns est celui de v1.1. Seules les **armes embarquées** sont actuellement proposées, pas les capacités textuelles non converties en Items d'arme. Le résultat doit être testé dans un monde BAC (Machine, PNJ, Créature, PJ) avant de remplacer la macro de raccourci utilisée en séance.

## v1.6.8 — Carte d’attaque PJ corrigée

La mise en page du résumé des attaques est stabilisée : les libellés gardent une largeur suffisante même lorsqu’une arme possède un **Effet** très long. Les calculs restent inchangés.

## v1.6.7 — Historique de progression PJ corrigé

La fiche PJ canonique passe en **v3.67**.

L’historique par niveau visible par les joueurs utilise maintenant des tables CSB natives, avec huit colonnes correctement alignées. Les anciennes données de niveau restent reconnues même si leur valeur est stockée sous forme de texte. L’édition reste réservée à l’onglet **Technique**.

## v1.6.6 — Correction du template Créature

Le template Créature passe en **v1.18**.

Trois formules de visibilité incompatibles avec **Custom System Builder 6.0.2** ont été corrigées. Le cas le plus visible concernait les Actors de type **Faction**, qui pouvaient être générés mais dont la fiche refusait de s’ouvrir avec l’erreur `Unexpected operator { (char 2)`.

## v1.6.5 — Progression technique réservée au MJ

La fiche PJ canonique passe en **v3.66**.

La table de progression par niveau est désormais éditable uniquement dans l’onglet **Technique**. La vue joueur conserve un historique calculé en lecture seule. Le bloc **Détail technique** et la **Synthèse de progression** sont également clarifiés avec des libellés explicites.

## v1.6.4 — Barre d’actions réorganisée

Les commandes opérationnelles sont maintenant affichées en premier, puis **Audit monde**, **Exporter audit** et **Exporter snapshot** juste avant **Restaurer dernier cycle**.

## v1.6.3 — Paramètres techniques réservés au MJ

La fiche PJ canonique passe en **v3.65**.

Les corrections manuelles visibles dans les onglets joueur deviennent des valeurs **en lecture seule**. Leur édition est centralisée dans **Technique → Paramètres MJ — Ajustements manuels** : Accès Focus, DEF divers, sauvegardes divers, bonus divers des compétences, ajustement des points de compétence et ajustement des PV max.

Les champs de jeu et de progression normaux restent éditables par les joueurs : caractéristiques, rangs, classes, progression par niveau, PV actuels, points d’action, notes, raccourcis, inventaire et monture.

Aucune formule de calcul ni règle de jeu n’est modifiée.

## v1.6.2 — Correction du bloc Focus PJ

La fiche PJ canonique passe en **v3.64**.

- le bloc **FOCUS** de l’onglet Personnage conserve les quatre actions : Scan rapide, Scan complet, Scan concentré et Marquer une pièce ;
- **Accès** et le **bonus Focus total** restent visibles dans ce bloc ;
- **Rangs**, **Classe / occupation**, **bonus automatique**, **Divers** et **Total** sont désormais gérés dans une ligne **Focus** de la table détaillée des compétences ;
- aucun jet Focus générique n’est ajouté dans la table des compétences : les jets restent exclusivement dans le bloc FOCUS ;
- le champ **Accès Focus** est conservé pour un futur branchement mécanique.

## v1.6.1 — Simplification de la fiche PJ

La fiche PJ canonique passe en **v3.63**. Cette passe vise uniquement l'ergonomie et le nettoyage :

- suppression de **Rite accompli** ;
- suppression de la case **Bonus situationnel** sous les sauvegardes, qui n'alimentait aucun calcul ;
- le bloc **Focus** conserve ses valeurs de compétence et uniquement les trois jets de scan (rapide, complet, concentré) ;
- retrait du jet **Marquer une pièce** de ce bloc ;
- ajout d'un avertissement visuel en tête de l'onglet **Technique** ;
- retrait du champ legacy visible **ANCIEN CHAMP DONS / TALENTS**.

Les anciennes propriétés présentes sur les personnages ne sont pas supprimées de force lors de la migration : elles peuvent rester comme données legacy invisibles. Les calculs de sauvegarde, de rangs et de bonus Focus sont inchangés.

## Essai v1.2.2 — détails de jets compacts

Cette passe conserve le moteur de jets de la 1.2.1 et réduit uniquement le rendu des attaques : le volet **Détails du jet** explique désormais le calcul du résultat au lieu de recopier les propriétés de l’arme. Les trois templates Actor deviennent **PJ v3.60**, **Créature v1.16** et **Machine v3.11**.

## Essai v1.2.1 — cartes de jets H0D

Cette branche part strictement de la base stable **v1.2.0** et ne modifie pas la logique de sécurisation, d’audit, de snapshot ou de migration. Elle ajoute uniquement la nouvelle présentation des jets dans le chat et met à jour les trois templates Actor qui émettent ces jets : **PJ v3.59**, **Créature v1.15**, **Machine v3.10**.

Les cartes partagent désormais le même langage visuel Horizon : résultat prioritaire, type de jet clairement identifié, bonus visibles, puis détail repliable. Les calculs d’attaque, ciblage, DEF privée MJ, munitions, critiques, cooldowns et formules existantes sont conservés.

Gestionnaire de templates pour **Foundry VTT 14 + Custom System Builder 6.0.2+**.

## Accès

Dans les contrôles de scène **Tokens**, bouton bouclier : **H0D — Template Manager**.

Il s'agit d'une vraie application Foundry (`ApplicationV2`) : **aucune macro de lancement n'est créée**.

## Barre d'actions

- Audit monde (lecture seule)
- Exporter audit
- Réparer équipements
- Migrer versions sûres (après audit : PJ, armures/boucliers, dons/talents, armes, objets et pièces détachables en `staleOnly`)
- Installer/mettre à jour
- Synchroniser le monde (Actors / Items / les deux, compendiums Items en option)
- Restaurer dernier cycle
- Exporter snapshot
- Fermer

## Sécurité

Aucune migration au démarrage. Les snapshots JSON sont désormais **manuels uniquement** via le bouton « Exporter snapshot » : aucun clic d’installation, audit, synchronisation ou réparation ne déclenche d’export automatique. Les documents synchronisés/réparés conservent jusqu'à 5 sauvegardes internes par fiche.


## Migration contrôlée v1.2.0 stable

La v1.2.0 fige le périmètre de sécurité validé sur le BAC : seuls les documents **strictement `staleOnly`** des familles **Actor PJ**, **Armure/Bouclier**, **Don/Talent**, **Arme**, **Objet** et **Pièce détachable** sont candidats. Les `missingOnly`, les cas mixtes, les armes-machines et les compendiums restent exclus.

Le changement porte sur l'exécution : après chaque `reloadTemplate()`, le manager **recollecte entièrement les candidats depuis l'état courant du monde** au lieu de continuer à parcourir une liste figée. Cette stratégie vise le comportement observé sur le BAC en v1.1.2, où 7 des 35 candidats restants avaient migré puis les Items embarqués suivants restaient inchangés. Elle protège contre les reconstructions de collections d'Embedded Items effectuées par CSB pendant un reload.

Chaque document est toujours ré-résolu par UUID avant et après migration, reçoit une sauvegarde interne, et ses valeurs locales existantes (dynamicTables et propriétés legacy comprises) sont restaurées puis vérifiées. La boucle dispose d'une limite dure et mémorise les candidats en erreur afin d'éviter toute répétition infinie. Le rapport immédiat expose aussi le nombre de candidats restant après le cycle.


## Statut v1.2.0 — stable serveur principal

Cette version est la base **stable / production** destinée au serveur officiel. Elle fige les mécanismes validés sur le BAC : audit, sauvegardes internes, réparateur d’équipements et migration `staleOnly`. Aucun traitement automatique des `missingOnly` ou `mixed` n’est ajouté en 1.2.0. Les expérimentations suivantes reprennent en branche 1.2.1+ sur le BAC.

Le bouton **Migrer versions sûres** est désormais regroupé dans la barre d’actions supérieure, à côté de **Réparer équipements**, afin que toutes les opérations de maintenance soient au même endroit.

## Templates actifs

3 Actors + 8 Items. `H0D_Trait v2.6` n'est plus dans le catalogue actif ; sa suppression n'est proposée que si aucune utilisation n'est détectée.

## Fiche PJ Horizon light

La fiche PJ **v3.58** repart directement de l’export `v3.57_update` remanié dans Foundry et conserve les mécaniques existantes. La disposition manuelle devient la base canonique :

- `Personnage` conserve la disposition CSB manuellement ajustée par le MJ.
- `Inventaire & monture` utilise de vraies tables CSB 2×2 : **Armes | Armures**, puis **Objets | Munitions** ; **Ressources** restent en pleine largeur.
- le chargement Monture/Machine reprend le même 2×2 et place **Ressources transportées** en pleine largeur dessous.
- les listes d'Items sont réellement compactées : seules les informations utiles à la gestion courante restent dans la vue d'inventaire.
- `H0D_Arme_Active` garde sa clé stable mais représente désormais explicitement **En main** ; les Attaques rapides affichent les armes en main stockées sur le PJ.
- ranger une arme sur la monture retire automatiquement ses états `En main` et `Équipée` ; les autres équipements stockés cessent également d'être actifs.

Aucune donnée d'arme n'est dupliquée : `Équipée`, `En main`, le stockage PJ/Monture et les munitions restent des propriétés des Items existants.

## Migrations déjà intégrées

- Armure : Traits simplifiés, résistances migrées vers Ignifugé / Anti-froid / Anti-choc / Anti-acide, Lourd et Renforcé ; Isolé reste descriptif.
- Arme Machine : le mode Spéciale impose un cooldown minimum de 1 round.
- Arme : Anti-blindage raccordé à la DEF effective adverse et Portée spéciale corrigée.
- Tous les composants de templates sont en `size: auto`.

## Conformité des armes

Le manager conserve le contrôle des armes issu des tests v0.5.2 et ajoute la **Hache de chasse** au catalogue de noms de référence (21 entrées). Les mécaniques des armes restent lues depuis les compendiums déjà validés (`Arme` et `Item (Partagé)`). Les PNJ et armes hors référentiel sont laissés intacts. Le bouton unique **Réparer équipements** traite les différences mécaniques explicites des armes, armures et boucliers référencés.


## Correctif v1.0.10 — traits d’armes

La réparation des armures/boucliers est conservée telle qu’elle a été validée sur le BAC (11/11 conformes après réparation). Pour les armes, le diagnostic v1.0.9 a montré que CSB 6 stocke les dynamicTable runtime comme des objets indexés avec `$deleted: false`. La v1.0.10 réinjecte donc les traits dans ce format natif. Ce correctif cible le dernier écart observé : la Hache de chasse gardait une ligne vide au lieu du trait `OUTIL`.

## Conformité armures & boucliers — v1.0.10

Le classeur `reference/template_arme.xlsx` est embarqué avec un référentiel JSON dérivé de l’onglet **Bouclier + Armures**. Les 7 références sont auditées uniquement sur les Actors utilisant le template PJ.

- comparaison mécanique : type, zone, DEF, charge, mobilité, résistances élémentaires et traits lorsque l’Excel permet un mapping non ambigu ;
- comparaison narrative séparée : origine et description ;
- les équipements inconnus restent `unreferenced` et ne sont jamais modifiés ;
- les lignes Excel ambiguës (notamment plusieurs traits avec une valeur/paramètre scalaire) sont signalées et **ne servent pas à une réparation** ;
- v1.0.10 répare les armures/boucliers référencés avec remplacement exact des lignes de traits gérées, sans dupliquer les dynamicTables.


## Armures / boucliers — v1.0.10

La référence embarquée contient 8 équipements issus de l’onglet `Bouclier + Armures`. Le champ `Malus/bonus mobilité` est comparé à `H0D_Armure_Malus`. `MAX DEX` et la colonne texte `Résitances` sont conservés dans le rapport comme informations de référence, mais ne sont pas appliqués au document tant que le template Armure v1.8 ne fournit pas de propriété dédiée. Les résistances Feu/Gel/Choc/Acide et les traits explicitement mappés restent contrôlés mécaniquement. La réparation est active via le bouton unique en barre supérieure ; les traits locaux hors référentiel sont conservés et ignorés par la comparaison canonique.


## Diagnostic v1.0.9 — traits d’armes

La v1.0.9 ajoute au rapport d’audit un bloc `weaponReference.traitDiagnostics` et, sur les armes concernées, un bloc `traitDiagnostic`. Ces données sont strictement en lecture seule et servent à comparer la structure runtime CSB d’une dynamicTable valide avec celle de la Hache de chasse. Pour ce test, il suffit d’installer la v1.0.9 puis d’exporter un audit ; il n’est pas nécessaire de lancer une réparation.


## Diagnostic conservé — traits d’armes

Le bloc `weaponReference.traitDiagnostics` reste présent pour contrôler le format runtime des dynamicTable après réparation.


## Intégrité Machines v2 — v1.3.0

La fiche Machine conserve les clés historiques de PV pour compatibilité, mais `H0D_Machine_PV_Actuels`
représente désormais l'**Intégrité actuelle**. Le maximum reste :

`Base d'Intégrité (corps) + PV max des pièces cochées Compte dans l'Intégrité`.

La destruction d'une pièce ne fait plus diminuer le maximum. Les champs de pièce ajoutés sont :
`H0D_Composant_Zone` et `H0D_Composant_Protection_Corps`.

Le calcul des dégâts, du corps protégé/exposé et de l'overkill est délégué à
**H0D Machine Health Manager v0.2.1+**.

### API Builder

`game.modules.get("h0d-template-manager").api.getTemplate("actor-machine")`
renvoie le template canonique installé. La clé de la pièce détachable est `item-piece`.


## Cartes de jets — standard v1.4.0
- Attaque : Résultat, Verdict, Cible, Dégâts, Effet éventuel, Détails.
- Compétence / Aptitude : Résultat, Détails ; aucun verdict.
- Sauvegarde : Résultat, Détails ; aucun verdict.
- Focus : Résultat + informations d’action, Détails.
- DEF / marge : message privé MJ uniquement.
Après installation des templates canoniques, utiliser « Migrer les versions sûres » pour PJ, créatures/factions et machines staleOnly.


### Correctif 1.4.1 — dégâts Machine

Les attaques Machine lancent désormais leur formule de dégâts et affichent le total dans la carte.
Exemple : `2d6+1` avec un résultat de 9 devient `Dégâts  9 — Contondant`.
La formule `2d6+1` reste consultable dans `Détails du jet`.


## Fiche PJ — v1.5.0

La page Personnage est réorganisée pour privilégier les actions utilisées en partie :

1. identité / caractéristiques ;
2. **attaques rapides** ;
3. combat / sauvegardes / actions héroïques ;
4. **repos / récupération** ;
5. **compétences rapides** ;
6. Focus.

Les compétences rapides contiennent toujours **Perception**, plus trois emplacements librement
configurables parmi les huit autres compétences principales. Les compétences complètes et leurs
rangs/bonus restent gérés dans l'onglet correspondant.


## Menu v1.5.1

Le menu suit désormais le flux recommandé : audit → export audit → snapshot → installation/mise à jour → synchronisation → réparation des équipements → migration sûre → restauration → fermeture.


## v1.6.0 — Emplacements d’amélioration d’équipement

Les templates **H0D_Arme v2.7** et **H0D_Armure v1.9** disposent désormais de trois emplacements fixes d’amélioration.

Chaque emplacement stocke quatre propriétés indépendantes : **Installée**, **Nom**, **Rang** et **Effet / notes**. Les champs n’appliquent aucun bonus mécanique de façon implicite. Cette séparation permet de noter immédiatement les fabrications installées tout en gardant la porte ouverte à une future implémentation par ItemContainer qui pourra porter elle-même bonus d’attaque, dégâts, DEF ou autres effets.

### Migration depuis Arme v2.6 / Armure v1.8

Après **Installer/mettre à jour**, lancer un nouvel **Audit monde**, puis **Migrer versions sûres**.

La 1.6.0 autorise explicitement ce seul cas de migration « version + champs manquants » : les 12 nouveaux champs d’amélioration d’une arme ou d’une armure. Le template est rechargé, les nouveaux champs prennent leurs valeurs par défaut, puis toutes les propriétés locales historiques sont réinjectées et vérifiées. Les autres mixes restent exclus.
