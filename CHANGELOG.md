## 1.7.25 — Cartes d'attaque unifiées

- Remplace le vieux rendu inline clair de `H0D — Attaques` par les cartes modernes `h0d-chat-card h0d-chat-attack`.
- Utilise la même structure visuelle pour PJ, Créatures/PNJ/Factions et Machines.
- Conserve une classe de type d'Actor pour les accents visuels : PJ / Créature / Machine.
- Le message privé MJ DEF / marge / verdict utilise désormais la même famille de cartes.
- L'ancienne macro officielle **H0D — Attaques ennemi v1.1** est automatiquement reliée au moteur commun.
- L'ancien code de cette macro est sauvegardé dans `flags.h0d-template-manager.legacyEnemyAttackBackup` avant conversion.
- Les macros personnelles ne correspondant pas à la signature officielle v1.1 ne sont pas modifiées.
- Étend le smoke test aux classes de cartes modernes et interdit le retour de l'ancien fond inline `#f5f5f5`.

## 1.7.24 — Interface Actor commune

- PJ passe en **v3.73**, Créature / PNJ en **v1.28**, Machine en **v3.18**.
- Les trois templates exposent `H0D_Health`, `H0D_Defense`, `H0D_Perception` et `H0D_Detection` dans `system.attributeBar`.
- `H0D_Health` conserve son comportement existant et reste la barre 1 du prototype Token.
- `H0D_Defense`, `H0D_Perception` et `H0D_Detection` sont des passerelles techniques non éditables et ne remplacent aucun champ métier.
- Le PJ calcule DET comme `10 + H0D_Skill_Perception_Total`.
- Ajoute `scripts/h0d-common-stats.js` avec API commune et fallbacks legacy.
- Corrige H0D — Attaques : la DEF de cible passe par `H0D_Defense`; un PNJ avec seulement `H0D_Creature_DEF_Base` reste comparable via recalcul de secours.
- L'API monde expose `commonAttribute`, `commonStat`, `commonHealth` et `commonStats`.
- L'audit détecte `common-interface-missing` et compte les réparations dans `commonInterfaceCandidates`.
- Une interface commune manquante peut déclencher un reload sûr même si la version du document est déjà canonique.
- Les backups internes / Restaurer données incluent désormais `system.attributeBar`.
- Ajoute un test CI dédié à l'interface commune et étend le smoke test Attaques à une vraie comparaison de DEF.
## 1.7.23 — Récupération simple des munitions

- Ajoute un snapshot automatique des lots de munitions physiques des PJ au début du combat.
- Détecte à la fin du combat les quantités réellement dépensées via `H0D_Objet_Quantite`.
- Suit en V1 les familles Flèche, Carreau et Projectile / arme de jet.
- Ouvre automatiquement une fenêtre MJ à la fin du combat avec trois contextes : Faune, Faction, Machines.
- Taux standard : 75 % / 60 % / 25 %.
- Taux renforcé : 90 % / 80 % / 60 %.
- Le nombre de munitions renforcées dépensées peut être saisi par lot ; le reste est standard.
- Chaque munition effectue un vrai jet d100 de récupération.
- Les munitions récupérées sont rendues au lot d'origine sans dépasser le stock de départ.
- Une récupération fermée reste en attente et est reproposée au chargement suivant ou avant le prochain combat.
- Ajoute l'API `game.h0dTemplateManager.recoverAmmo()` et `ammoRecoveryRates()`.
- Ajoute une protection contre les doubles dialogues `combatEnd` / `deleteCombat`.
## 1.7.22 — Taille physique des Créatures / PNJ

- Ajoute `H0D_Creature_Taille` au template Créature / PNJ **v1.27**.
- Valeurs disponibles : Infime, Minuscule, Très petite, Petite, Moyenne, Grande, Très grande, Gigantesque, Colossale.
- Valeur par défaut : **Moyenne**.
- Le champ est indépendant de la Menace et n'altère aucune formule de combat.
- `H0D_Creature_Taille` est ajouté à l'allowlist des migrations additives sûres.
- Prépare l'intégration avec H0D Creature Builder 0.3.0 pour le redimensionnement automatique des tokens.
- Ajoute un test CI dédié au champ de taille.
## 1.7.21 — Propagation sûre de la barre prototype H0D_Health

