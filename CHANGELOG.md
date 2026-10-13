## 1.7.2 — Affichage des scores Modern SRD des Caravanes
- Template Créature v1.20 : panneau supplémentaire avec six scores bruts éditables FOR/DEX/CON/INT/SAG/CHA, visible uniquement pour les Caravanes Libres.
- Aucun changement aux modificateurs, aux dés de la v1.19, aux formules de combat ou au template PJ.
- Synchronisation des scores et modificateurs assurée par Faction Builder v0.3.1 ; les anciennes fiches sont migrées volontairement, après snapshot.

## 1.7.1 — Jets de caractéristiques sur les fiches Créature/Faction

- Template Créature v1.19 : six boutons de jet `1d20 + modificateur` (FOR/DEX/CON/INT/SAG/CHA), sans toucher aux champs éditables ni aux formules d'attaque, DEF, sauvegardes et PV.
- Mise à niveau opt-in par Template Manager : installer v1.19 puis synchroniser Actors après snapshot.
- Aucun changement au template PJ ni à la macro universelle H0D — Attaques v1.7.0.

## 1.7.0 — Macro universelle H0D — Attaques

- Ajout du moteur `scripts/h0d-attacks.js` : reprise du code de la macro utilisateur v1.1, complétée par le support des PJ avec leurs calculs du template v3.67.
- API : `game.h0dTemplateManager.openAttacks()` ; création automatique de la nouvelle macro « H0D — Attaques » uniquement si absente.
- L'ancienne macro « H0D — Attaques ennemi » **n'est pas modifiée**, même si elle est utilisée très fréquemment.
- Aucun template ni système de combat existant modifié ; aucune migration de fiches.
- Validation syntaxique et essais en BAC recommandés avant remplacement du raccourci historique.

# 1.6.8 — Correction de la carte d’attaque PJ

- Correction d’une régression d’affichage des cartes d’attaque dans le chat.
- Un effet spécial très long pouvait laisser la seconde colonne du résumé prendre presque toute la largeur et écraser les libellés **Résultat / Verdict / Cible / Dégâts / Critique / Effet** lettre par lettre.
- Le tableau de résumé utilise désormais une disposition fixe : **38 % pour les libellés**, **62 % pour les valeurs**.
- Les textes longs se replient dans la colonne de droite sans casser les mots des libellés.
- Aucun calcul d’attaque, de critique, de dégâts ou d’effet n’est modifié.
- Aucun template n’est modifié dans cette version.

# 1.6.7 — Correction de l’historique de progression PJ

- **H0D_Actor-template-PJ v3.67** devient la fiche PJ canonique.
- L’historique de progression en lecture seule utilise désormais des **tables CSB natives à 8 colonnes** au lieu d’une grille CSS.
- Correction de l’alignement des colonnes **Niv. / Classe / INT / Pts / DV / DV retenu / Gain PV / Notes**.
- Les lignes sont filtrées avec une comparaison tolérante `==` afin de reconnaître les anciens numéros de niveau stockés comme texte ou comme nombre.
- La table éditable reste exclusivement dans l’onglet **Technique**.
- Aucun calcul de progression, PV ou points de compétence n’est modifié.

# 1.6.6 — Correction d’ouverture des Actors de faction

- **H0D_Actor-template-creature v1.18** devient le template Créature canonique.
- Correction de trois `visibilityFormula` incompatibles avec Custom System Builder 6.0.2 :
  - affichage de **Faction** ;
  - affichage de **Faction personnalisée** ;
  - affichage de **Ajuster PV au maximum**.
- Les formules ne sont plus encapsulées dans `${...}$` et utilisent désormais directement l’expression attendue par CSB.
- Cette correction résout l’erreur `Unexpected operator { (char 2)` qui empêchait notamment l’ouverture des Actors générés avec `H0D_Creature_Type = Faction`.
- Aucun profil de faction, aucune statistique et aucun équipement ne sont modifiés.

# 1.6.5 — Progression technique réservée au MJ

