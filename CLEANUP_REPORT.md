# Rapport de nettoyage

## Objectif

Préparer une version publiable sur GitHub sans modifier le comportement de
l'application web actuellement utilisée.

## Modifications réalisées

- séparation du CSS dans `public_html/css/style.css` ;
- séparation du JavaScript principal dans `public_html/js/app.js` ;
- conservation du script de thème initial dans le `<head>` pour éviter un flash
  de thème au chargement ;
- suppression des intitulés de correctifs temporaires et numéros de versions de
  travail dans les commentaires CSS ;
- aucune règle CSS fonctionnelle supprimée afin de préserver le rendu actuel ;
- aucun comportement JavaScript supprimé ;
- nettoyage de la documentation des synchroniseurs FI2 et FA2 ;
- correction de la documentation FA2 pour refléter les groupes A/C réellement
  publiés par l'application ;
- remplacement des chemins absolus du wrapper PHP par des chemins calculés
  relativement au projet ;
- ajout de `.gitignore`, `.env.example`, licence MIT, README et documentation de
  déploiement ;
- ajout de captures d'écran de présentation ;
- exclusion des secrets, logs, locks, environnements virtuels et sauvegardes.

## Éléments volontairement conservés

Le CSS historique contient plusieurs couches responsive. Elles ont été
conservées dans leur ordre actuel car la cascade fait partie du rendu validé en
production. Un refactoring agressif visant à fusionner ces règles présenterait
un risque de régression visuelle. Les commentaires temporaires ont été nettoyés
sans changer les déclarations CSS.

Les fichiers `public_html/data/edt.json` et `public_html/data/fa2.json` sont
conservés pour permettre au front-end de fonctionner immédiatement après
clonage. Ils peuvent être régénérés avec les scripts Python.

## Vérifications effectuées

- compilation Python des deux synchroniseurs ;
- validation syntaxique JavaScript avec Node.js ;
- validation syntaxique PHP ;
- validation JSON du manifeste et des deux fichiers de données ;
- validation syntaxique du script shell ;
- recherche de mentions d’outils d’assistance ou de génération ;
- recherche de chemins d'hébergement et identifiants de connexion connus ;
- vérification de l'absence de `cron_secret.txt`, logs et locks dans le paquet.