- Corrige l'installation des templates Actor déjà présents : `prototypeToken.bar1` est désormais synchronisé avec le JSON canonique.
- Ajoute le diagnostic `prototype-bar-mismatch` dans l'audit des Actors monde.
- Un template Actor dont la version système est correcte mais dont la barre prototype est ancienne n'est plus déclaré « Canonique ».
- Ajoute les candidats `prototypeBarCandidates` au triage et à l'activation de la migration sûre.
- Permet de réparer une ancienne barre prototype sans incrémenter artificiellement la version du template.
- La synchronisation globale applique elle aussi la barre prototype canonique.
- Les sauvegardes internes et la restauration du dernier cycle prennent maintenant en compte `prototypeToken.bar1`.
- Aucun changement de structure : PJ v3.72, Créature/PNJ v1.26 et Machine v3.17 restent les versions canoniques.
## 1.7.20 — Barre de santé commune CSB

- Ajoute une barre complexe **`H0D_Health`** aux trois templates Actor.
- PJ **v3.72** : valeur `H0D_PV_Actuels`, maximum `H0D_PV_Max_Calc`.
- Créature / PNJ **v1.26** : valeur `H0D_Creature_PV_Actuels`, maximum `H0D_Creature_PV_Max_Calc`.
- Machine **v3.17** : valeur `H0D_Machine_PV_Actuels`, maximum `H0D_Machine_PV_Max_Calc`.
- Les trois barres sont des barres complexes CSB non éditables directement depuis le Token.
- Le `prototypeToken.bar1` des trois templates pointe maintenant vers `attributeBar.H0D_Health`.
- Aucun calcul de PV, de dégâts ou de maximum n'est modifié.
- Les trois changements de templates sont version-only et restent compatibles avec la migration sûre existante.
- Ajoute un test CI dédié qui impose le même nom de barre et les bonnes formules sur les trois templates.
## 1.7.19 — Récupération sûre depuis backup pré-reload

- Ajoute une récupération contrôlée des champs manquants depuis le flag historique `world.h0dSafeReloadBackupV2`.
- Le backup n'est accepté que s'il correspond au même UUID et au même template que le document courant.
- Les clés déjà allowlistées continuent d'utiliser uniquement leur valeur neutre canonique.
- Les clés normalement exclues car elles nécessitent un choix mécanique peuvent être restaurées uniquement si leur valeur exacte existe dans ce backup fiable.
- Le rapport d'audit expose désormais `safeRecovery` et la migration trace les `recoveredKeys`.
- Le contrôle post-migration vérifie que chaque valeur récupérée est encore identique après écriture.
- Corrige le reliquat BAC **Griffes / Morsure** sans hardcoder leur nom ni leur UUID.
- Les compendiums partagés restent hors migration automatique.

## 1.7.18 — Réaudit silencieux après maintenance

- Après **Synchroniser le monde**, relance automatiquement un audit complet en arrière-plan sans dialogue ni export.
- **Réparer équipements** fait de même après une réparation effective afin de recalculer immédiatement les écarts restants.
- Les boutons **Réparer équipements** et **Migrer données sûres** restent disponibles à partir du rapport silencieux, même si l'état global reste marqué **Audit final recommandé**.
- La migration sûre conserve son réaudit interne et préserve désormais ce rapport pour les actions suivantes.
- Le réaudit silencieux ne remplace jamais l'audit final explicite du MJ : le bouton principal reste **Audit final recommandé** jusqu'à son lancement manuel.
- Une action annulée ou sans écriture ne déclenche aucun réaudit.
- Tests de non-régression adaptés au nouveau workflow.

## 1.7.17 — Cycle de maintenance et audit final

- Réorganise la barre autour du flux **Audit → Snapshot → maintenance → Audit final**.
- Retire les boutons **Exporter audit** et **Fermer** de la barre supérieure.
- L'audit propose désormais directement l'export JSON du rapport calculé, sans relancer un deuxième audit.
- Conserve l'API `exportAudit` : sans rapport fourni, elle continue à produire un audit frais avant export.
- Toute écriture effective (installation/mise à jour, synchronisation, réparation, migration, restauration ou retrait legacy) invalide l'audit courant et affiche **Audit final recommandé**.
- Les diagnostics armes/armures ne sont plus relancés silencieusement à l'ouverture du manager ; les actions de réparation/migration dépendent du dernier audit courant.
- Renomme **Exporter snapshot** en **Snapshot de sécurité** et **Restaurer dernier cycle** en **Restaurer données**.
- Le réaudit interne de migration reste utilisé pour son bilan, mais n'empêche pas l'audit final explicite du MJ.
- Ajoute un test statique de non-régression du workflow de maintenance.