- **H0D_Actor-template-PJ v3.66** devient la fiche PJ canonique.
- La table dynamique **Progression par niveau** est déplacée dans l’onglet **Technique** : niveau, classe, modificateur d’INT historique, DV retenu et notes ne sont plus modifiables depuis la vue joueur.
- L’onglet **Compétences & progression** conserve un historique par niveau en **lecture seule**, alimenté par la même table technique.
- Le bloc **Détail technique** affiche désormais explicitement **Effet CON cumulé** et **Niveaux PV manquants**.
- L’ancienne ligne ambiguë **TOTAL** est remplacée par une **Synthèse de progression** avec quatre libellés : **Niveau total**, **Pts de compétence acquis**, **DV retenus cumulés**, **PV max**.
- Aucun changement des formules de progression, de points de compétence ou de PV : seule la localisation de l’édition et la présentation sont modifiées.

# 1.6.4 — Réorganisation de la barre d’actions

- Réorganisation visuelle de la barre du Template Manager.
- Les actions opérationnelles restent en tête : **Installer/mettre à jour**, **Synchroniser le monde**, **Réparer équipements**, **Migrer versions sûres**.
- **Audit monde**, **Exporter audit** et **Exporter snapshot** sont regroupés juste avant **Restaurer dernier cycle**.
- Aucun comportement métier n’est modifié.

# 1.6.3 — Paramètres techniques réservés au MJ

- **H0D_Actor-template-PJ v3.65** devient la fiche PJ canonique.
- Séparation explicite entre **lecture joueur** et **édition MJ** pour les correctifs manuels.
- Les valeurs suivantes restent visibles dans leur contexte normal côté joueur, mais ne sont plus éditables hors de l’onglet Technique :
  - Accès Focus ;
  - bonus divers de DEF ;
  - bonus divers de Vigueur, Réflexes et Volonté ;
  - bonus divers des compétences principales, y compris Focus ;
  - ajustement des points de compétence ;
  - ajustement des PV maximum.
- Les vrais champs d’édition correspondants sont regroupés dans **Technique → Paramètres MJ — Ajustements manuels**.
- Les champs déjà techniques **Initiative — bonus divers** et **Seuil de dégâts massifs — bonus** restent réservés à Technique.
- Les éléments de jeu courants restent éditables par les joueurs : identité, caractéristiques, rangs de compétence, statut de compétence de classe, niveaux de classe, progression par niveau, PV actuels, dégâts non létaux, points d’action, notes, raccourcis, inventaire et monture.
- Le garde-fou Technique indique maintenant clairement que les valeurs manuelles affichées sur la fiche joueur se modifient ici.
- Aucun changement de formule ou de règle : seules les possibilités d’édition et la présentation changent.

# 1.6.2 — Correction du bloc Focus PJ

- **H0D_Actor-template-PJ v3.64** devient la fiche PJ canonique.
- Le bloc **FOCUS** de l’onglet Personnage conserve désormais toutes les actions Focus : **Scan rapide**, **Scan complet**, **Scan concentré** et **Marquer une pièce**.
- Le bloc Personnage n’affiche plus la gestion de progression de la compétence Focus : seuls **Accès** et le **bonus Focus total** y restent visibles.
- La compétence **Focus** est ajoutée à la table détaillée des compétences avec **INT**, **Rangs**, **Classe / occupation**, **bonus automatique**, **Divers** et **Total**.
- Aucun jet générique Focus n’est ajouté dans la table des compétences : les jets restent centralisés dans le bloc FOCUS de l’onglet Personnage.
- **Accès Focus** est conservé tel quel pour un futur branchement mécanique.
- Aucun changement des formules de bonus Focus ni des règles de scan / marquage.

# 1.6.1 — Simplification de la fiche PJ

