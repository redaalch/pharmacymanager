# Architecture — PharmaManager

Diagrammes exportes du tableau de system design Eraser, ranges dans l'ordre de
lecture recommande pour une revue technique.

## Ordre de lecture

| # | Diagramme | Fichier |
| --- | --- | --- |
| 1 | System Context — vue d'ensemble (acteurs, navigateur, frontend, API, BDD, deploiement) | [01-system-context-diagram.png](diagrams/01-system-context-diagram.png) |
| 2 | Container Architecture — couches frontend, backend (DRF), base PostgreSQL | [02-container-architecture-diagram.png](diagrams/02-container-architecture-diagram.png) |
| 3 | Database ERD — `Categorie`, `Medicament`, `Vente`, `LigneVente` et leurs relations | [03-database-erd.png](diagrams/03-database-erd.png) |
| 4 | Sequence — Creation d'une vente avec deduction de stock atomique | [04-sequence-create-sale.png](diagrams/04-sequence-create-sale.png) |
| 5 | Sequence — Annulation d'une vente avec reintegration du stock | [05-sequence-cancel-sale.png](diagrams/05-sequence-cancel-sale.png) |
| 6 | Stock Alert Flow — declencheurs, decision et surfaces UI | [06-stock-alert-flow.png](diagrams/06-stock-alert-flow.png) |
| 7 | API Overview — endpoints REST par ressource + Swagger | [07-api-overview.png](diagrams/07-api-overview.png) |

## Notes vs implementation finale

Les diagrammes ont ete dessines au debut du projet pour cadrer l'architecture.
Le code livre suit la meme structure d'ensemble, mais quelques details ont
evolue pendant l'implementation. Pour eviter toute ambiguite a la revue :

- **ERD — types d'identifiants.** Les diagrammes affichent `id : string pk`.
  L'implementation finale utilise `BigAutoField` (entier) sur tous les modeles,
  conformement aux defauts Django et au choix `DEFAULT_AUTO_FIELD`.
- **Couche services backend.** Le diagramme container montre une couche
  `Services / Business Logic` (`StockService`, `SalesService`, `ReportingService`).
  Pour respecter le principe KISS du brief, cette couche n'a pas ete creee :
  la logique metier vit dans les serializers (`VenteCreateSerializer.create()`)
  et sur les modeles eux-memes (`Vente.annuler()`). Cela reduit l'indirection
  et garde la lecture du flux `vue -> serializer -> modele` directe.
- **Nommage des hooks et services frontend.** Les diagrammes utilisent un
  nommage anglais (`useMedicines`, `medicineService`, `MedicineSerializer`).
  Le code final est en francais pour s'aligner avec le metier et le brief :
  `useMedicaments`, `medicamentsApi`, `MedicamentSerializer`. Idem pour
  `useSales` -> `useVentes` et `saleService` -> `ventesApi`.
- **Calcul du `total_ttc`.** La sequence "Create Sale" mentionne un calcul
  "with tax". Le backend final calcule `total_ttc = somme(quantite x
  prix_unitaire)` sans split TVA (le brief ne le demande pas et la TVA est un
  detail de presentation, pas de logique).
- **Couche deploiement (System Context).** Nginx, AWS et CI/CD apparaissent
  dans le bloc "Deployment Layer (Optional)". La livraison actuelle inclut un
  Docker Compose (Postgres + backend + frontend), pas de Nginx ni de pipeline
  CI/CD. Ces elements restent volontairement hors du scope du test.

## Source

Le tableau interactif Eraser et la version React du board de system design
sont conserves dans un depot dedie :
<https://www.figma.com/design/zSHgdvcu08po6UW7J0T9gR/PharmaManager-System-Design-Board>

Les PNG presents ici en sont l'export statique au moment de la livraison.