## 1.7.16 — Perception, détection passive et capteurs spécialisés

- **Créature / PNJ v1.25** : Perception devient une statistique de combat dédiée, avec jet actif, **DET = 10 + PER**, portée normale et sens spécial optionnel.
- **Machine v3.16** : ajoute Perception de base, modificateur temporaire, PER effective, DET et portée normale.
- L'état **Aveuglée** applique automatiquement **-4 à la Perception machine**.
- Les composants actifs peuvent contribuer à la Perception générale ; leur destruction ou détachement retire automatiquement ce bonus.
- **Pièce détachable v2.7** : ajoute les capteurs spécialisés (mode, cible, portée, bonus éventuel de PER générale).
- Le radar spécialisé n'est pas traité comme un bonus universel : une pièce peut par exemple cibler « machines au sol » ou « humains » sans améliorer la détection générale.
- Migration additive sûre des nouveaux champs sur les acteurs et pièces existants.
- Le template PJ reste en **v3.71** : sa compétence Perception existante suffit ; la DET et la portée humaine standard sont consommées par les outils d'affichage sans migration de fiche PJ.

## 1.7.15 — Faire 10 / Faire 20 sur les compétences PJ

- **PJ v3.71** : ajoute des commandes **10** et **20** directement sur les compétences.
- Couverture : compétences fixes, Focus, huit Artisanats, Connaissances dynamiques, Perception rapide et trois raccourcis de compétence.
- **Faire 10** calcule simplement `10 + bonus total de compétence` sans lancer de dé.
- **Faire 20** calcule simplement `20 + bonus total de compétence` sans lancer de dé.
- Les cartes de chat rappellent les conditions d’usage d20 Modern au lieu de les imposer mécaniquement :
  - Faire 10 : hors menace/distraction ; normalement pas avec une compétence utilisée sans entraînement, sauf exception MJ ;
  - Faire 20 : temps suffisant, hors menace/distraction, aucune conséquence en cas d’échec, vingt fois le temps normal.
- Le message **Faire 20** précise explicitement qu’il ne s’agit pas d’un **20 naturel**, afin de ne pas déclencher les effets maison liés aux 20 naturels.
- Aucun champ de données PJ n’est ajouté ou supprimé : la structure des inputs v3.70 et v3.71 est identique.
- La mise à niveau des PJ existants est donc une **migration de version uniquement** ; rangs, bonus d’origine, compétences de classe, historiques et données locales sont conservés.
- Les jets normaux au d20 restent inchangés.
- Ajoute un test de régression dédié vérifiant les 23 commandes Faire 10 / Faire 20 et l’absence de modification du schéma de données PJ.

## 1.7.14 — Refonte des compétences PJ : Artisanat séparé de Réparation

- **PJ v3.70** : sépare définitivement **Réparation** et **Artisanat**.
- Ajoute huit spécialités d’Artisanat à rangs indépendants : **Chimique, Électronique, Mécanique, Pharmaceutique, Structurel, Arts visuels, Écriture et Autre**.
- Chaque spécialité possède ses propres rangs, son statut de compétence de classe, son bonus d’origine permanent, ses divers et son jet.
- **Artisanat — Autre** reste volontairement manuel : aucune classe de héros de base ne l’accorde automatiquement.
- Les compétences de classe automatiques sont alignées sur les décisions finales de campagne :
  - Fort : Athlétisme, Réparation, Artisanat Structurel ;
  - Rapide : Acrobaties, Discrétion, Artisanat Mécanique ;
  - Robuste : Athlétisme, Perception, Survie, Artisanat Mécanique et Structurel ;
  - Intelligent : Technologie, Réparation, toutes les Connaissances et les sept Artisanats standards ;
  - Dévoué : Perception, Survie, Soins, toutes les Connaissances, Artisanat Pharmaceutique, Arts visuels et Écriture ;
  - Charismatique : Diplomatie, Artisanat Arts visuels et Écriture.