- **H0D_Actor-template-PJ v3.63** devient la fiche PJ canonique.
- Suppression de la case **Rite accompli** : purement informative et non utilisée par les calculs.
- Suppression de la case **Bonus situationnel** sous les sauvegardes : elle n'était référencée par aucune formule ; les champs **Bonus divers** restent disponibles pour Vigueur, Réflexes et Volonté.
- Le bloc **Focus** conserve la compétence (Accès, Rangs, Classe / occupation, Divers) et les trois jets de scan : **rapide**, **complet** et **concentré**.
- Le jet **Marquer une pièce** est retiré du bloc Focus afin de ne garder que les scans dans cette zone.
- L'onglet **Technique** reçoit un garde-fou visuel rappelant que ses valeurs sont majoritairement automatiques.
- Suppression du champ legacy visible **ANCIEN CHAMP DONS / TALENTS** (`H0D_Talents_Dons_Capacites`), non référencé ailleurs.
- Les anciennes propriétés déjà présentes sur les PJ ne sont pas effacées de force : la migration sûre conserve les données locales et les anciens champs deviennent simplement des propriétés legacy invisibles.
- Aucun changement des formules de sauvegarde, des coûts de rangs, des bonus Focus ou des règles de jeu.

# 1.6.0 — Améliorations d’équipement à 3 emplacements

- **H0D_Arme v2.7** : ajout de 3 emplacements fixes d’amélioration.
- **H0D_Armure v1.9** : même structure pour armures et boucliers.
- Chaque emplacement contient :
  - état **Installée** ;
  - **Nom** ;
  - **Rang** 1 / 2 / 3 ;
  - **Effet / notes**.
- Ces champs sont volontairement **descriptifs** : ils ne modifient pas encore automatiquement l’attaque, les dégâts ou la DEF.
- La structure est pensée pour rester compatible avec une future gestion par **ItemContainer** ou module d’améliorations.
- Le Template Manager reconnaît cette évolution comme une **migration additive sûre** :
  - uniquement si les seuls champs manquants sont ceux des nouveaux emplacements ;
  - uniquement après installation du template canonique 2.7 / 1.9 ;
  - sauvegarde interne avant reload ;
  - conservation de toutes les anciennes propriétés locales et dynamicTables.
- Le triage d’audit distingue maintenant les **Ajouts additifs sûrs** des mixes réellement suspects.
- Aucun changement des référentiels mécaniques d’armes ou d’armures.

## 1.5.3 — Lisibilité du résultat des jets
- Le total principal affiché sur les cartes H0D passe en **orange Horizon** déjà utilisé dans les fiches (`#e18b3d`).
- Le changement s'applique aux cartes standard `h0d-chat-summary` et à l'ancien bloc `h0d-chat-result`.
- Les styles Foundry résiduels sur le résultat sont neutralisés dans la cellule principale afin d'éviter le petit cartouche gris/blanc.
- Aucun calcul, template ou migration n'est modifié.

## 1.5.2 — Cohérence de l'affichage des pièces neutralisées
- Fiche Machine v3.15 : le panneau de réglage PV ne présente plus tout 0 PV comme une destruction physique.
- Les états Detache et Detruit continuent d'être distingués par la fiche existante.
- Aucune modification des autres templates et aucune migration au démarrage.

## 1.5.1 — Ordre logique du menu Template Manager

- Aucun changement fonctionnel des templates ni des migrations.
- Barre d’actions réorganisée dans l’ordre de travail recommandé :
  1. Audit monde
  2. Exporter audit
  3. Exporter snapshot
  4. Installer/mettre à jour
  5. Synchroniser le monde
  6. Réparer équipements
  7. Migrer versions sûres
  8. Restaurer dernier cycle
  9. Fermer
- Le libellé **Réparer équipements** est conservé.

## 1.5.0 — Ergonomie de la fiche PJ

- Base conservée : v1.4.1.
- PJ canonique : **H0D_Actor-template-PJ v3.62**.
- **Attaques rapides** déplacées au-dessus du groupe Combat / Sauvegardes / Actions héroïques.
- **Repos / récupération** retiré du bloc Actions héroïques et transformé en bloc autonome.
- **Compétences rapides** activées :
  - Perception est toujours présente et non remplaçable ;
  - 3 emplacements personnalisables par le joueur ;
  - choix parmi Acrobaties, Athlétisme, Discrétion, Survie, Technologie ancienne,
    Réparation / Artisanat, Soins et Diplomatie / Intimidation ;
  - chaque raccourci lance directement le d20 et affiche une carte H0D harmonisée.
