# Proposition ergonomique — template PJ v3.75 (BAC uniquement)

**État : prototype importable / validation statique réalisée / validation Foundry non effectuée.**

## Sources et gestion des versions

- Source de référence : `data/templates/H0D_Actor-template-PJ-v3.74.json`, conservée intacte.
- Base effectivement modifiée : `data/templates/H0D_Actor-template-PJ-v3.75.json` déjà publiée (corrections des jets d20 / Faire 10 / Faire 20 conservées).
- Proposition autonome : `proposals/H0D_Actor-template-PJ_v3.75.json`, sans modification du registre du Template Manager.
- Feuille de style complémentaire : `styles/h0d-template-manager.css` sur la branche de proposition uniquement.
- **La v3.75 existante de `main` n'a pas été remplacée.** Un numéro de version de production supérieur à 3.75 sera nécessaire avant fusion et publication, après validation.

## Inventaire technique

- 4 onglets dans leur ordre et avec leurs clés historiques.
- 839 composants dans le template publié ; 845 dans la proposition (1 panneau de statut + 5 étiquettes non éditables).
- 419 clés de composants distinctes (contrôle exhaustif incluant composants internes), aucune collision.
- 67 messages d'action / de jet préexistants inchangés (comparaison textuelle intégrale).
- 14 `itemContainer` préservés strictement, sans altération de leurs filtres, colonnes cachées ou transferts.
- 2 `dynamicTable` conservés : Connaissances et historique de progression.
- 286 étiquettes à formule préexistantes identiques ; cinq valeurs calculées nouvelles dans l'en-tête.
- Même identifiant du template CSB `uympqkQiS6MHHmIx`; système source CSB 6.0.2, Foundry v14.
- Dépendance technique : `globalThis.H0DLevelUp` pour valider, synchroniser et annuler les niveaux.

## Interventions

| Priorité | Avant | Après | Effet / risque | Contrôle |
|---|---|---|---|---|
| P1 | En-tête titre + jet libre | PV actuels/max, DEF, INIT, PA restantes/max, FOCUS, toujours avec jet libre | Résumé calculé ; aucun champ sauvegardé ; dépend du rendu des formules dans l'en-tête | Statique OK ; BAC à tester |
| P1 | Ordre Personnage : Identité, Caractéristiques, Attaques, Combat, Repos, Compétences rapides, Focus | Identité, Attaques, Focus, Combat/sauvegardes, Compétences rapides, Caractéristiques, Repos | Moins de navigation ; composants originaux déplacés sans changement de leurs clés | Statique OK ; BAC à tester |
| P2 | Total / jet à droite des tableaux | Total / jet en deuxième colonne, après le nom, y compris 8 Artisanats et Connaissances | Le calcul et la carte de chat restent ceux de la source ; CSS à tester en petit écran | Statique OK ; BAC à tester |
| P2 | Tous les détails visibles | 10 panneaux repliables par défaut : caractéristiques, repos, dons/talents, résumé, quatre notes, améliorations et monture | Moins de hauteur ; accès en un clic, pas de suppression de données | Statique OK ; BAC à tester |
| P2 | Inventaire / monture | Titres « sur le PJ » vs « transportés » et repli de la monture | Présentation uniquement, aucun changement de charge/transfert | Statique OK ; BAC à tester |
| P3 | 31 champs techniques avec `editRole=0` | `editRole=4` (GM) sur ces 31 champs, actions Synchroniser/Annuler visibles GM seulement (`role=4`) | Modification de droits d'édition, **pas** des valeurs ; rôle à vérifier sur comptes joueur et MJ | Statique OK ; BAC à tester |

### Détails d'implémentation

- La réserve `H0D_Point_Action_Depense`, malgré son nom historique, représente **les PA restantes** : le champ est libellé « Reste » et le moteur de niveau le recharge au maximum. L'en-tête affiche cette valeur directement, sans effectuer une soustraction erronée.
- L'en-tête n'est **pas rendu sticky** : cela n'a pas été validé avec la structure de défilement de CSB. Laisser le bandeau normal évite des problèmes de recouvrement.
- Les panneaux repliables utilisent les propriétés CSB `collapsible`, `defaultCollapsed` et `title` déjà présentes dans le template source, avec les paramètres de mise en page `flow` et `align`.
- Les 4 actions Focus, les attaques rapides, les capacités de repos, les macros et les formules ne sont pas réécrites.
- La proposition de CSS sur cette branche est nécessaire pour apprécier la nouvelle largeur des colonnes ; l'import isolé du JSON dans un monde utilisant le CSS publié peut présenter des largeurs imparfaites.