- **Technologie** n’est donc plus automatiquement compétence de classe du Héros Dévoué.
- Le multiclassage conserve la règle simplifiée H0D : dès qu’une compétence est de classe via une classe possédée ou via l’acquisition manuelle, son coût est de 1 point par rang et son plafond est niveau + 3 ; sinon coût 2 et plafond hors-classe.
- Ajoute un champ **Orig.** distinct et persistant (0/1) sur les compétences fixes, Focus et Artisanats ; les Connaissances disposent du même bonus au niveau de chaque ligne. Ce bonus représente le +1 d’occupation/origine déjà acquis et n’est jamais recalculé rétroactivement après multiclassage.
- Les trois raccourcis de compétences peuvent sélectionner les huit Artisanats.
- Le calcul **Rangs de compétences investis** inclut les huit nouvelles spécialités.
- Le moteur de passage de niveau, les bases de points de compétence, les DV, les rangs de classe et l’historique de niveau restent inchangés.
- **Migration sûre** : 43 nouveaux champs racine du PJ sont allowlistés avec valeurs neutres (0, faux ou vide). Aucun rang d’Artisanat, statut de classe ou bonus d’origine n’est deviné à partir des anciennes données.
- Les lignes de Connaissances existantes sont conservées ; leur nouveau bonus d’origine commence neutre.
- Ajoute un test de régression dédié aux mappings de classes, aux huit Artisanats, aux bonus d’origine, aux raccourcis et au budget de rangs.

## 1.7.13 — Rollback de niveau : remplacement exact de l’historique

- Corrige **Annuler le dernier niveau** sur les PJ.
- En 1.7.12, les rangs de classe, PV, dégâts non létaux et PA étaient restaurés, mais la dynamicTable `H0D_Skill_Progression` était fusionnée par Foundry/CSB : la ligne du niveau annulé pouvait donc rester visible.
- Le rollback supprime désormais explicitement `H0D_Skill_Progression` puis réinjecte la sauvegarde exacte.
- Vérifie après restauration que le contenu de l’historique correspond exactement au snapshot ; sinon l’opération remonte une erreur au lieu de prétendre avoir réussi.
- La sauvegarde `lastLevelUpBackup` est effacée après un rollback réussi afin d’éviter une seconde restauration involontaire du même état.
- Ajoute un test de régression reproduisant précisément le cas « niveau 3 ajouté puis rollback vers un historique de deux lignes ».
- Aucun template ni calcul de personnage n’est modifié ; aucune migration de données n’est nécessaire.

## 1.7.12 — Passage de niveau automatisé

- **PJ v3.69** : simplifie fortement la montée de niveau côté joueur.
- Le joueur choisit uniquement la **classe du nouveau niveau** puis clique sur **VALIDER LE NIVEAU**.
- Le moteur :
  - vérifie la continuité de l’historique et la cohérence des rangs de classe ;
  - lance automatiquement le bon DV (d10 Robuste, d8 Fort/Rapide, d6 Intelligent/Dévoué/Charismatique) ;
  - mémorise le **modificateur d’INT du niveau** dans l’historique ;
  - calcule et enregistre les points de compétence ;
  - ajoute la ligne de progression ;
  - resynchronise les six rangs de classes ;
  - renouvelle les points d’action à `5 + floor(niveau/2)` ;
  - remet les dégâts non létaux à 0 ;
  - restaure les PV actuels au nouveau maximum, le passage de niveau étant effectué en refuge sûr.
- Les **blessures graves et notes narratives ne sont jamais supprimées**.
- Les six compteurs de classes quittent le flux joueur et sont déplacés dans **Technique**, en lecture seule, comme synthèse calculée de l’historique.
- La table **PROGRESSION PAR NIVEAU — ÉDITION MJ** reste la source de vérité et peut être corrigée manuellement.
- Ajoute en Technique :
  - **Synchroniser les rangs** depuis l’historique ;
  - **Annuler le dernier niveau**, basé sur une sauvegarde créée juste avant la validation automatique ;
  - un indicateur de cohérence historique / rangs.