- Valeurs par défaut des trois raccourcis : Athlétisme, Discrétion, Survie.
- Aucun changement de règle ou de calcul des compétences principales.

## 1.4.1 — Dégâts des attaques Machine

- Correctif de la carte Attaque Machine.
- Le champ `H0D_ArmeMachine_Degats` est maintenant réellement lancé avec Foundry, comme pour les attaques PJ/créatures.
- La ligne publique affiche désormais le résultat : `9 — Contondant` au lieu de `2d6+1 Contondant`.
- La formule d'origine reste visible dans `Détails du jet`.
- Si une ancienne attaque contient une formule non lançable, la carte retombe proprement sur le texte brut au lieu de planter.
- Machine canonique : **v3.14**.

## 1.4.0 — Cartes de jets harmonisées

- PJ v3.61, Créature v1.17, Machine v3.13.
- Référence visuelle : carte Attaque PJ.
- Attaques : Résultat / Verdict / Cible / Dégâts / Effet éventuel / Détails.
- Compétences, aptitudes et sauvegardes : Résultat / Détails, sans verdict.
- Focus, initiative, dégâts, dé d’action et progression harmonisés.
- DEF et marge restent privées MJ.
- Correction des minuscules badges inline-roll CSB dans les cartes H0D.
- Créatures et machines ajoutées aux migrations staleOnly sûres.

## 1.3.0 — Intégrité Machines v2

- Base conservée intégralement depuis la v1.2.2 stable (audit, BAC, migrations sûres, cartes de jets).
- Machine **v3.12** et Pièce détachable **v2.6**.
- Ajout des champs `H0D_Composant_Zone` et `H0D_Composant_Protection_Corps`.
- L'Intégrité max devient une référence fixe : détruire/détacher une pièce ne réduit plus le maximum.
- La fiche Machine affiche automatiquement **CORPS PROTÉGÉ** / **CORPS EXPOSÉ** selon les protections encore actives.
- Le tableau des composants affiche Zone et Protection.
- Les anciennes clés de PV sont conservées pour éviter toute rupture de données.
- Nouvelle API publique `getTemplate(key)` exposée sur `game.modules.get("h0d-template-manager").api` pour les Builders.
- Aucune migration automatique au démarrage.

## 1.2.2 — BAC — détails de jets compacts

- PJ **v3.60**, Créature **v1.16**, Machine **v3.11**.
- Les cartes d’attaque n’utilisent plus « Détails du jet » comme fiche technique de l’arme.
- Détails = d20 + modificateurs effectivement appliqués + bonus total.
- Les modificateurs nuls/contextes sans effet sont masqués.
- Portée affichée uniquement lorsqu’elle applique réellement un malus.
- Type de dégâts, portée nominale, seuil critique permanent et descriptions longues de munitions retirés du détail.
- Munition/élément/cooldown restent en métadonnées compactes seulement lorsqu’ils sont pertinents.
- Critique n’apparaît dans la carte principale qu’en cas de menace réelle.
- Logique de combat, ciblage, DEF privée MJ, anti-blindage, consommation de munitions, critiques et cooldown inchangés.

## 1.2.1 — BAC — refonte visuelle des cartes de jets

- Base de sécurité inchangée par rapport à la 1.2.0 stable.
- Nouveau renderer CSS commun pour les cartes de chat H0D.
- PJ **v3.59** : jet libre, caractéristiques, sauvegardes, initiative, compétences, connaissances, Focus, points d’action, attaques/dégâts et dé de vie harmonisés visuellement.
- Créature **v1.15** : initiative, sauvegardes, aptitudes, attaques et dégâts harmonisés.
- Machine **v3.10** : initiative, sauvegardes, attaques et dégâts harmonisés.
- Les cartes d’attaque conservent toute leur logique actuelle : ciblage, résultat naturel, DEF privée MJ, anti-blindage, portée, munition, critique et cooldown.
- Aucun champ de formulaire n’est ajouté, supprimé ou renommé dans les trois Actors.

