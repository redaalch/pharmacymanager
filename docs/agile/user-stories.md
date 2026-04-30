# User stories

Ces user stories couvrent le MVP demande dans le brief. Elles sont ecrites simplement pour guider le developpement, pas pour remplir un outil Agile.

## US-01 - Consulter le catalogue de medicaments

En tant que pharmacien, je veux consulter la liste des medicaments actifs afin de connaitre rapidement l'etat du stock disponible.

Critères d'acceptation :

- La liste affiche uniquement les medicaments actifs par defaut.
- Chaque ligne montre au minimum le nom, la DCI, la categorie, le dosage, le prix de vente et le stock.
- Je peux rechercher un medicament par nom ou DCI.
- Les medicaments sous le seuil minimum sont clairement identifiables.

## US-02 - Ajouter un medicament

En tant que pharmacien, je veux ajouter un nouveau medicament afin de tenir mon inventaire a jour.

Critères d'acceptation :

- Les champs obligatoires du brief sont pris en compte.
- Le medicament est lie a une categorie existante.
- Les prix et les stocks ne peuvent pas etre negatifs.
- Le medicament apparait dans la liste apres creation.

## US-03 - Modifier ou archiver un medicament

En tant que pharmacien, je veux modifier les informations d'un medicament ou l'archiver afin de garder un catalogue propre.

Critères d'acceptation :

- Je peux modifier les informations principales d'un medicament.
- La suppression est logique : `est_actif` passe a `False`.
- Un medicament archive ne disparait pas de l'historique des ventes.
- L'API retourne des erreurs claires si les donnees sont invalides.

## US-04 - Gérer les categories

En tant que pharmacien, je veux gerer les categories afin de classer les medicaments par famille.

Critères d'acceptation :

- Je peux creer, consulter, modifier et supprimer une categorie.
- Une categorie contient un nom et une description optionnelle.
- Un medicament doit appartenir a une categorie.
- Une categorie utilisee par des medicaments ne doit pas casser les donnees existantes.

## US-05 - Voir les alertes de stock

En tant que pharmacien, je veux voir les medicaments avec un stock bas afin de preparer le reapprovisionnement.

Critères d'acceptation :

- L'endpoint `/api/v1/medicaments/alertes/` retourne les medicaments ou `stock_actuel <= stock_minimum`.
- Le dashboard affiche le nombre d'alertes.
- La page medicaments montre visuellement les produits en alerte.

## US-06 - Creer une vente

En tant que pharmacien, je veux enregistrer une vente avec plusieurs medicaments afin de suivre les transactions du comptoir.

Critères d'acceptation :

- Une vente peut contenir une ou plusieurs lignes.
- Chaque ligne contient un medicament, une quantite, un prix unitaire et un sous-total.
- Le prix unitaire est sauvegarde comme snapshot du prix au moment de la vente.
- Le total TTC est calcule par le backend.
- Le stock est deduit automatiquement apres creation.
- La vente n'est pas creee si le stock est insuffisant.

## US-07 - Annuler une vente

En tant que pharmacien, je veux annuler une vente afin de corriger une erreur sans perdre l'historique.

Critères d'acceptation :

- Une vente annulee garde sa reference et ses lignes.
- Le statut passe a `Annulee`.
- Les quantites vendues sont reintegrees dans le stock.
- Une vente deja annulee ne peut pas reintegrer le stock une deuxieme fois.

## US-08 - Consulter l'historique des ventes

En tant que pharmacien, je veux consulter les ventes afin de suivre l'activite de la pharmacie.

Critères d'acceptation :

- La liste affiche la reference, la date, le total TTC et le statut.
- Je peux consulter le detail d'une vente avec ses lignes.
- Je peux filtrer l'historique par date ou periode.
- Les ventes annulees restent visibles.

## US-09 - Utiliser Swagger pour tester l'API

En tant qu'evaluateur technique, je veux tester l'API via Swagger afin de verifier rapidement le comportement du backend.

Critères d'acceptation :

- Swagger est accessible sur `/api/schema/swagger-ui/`.
- Les endpoints principaux ont des descriptions et des tags.
- Les schemas de requete et de reponse sont lisibles.
- Les erreurs importantes sont documentees.

## US-10 - Connecter le frontend a l'API

En tant que pharmacien, je veux utiliser l'interface React avec les vraies donnees du backend afin que l'application ne reste pas une demo locale.

Critères d'acceptation :

- L'URL de l'API vient de `VITE_API_BASE_URL`.
- Les appels passent par `src/api/`.
- Les pages gerent les etats loading, error et empty state.
- La creation de vente depuis le frontend met a jour les stocks apres rechargement des donnees.