- Le gros historique 1–20 et le détail purement technique sont retirés de la vue joueur pour alléger la fiche.
- Limites intégrées : niveau de campagne 15 et rang 10 maximum par classe de héros de base.
- **Migration sûre** : corrige les faux positifs vus en 1.7.11. Les contrôles de préservation comparent désormais les champs réellement éditables ; les recalculs CSB (totaux, itemContainers, labels calculés) ne sont plus signalés comme des valeurs locales altérées.
- Ajoute des tests CI dédiés au moteur de passage de niveau et maintient les tests d’automatisation équipement sur le PJ canonique 3.69.

## 1.7.11 — Confort MJ et améliorations automatisées

- **Attaques ennemies privées** : les attaques lancées par une Créature/PNJ/Faction ou une Machine via `H0D — Attaques` sont désormais envoyées uniquement aux MJ. Les attaques des PJ restent publiques.
- **Créature v1.24** : ajoute un `DD capacités` très visible dans le bloc Combat, avec un DD conseillé issu du barème de Menace de la campagne et un DD utilisé qui prend la valeur saisie lorsqu'elle est non nulle.
- **Arme v2.8** : chaque emplacement d'amélioration gagne `Type` + `Valeur`. Les types numériques `Attaque` et `Dégâts` sont automatiquement appliqués lorsque l'amélioration est installée. Le Rang reste indépendant de la valeur mécanique.
- **Armure v2.0** : chaque emplacement d'amélioration gagne `Type` + `Valeur`. Les bonus compatibles sont automatisés tant que l'armure est active : DEF, Initiative, Vigueur, Réflexes, Volonté, Vitesse, PV max et compétences PJ.
- **PJ v3.68** : intègre les bonus d'amélioration des armes/armures dans les totaux et jets correspondants.
- **Dons/Talents** : aucun nouveau schéma n'est nécessaire ; les agrégats existants (DEF, sauvegardes, initiative, vitesse, PV, attaque/dégâts, mêlée/distance et compétences) sont conservés et couverts par le nouveau test de non-régression.
- **Migration sûre en une passe** : corrige le cas observé sur le serveur officiel où une fiche à la fois ancienne et incomplète nécessitait deux exécutions. Le manager fait désormais le reload de version puis complète immédiatement les champs additifs allowlistés, sans modifier les valeurs locales.
- Les nouveaux champs additifs neutres sont allowlistés : `H0D_Creature_DD_Capacites`, ainsi que `Type` / `Valeur` des trois améliorations d'armes et d'armures.
- Les améliorations déjà présentes conservent `Installée / Nom / Rang / Effet`. Les nouveaux champs commencent volontairement à `Aucun / 0` : aucun bonus n'est inventé automatiquement à partir du texte libre.
- Ajoute des tests CI pour la confidentialité des attaques ennemies, les bonus d'amélioration et la conservation des agrégats Dons/Talents.

## 1.7.10 — Dernière passe additive sûre du monde

- Étend l'allowlist `additive-safe` aux champs neutres validés sur l'audit BAC post-1.7.8.
- Objets : `H0D_Objet_Sous_Type`, `H0D_Objet_Recharge`, `H0D_Objet_Origine`, `H0D_Objet_Compatibilite`, `H0D_Objet_Munition_Effet_Court`.
- Dons/talents : `H0D_DT_Connaissance_Cible_Perso`.
- Armes : `H0D_Arme_Zone`, `H0D_Arme_Recharge`, `H0D_Arme_Cout`, en plus des champs d'amélioration déjà autorisés.
- Armures : `H0D_Armure_Malus`, `H0D_Armure_Etat`, en plus des champs d'amélioration déjà autorisés.
- Sur l'audit BAC de référence : **50 candidats sûrs sur 52 warnings**.
- **Griffes** et **Morsure** restent exclues : `H0D_Arme_Categorie` et `H0D_Arme_Origine` manquent et ne sont pas inventées automatiquement.
- Aucun champ nécessitant un choix mécanique n'est ajouté par défaut ; les compendiums restent hors de cette migration.
- Conserve toutes les sécurités de la 1.7.8 : valeur par défaut lue dans le template canonique, sauvegarde interne, contrôle des propriétés existantes et rollback sur erreur.
- Inclut également les changements déjà publiés en 1.7.9 pour le template Créature v1.23 / Pillards Rouges.

## 1.7.9 — Fiches ordinaires Pillards Rouges