# Changelog

## 1.2.0 — stable
- Première version déclarée **stable / production** pour le serveur officiel après validation successive sur le BAC.
- Fige le moteur de migration `staleOnly` validé en v1.1.3 : Actor PJ, armures/boucliers, dons/talents, armes, objets et pièces détachables uniquement.
- Les `missingOnly`, `mixed`, armes-machines et compendiums restent volontairement exclus de la migration sûre.
- Déplace le bouton **Migrer versions sûres** dans la barre d’actions supérieure, à côté de **Réparer équipements**, afin de centraliser les opérations de maintenance.
- Aucun changement du réparateur d’équipements : références et mécaniques déjà validées restent inchangées.
- Aucune migration automatique au démarrage ; snapshots JSON toujours manuels et sauvegardes internes conservées avant mutation.
- Cette 1.2.0 sert de point de retour stable avant les essais 1.2.1+ sur le BAC.

## 1.1.3
- Fiabilise **Migrer versions sûres** pour les Embedded Items CSB : les candidats sont désormais recollectés depuis le monde après chaque `reloadTemplate()` au lieu d'être traités depuis une liste figée.
- Corrige le comportement observé en v1.1.2 où seuls 7 des 35 `staleOnly` restants avaient effectivement migré avant que les références suivantes ne deviennent incohérentes avec la collection embarquée courante.
- Conserve strictement le même scope : Actor PJ, armures/boucliers, dons/talents, armes, objets et pièces détachables **staleOnly** uniquement.
- `missingOnly`, `mixed`, armes-machines et compendiums restent exclus.
- Ré-résolution UUID, sauvegarde interne et vérification stricte des valeurs locales inchangées.
- Ajoute une limite dure de tentatives, évite de retenter en boucle un candidat en erreur et enregistre le nombre de candidats restants dans `safeVersionMigration`.
- Réparateur équipements inchangé.

## 1.1.2
- Étend **Migrer versions sûres** aux familles `item-arme`, `item-objet` et `item-piece` lorsque le document est strictement `staleOnly`.
- Conserve le scope déjà validé : Actor PJ, armures/boucliers et dons/talents.
- Cible le reliquat observé sur le BAC après v1.1.1 : **35 candidats version seule** (15 armes, 18 objets, 2 pièces détachables).
- Les `missingOnly`, `mixed`, armes-machines et compendiums restent exclus ; aucun champ manquant n'est inventé ou rempli par défaut.
- Réutilise la ré-résolution UUID avant/après `reloadTemplate()`, la sauvegarde interne par fiche et la vérification stricte des valeurs locales.
- Le réparateur équipements reste inchangé et les propriétés legacy sont conservées.

## 1.1.1
- Corrige la migration contrôlée des versions sûres en ré-résolvant chaque document par UUID juste avant et juste après `reloadTemplate()`.
- Évite les références Document périmées lorsque CSB recrée un Actor ou ses Embedded Items pendant un reload.
- Ajoute `safeVersionMigration` dans l’export d’audit avec le détail `tenté / réussi / erreur / version avant-après`.
- Scope inchangé : PJ, armures/boucliers et dons/talents `staleOnly` uniquement. Aucun traitement des `missingOnly`, `mixed`, armes, objets, machines/pièces ou compendiums.
- Réparateur équipements inchangé.

# 1.1.0

- Première migration contrôlée des warnings : bouton **Migrer versions sûres**.
- Scope strict : uniquement les fiches monde `staleOnly` des familles **PJ**, **Armures/Boucliers** et **Dons/Talents**.
- Les cas avec propriétés manquantes (`missingOnly` / `mixed`) sont exclus, ainsi que les armes, objets, armes-machines, pièces détachables et compendiums.
- Avant chaque fiche, création d’une sauvegarde interne liée au cycle de migration ; aucun snapshot JSON n’est téléchargé automatiquement.
- La migration recharge le template CSB puis restaure intégralement les valeurs locales top-level : dynamicTables, textes, mécaniques et propriétés legacy existantes restent prioritaires.
- Les éventuelles nouvelles propriétés non-input produites par le template sont conservées.
- Vérification post-migration : les valeurs locales d’origine doivent être identiques et `templateSystemUniqueVersion` doit correspondre à la version canonique ; sinon la fiche est signalée en erreur.
- Après migration, un nouvel audit est lancé automatiquement pour mesurer la baisse réelle des warnings.
- Le réparateur équipements validé en v1.0.10 reste inchangé.