## Backlog fonctionnel — NON MODIFIÉ

| Point | Clés et valeurs observées | Référence / divergence | Correction envisageable et risques |
|---|---|---|---|
| Récupération | `H0D_Repos_Danger_Gain_Calc=${1}$`, `H0D_Repos_Normal_Gain_Calc=${max(0,H0D_CON_MOD+1)}$`, `H0D_Repos_CampSur_Gain_Calc=${max(0,2*H0D_CON_MOD+2)}$` ; `H0D_Repos_Refuge` rend tous les PV | Plusieurs barèmes de repos sont présents dans les décisions historiques de campagne (0 / 1d6+CON / 2d6+CON / full ; ou récupération par niveau). Il faut confirmer lequel prévaut. | Aligner les quatre formules après choix explicite ; risque fort sur l'équilibre de la récupération. |
| Charge | `H0D_Charge_Max_Calc=${max(4,6 + H0D_FOR_MOD)}$` et la note affichée « Capacité personnelle = 6 + mod. FOR (minimum 4) » | **Aucune divergence interne actuelle** entre formule et texte. D'autres échanges historiques mentionnent 4 + mod. FOR. | Ne rien changer sans décision sur la référence. Risque sur équipement porté, vitesse et malus de compétences. |
| Points d'action | `H0D_Point_Action_Max_Calc=${5 + floor(H0D_PJ_Niveau_Calc / 2)}$` ; `H0D_Point_Action_Depense` est le stock restant. Le bouton « Lancer le dé d’action » produit un résultat, sans mise à jour de stock dans son code. | Le suivi paraît manuel ; le code de l'action emploie 1d6, 2d6kh1 (niv. 8+) ou 3d6kh1 (niv. 15), à comparer aux règles de campagne sur un emploi par combat et le dé utilisé. | Définir une politique explicite de dépense et de remise à zéro. Risques : dépense multiple / consommation injustifiée. |
| Passage de niveau | `H0D_Classe_Valider_Niveau`, `H0D_Classe_Synchroniser_Historique`, `H0D_Classe_Annuler_Dernier_Niveau`, `H0D_Skill_Progression` | Boutons dépendants de `globalThis.H0DLevelUp`, défini par le module `h0d-level-up.js`. | Ne pas remplacer par de simples labels ; vérifier synchronisation et annulation en BAC. Risque sur l'historique et les PV. |

## Tests Foundry BAC-à-SABLES (obligatoires avant fusion)

1. Importer d'abord une **copie** du template dans un monde BAC ; garder un snapshot de sécurité et ne pas toucher à l'original du monde de campagne.
2. Ouvrir en compte joueur : vérifier le bandeau PV / DEF / INIT / PA / Focus, la lisibilité des noms, l'absence de données dupliquées et le jet d20 libre.
3. Tester les quatre scans Focus, les jets d'armes actives, dégâts, munitions et changement de statut d'arme.
4. Tester un jet de chaque type : compétence principale, Artisanat, Connaissance standard et Connaissance personnalisée, y compris les choix d20 / Faire 10 / Faire 20 et bonus/malus.
5. Tester les panneaux repliables, y compris réouverture après changement d'onglet et reconnexion.
6. Tester la monture équipée/non équipée, les transferts et les conteneurs d'objets, ainsi que le calcul de charge.
7. Avec un compte **joueur propriétaire**, vérifier que les 31 champs techniques ne sont pas éditables et que les boutons Synchroniser/Annuler ne sont pas accessibles ; puis avec le MJ, vérifier qu'ils le sont.
8. Vérifier passage de niveau, sauvegardes, historique, calculs, repos, et la conservation des données de deux PJ existants (avec une sauvegarde).
9. Tester l'affichage en largeur standard et en fenêtre étroite, avec le CSS de cette proposition.
10. Ne déclarer la refonte validée qu'après tests réels Foundry v14 + CSB 6.0.2.

## Livraison et états

- **Implémenté** : JSON ergonomique complet, feuille CSS sur branche séparée, tests statiques.
- **Vérifié statiquement** : structure JSON, clés, 4 onglets, conteneurs, formules, messages de jet et permissions configurées.
- **À tester dans Foundry** : rendu, saisies, repli des panneaux, permissions effectives, actions Focus/combat, import de template et migration des fiches existantes.
- **Bloqué volontairement** : fusion dans `main` et Release Foundry tant que la proposition n'a pas reçu une validation BAC.