- Créature v1.23 : scores SRD visibles pour la faction `PillardsRouges` (Caravanes Libres et PNJ héroïques restent couverts).
- Aucun changement aux formules ou champs numériques des fiches, ni aux autres templates.
- Nouvelle version installable/synchronisable volontairement, avec même ID de template.

## 1.7.8 — Migration additive directe et audit frais
- Corrige les migrations `additive-safe` lorsque la fiche porte déjà la version canonique du template : plus de `reloadTemplate()` dans ce cas.
- Ajoute directement uniquement les clés manquantes explicitement allowlistées, avec leurs valeurs par défaut lues depuis le template canonique.
- Vérifie qu'aucune propriété locale existante n'a changé et que toutes les clés attendues ont bien été créées.
- En cas d'échec d'un ajout direct, restaure exactement les `system.props` capturées avant tentative.
- Les migrations impliquant une vraie différence de version conservent le chemin `reloadTemplate()`.
- **Exporter audit** force désormais un nouvel audit avant l'export pour éviter les rapports mémorisés périmés.
- Aucun template ni référentiel mécanique n'est modifié.

## 1.7.7 — Correction du dialogue de fin de migration
- Remplace le dialogue final basé sur `DialogV2.input()` par `DialogV2.prompt()`, adapté à une fenêtre informative sans champ de saisie.
- Ajoute un fallback de notification si le dialogue final ne peut pas être rendu.
- Si l'interface affiche encore un bouton de migration à partir d'un audit périmé mais qu'aucun candidat réel n'existe, une fenêtre **Aucune migration nécessaire** est désormais affichée et le monde est réaudité.
- Aucun template, calcul, référentiel ni périmètre de migration n'est modifié.

## 1.7.6 — Bilan explicite de migration sûre
- Après **Migrer données sûres**, un réaudit est exécuté automatiquement puis une fenêtre de bilan reste affichée jusqu'à fermeture.
- Le bilan distingue explicitement **MIGRATION RÉUSSIE** et **MIGRATION À VÉRIFIER**.
- Il affiche le nombre de fiches migrées, les erreurs, les candidats sûrs restants, les warnings du monde et les erreurs du monde après réaudit.
- Le toast de fin est rendu plus explicite.
- L'export d'audit continue d'inclure le détail complet sous `safeVersionMigration`.
- Aucun template, calcul, référentiel mécanique ou périmètre de migration n'est modifié.

## 1.7.5 — Migration sûre des champs additifs déjà en version canonique
- Le migrateur accepte désormais les `missing-props` explicitement allowlistés des armes et armures même lorsque `templateSystemUniqueVersion` correspond déjà à la version canonique.
- Le triage d'audit classe ces cas en **Ajout sûr** au lieu de les laisser dans les `missingOnly` non migrables.
- Après `reloadTemplate()`, le manager vérifie explicitement que tous les champs additifs attendus ont été créés ; sinon la fiche est signalée en erreur et n'est pas retentée en boucle.
- Les valeurs locales existantes, dynamicTables et propriétés legacy restent prioritaires et sont restaurées après reload ; une sauvegarde interne est créée avant chaque fiche.
- L'action est renommée **Migrer données sûres** pour refléter qu'elle ne traite plus seulement des changements de version.
- Les autres champs manquants, les mixes non autorisés, les armes-machines et les compendiums restent exclus.
- Aucun template, calcul d'attaque, règle de combat ou référentiel mécanique n'est modifié.

## 1.7.4 — Scores SRD des PNJ héroïques uniques
- Créature v1.22 : panneau Scores SRD visible pour les membres du Conseil marqués Héroïque, ainsi que pour les Caravanes Libres.
- Libellé de niveau distinguant Ordinaire / Héroïque, sans confusion avec la Menace/CR.
- Aucun changement aux formules, armes, fiches PJ et macro H0D — Attaques.

## 1.7.3 — Niveau PNJ ordinaire distinct de la Menace
- Créature v1.21 : libellé séparant niveau du PNJ ordinaire et Menace / CR sur les Caravanes Libres.
- Aucun autre champ ni calcul des fiches Créature n'est modifié.
- Prend en charge la correction d'équilibrage du Faction Builder 0.3.2 (CR = niveau − 1).

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