# 1.0.11

- Bloc **Réparer équipements** figé après validation BAC : 0 écart mécanique sur les armes, armures et boucliers référencés.
- Nouveau **triage des avertissements** en lecture seule dans l’audit et l’interface.
- Séparation des fiches en trois catégories : **version seule**, **champs manquants seuls**, **version + champs manquants**.
- Ventilation des warnings par famille de template (PJ, armes, armures, dons/talents, objets, ressources, machines, pièces…).
- Comptage séparé des propriétés legacy informatives et des warnings des compendiums partagés.
- Export d’audit enrichi avec `warningTriage.byTemplate`, `warningTriage.byScope` et `warningTriage.topMissingProps`.
- Aucune migration automatique des 239 fiches à examiner dans cette version : la v1.0.11 sert à définir les prochains lots de réparation sans masquer les écarts structurels.

# v1.0.10

- Correctif ciblé de la `dynamicTable` des traits d’armes à partir du diagnostic runtime v1.0.9.
- Les traits d’armes sont désormais réinjectés dans le format natif CSB 6 : objet indexé (`"0"`, `"1"`, …), avec `$deleted: false` et les cinq champs de ligne attendus.
- La **Hache de chasse** peut à nouveau être réparée : sa ligne vide doit être remplacée par le trait canonique `OUTIL`.
- La comparaison d’audit reste normalisée en tableau ; seul le format d’écriture runtime change.
- Le réparateur armures/boucliers validé reste inchangé.
- Le diagnostic des dynamicTable introduit en v1.0.9 est conservé dans l’audit pour vérification.
- Aucun nettoyage global des warnings n’est effectué.

# v1.0.9

- Version de diagnostic ciblée sur `H0D_Arme_Traits_Table` après l’échec reproductible de la v1.0.8 sur la Hache de chasse.
- L’audit exporte désormais, pour chaque mismatch de traits d’arme, la structure runtime brute de la table courante, de la référence de compendium, de l’override canonique et du template d’arme.
- L’audit recherche également jusqu’à 3 armes de référence possédant réellement le trait `OUTIL` et exporte leur dynamicTable brute comme exemples de structure CSB valide.
- Sécurité : lorsqu’une arme ne diffère **que** par `H0D_Arme_Traits_Table`, le bouton Réparer équipements la laisse volontairement intacte en v1.0.9 ; aucune nouvelle tentative destructive n’est faite tant que le format runtime exact n’est pas identifié.
- Les réparations scalaires d’armes restent disponibles si un autre écart mécanique apparaît.
- Le réparateur armures/boucliers validé reste inchangé.
- Aucun nettoyage global des warnings n’est effectué.

# v1.0.8

- Correctif ciblé sur `H0D_Arme_Traits_Table` : suppression explicite de la propriété racine avant réinjection de la table canonique.
- Corrige le cas de la **Hache de chasse**, qui conservait une ligne vide au lieu du trait `OUTIL` après réparation.
- Le réparateur armures/boucliers validé en v1.0.7 est laissé inchangé.
- Le bouton unique **Réparer équipements** reste dans la barre supérieure et continue de traiter armes + armures + boucliers en une seule action.
- Aucun nettoyage des 147/159 warnings n'est inclus dans cette version : ce chantier reste séparé.

# v1.0.7

- Bouton unique **Réparer équipements** déplacé dans la barre de menus supérieure ; suppression des deux boutons dupliqués dans les sections Armes et Armures/Boucliers.
- Correction du remplacement des `dynamicTable` de traits : purge explicite des anciennes lignes avant écriture, afin d'empêcher l'accumulation de doublons à chaque réparation.
- Armes : la table `H0D_Arme_Traits_Table` est maintenant remplacée exactement, ce qui corrige notamment le trait `OUTIL` de la Hache de chasse.
- Armures/boucliers : reconstruction canonique des traits gérés et résistances élémentaires, avec conservation des traits locaux supplémentaires hors référentiel.
- Audit armures : les traits locaux hors référentiel ne créent plus de faux mismatch ; les doublons/variantes des traits gérés restent détectés.
- La réparation d'armure n'écrase pas les champs narratifs et ne supprime pas encore les propriétés legacy : elles restent pour le chantier séparé des warnings.

# v1.0.6

- Réparation combinée des armes + armures/boucliers référencés.
- Comparaison numérique des armes normalisée (ex. `"1"` = `1`).
- Hache de chasse : mécanique canonique issue du classeur (1d8 tranchant, FOR, trait OUTIL), sans dépendre d’un ancien compendium.
- Armures/boucliers : réparation des champs mécaniques validés uniquement ; narratif, MAX DEX et résistance texte non écrasés.
- Les traits locaux supplémentaires non couverts par le référentiel sont conservés.
- Sauvegarde interne par document réparé ; aucun snapshot JSON automatique.

# 1.0.5

- Référentiel armures/boucliers reconstruit depuis `référence_arme-armure(1).xlsx` : 8 références.
- Correction du mapping `Malus/bonus mobilité` : les valeurs `-1.5`, `0`, `+3` alimentent désormais uniquement `H0D_Armure_Malus`.
- Ajout de `MAX DEX` au référentiel comme information de référence non destructive : le template Armure v1.8 n'a pas encore de champ dédié, donc ce point n'est ni compté comme écart ni réparé.
- La colonne texte `Résitances` devient informative (`ENTRAVE`, `DECTECTION`, `TRANCHANT`, etc.) et n'est plus interprétée comme résistance élémentaire.
- Les résistances Feu / Gel / Choc / Acide restent comparées via les traits élémentaires du template.
- Parsing des traits clarifié : valeurs/paramètres nommés, traits personnalisés via `autre`, et `MODULAIRE : 1 / DEF` conservé distinct de `RENFORCE`.
- L'armure d'Aloy conserve également `TRANCHANT` dans les informations de référence : MODULAIRE n'est donc pas assimilé à un simple +1 DEF.
- Alias sûr `Tenue légère` → `Armure légére` ajouté ; `Tenue de dresseur` reste hors référentiel.
- Audit armures/boucliers toujours en lecture seule : aucune réparation automatique activée dans cette version.
- Snapshots JSON toujours manuels ; aucune sauvegarde exportée sur un simple audit/clic.

## 1.0.4
- Snapshots JSON automatiques supprimés : le bouton **Exporter snapshot** reste disponible manuellement.
- Synchronisation et réparation conservent les sauvegardes internes par document, sans téléchargement automatique.
- Référentiel armes étendu à **21 noms** avec la `Hache de chasse`.
- Nouveau référentiel **Armures & Boucliers** dérivé de `template_arme.xlsx` / onglet `Bouclier + Armures` : 7 références.
- Audit armures/boucliers limité aux Actors utilisant le template PJ, sans traitement spécial Aloy.
- Comparaison mécanique : type, zone, DEF, charge, mobilité, résistances et traits déterministes.
- Origine/description sont suivies séparément comme différences narratives.
- Les ambiguïtés Excel sont exposées comme `sourceWarnings` et exclues de la comparaison détaillée des traits.
- Aucune réparation armure/bouclier en v1.0.4 : étape de sécurisation en lecture seule.

## 1.0.3
- `H0D_Actor-template-PJ` passe en **v3.58**, construit directement sur l’export `v3.57_update` remanié dans Foundry.
- La disposition manuelle du MJ devient la base canonique : les grandes zones sont de vraies tables CSB, sans dépendre d’un faux positionnement CSS.
- Inventaire PJ : vrai 2×2 **Armes | Armures / Objets | Munitions**, puis Ressources en pleine largeur.
- Chargement Monture/Machine : même 2×2, avec ajout de **Munitions transportées** en bas à droite et Ressources transportées en pleine largeur dessous.
- Les vues d’Items sont réellement compactées :
  - Armes : Équipée / En main / Charge / Ranger.
  - Armures : DEF / Portée / Charge / Ranger.
  - Objets : Qté / Charge / Actif / Ranger.
  - Munitions : Active / Qté / Charge / Ranger.
  - Ressources : Type / Qté / Charge / Ranger.
  - Monture : informations limitées au transport, à la charge et au transfert.
- `H0D_Arme_Active` est conservé mais son sens joueur est désormais **En main**. Attaques rapides = arme stockée sur le PJ + En main.
- Ranger une arme sur la monture désactive `En main` et `Équipée`; armures/objets/munitions rangés cessent aussi d’être actifs.
- Le calcul de charge de la monture compte le container Munitions une seule fois et les objets de monture excluent explicitement les munitions.
- Historique d’édition CSB de l’export utilisateur nettoyé avant intégration ; ID du template et clés mécaniques conservés.

## 1.0.2
- `H0D_Actor-template-PJ` passe en **v3.57**.
- `H0D_Arme` passe en **v2.6** ; la clé `H0D_Arme_Active` est conservée, mais le libellé **Prête** devient **En main**.
- Onglet `Personnage` : Combat + Sauvegardes passent sur deux colonnes et Actions héroïques / récupération prennent toute la largeur afin d'éviter les débordements constatés en jeu.
- Onglet `Inventaire & monture` : ordre fixé à **Armes | Armures** puis **Objets | Munitions** ; **Ressources** passent en pleine largeur dessous.
- Même disposition pour le chargement de la monture/machine.
- Les munitions stockées sur la monture sont séparées des objets dans un container dédié ; le calcul de charge de monture les comptabilise explicitement, sans double comptage.
- Vues d'inventaire allégées :
  - Armes PJ : Équipée / En main / Charge / Ranger.
  - Armures PJ : DEF / Portée / Charge / Ranger.
  - Objets PJ : Qté / Charge / Actif / Ranger.
  - Munitions PJ : Active / Qté / Charge / Ranger.
  - Ressources : Type / Qté / Charge / Ranger.
  - chargement Monture : informations réduites à ce qui sert au transport et au transfert.
- Les anciennes colonnes et formules utiles sont conservées dans le template lorsqu'elles participent à une mécanique ; seule leur visibilité est réduite.
- Aucun rappel de la monture n'est ajouté à l'onglet `Personnage`.

## 1.0.1
- Refonte visuelle légère Horizon de la fiche PJ uniquement (`H0D_Actor-template-PJ v3.56`).
- Onglets joueur : **Personnage**, **Compétences & progression**, **Inventaire & monture** ; onglet **Technique** toujours réservé au MJ.
- `Personnage` recentré sur les usages de table : identité, niveau, PV/DEF/saves, caractéristiques, attaques rapides, compétences rapides et Focus.
- `Compétences & progression` affiche les compétences détaillées avec modificateur de caractéristique, bonus automatiques/dons, rangs, divers et total ; dons/talents, classes, progression par niveau et notes sont conservés.
- Boutons de transfert `→ Monture` / `→ PJ` basés sur `H0D_Stockage`, sans duplication d'Item.
- Nouveau panneau **Attaques rapides** : affiche les armes portées par le PJ dont l'état `H0D_Arme_Active` est actif et réutilise la mécanique d'attaque existante.
- Rendu des jets de caractéristiques, sauvegardes, compétences et dégâts enrichi dans le chat ; logique mécanique inchangée.
- Style Horizon léger ajouté au PJ et aux cartes de chat. PNJ, créatures et machines restent fonctionnels et inchangés visuellement.

## 1.0.0
- Interface ApplicationV2 du Template Manager restaurée et stabilisée.
- 11 templates canoniques embarqués.
- Audit, snapshots, synchronisation, restauration, conformité des armes et gestion Legacy.
