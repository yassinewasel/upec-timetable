# EDT Informatique — UPEC

Application web responsive permettant de consulter les emplois du temps de
deuxième année du BUT Informatique de l'UPEC à partir des données publiées par
Formadep360.

Le projet combine une interface web légère en HTML/CSS/JavaScript avec des
scripts Python chargés de récupérer, normaliser et publier les données au format
JSON.

## Aperçu

### Vue mobile — mode Jour

![Vue mobile](docs/screenshots/mobile-day.png)

### Vue responsive

![Vue responsive](docs/screenshots/responsive-day.png)

## Fonctionnalités

- consultation des emplois du temps **FI2** et **FA2** ;
- groupes affichés : **A**, **C** et cours communs ;
- sélection dynamique de la formation ;
- vue **Semaine** et vue **Jour** ;
- navigation rapide entre les jours et les semaines ;
- sélection automatique de la semaine courante ;
- mode clair / sombre avec mémorisation locale ;
- interface responsive pour mobile, tablette et ordinateur ;
- export de l'emploi du temps en PNG avec `html2canvas` ;
- synchronisation des données Formadep360 vers des fichiers JSON ;
- endpoint PHP protégé pour déclencher la synchronisation FI2 sur l'hébergement.

## Stack technique

### Front-end

- HTML5
- CSS3
- JavaScript vanilla
- LocalStorage
- html2canvas

### Synchronisation

- Python 3
- Requests
- BeautifulSoup4
- JSON

### Hébergement

- Apache
- PHP
- tâche de synchronisation protégée par secret

## Architecture

```text
Formadep360
    │
    ▼
Scripts Python
    │
    ├── FI2  ──► public_html/data/edt.json
    └── FA2  ──► public_html/data/fa2.json
                    │
                    ▼
            Application web
```

## Structure du projet

```text
.
├── public_html/
│   ├── assets/
│   │   ├── icons/
│   │   └── logo-transparent.png
│   ├── css/
│   │   └── style.css
│   ├── data/
│   │   ├── edt.json
│   │   └── fa2.json
│   ├── js/
│   │   └── app.js
│   ├── .htaccess
│   ├── cron-sync.php
│   ├── index.html
│   └── manifest.webmanifest
├── sync/
│   ├── formadep_sync.py
│   ├── formadep_sync_fa2.py
│   ├── requirements.txt
│   ├── run_sync.bat
│   └── run_sync.sh
├── docs/
│   ├── DEPLOYMENT.md
│   └── screenshots/
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Installation locale

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-utilisateur>/<votre-depot>.git
cd <votre-depot>
```

### 2. Créer l'environnement Python

Sous Linux / macOS :

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r sync/requirements.txt
```

Sous Windows :

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r sync\requirements.txt
```

### 3. Synchroniser les données

FI2 :

```bash
python sync/formadep_sync.py --auto --out public_html/data/edt.json
```

FA2 :

```bash
python sync/formadep_sync_fa2.py --auto --out public_html/data/fa2.json
```

### 4. Lancer le site localement

```bash
python -m http.server 8080 -d public_html
```

Puis ouvrir :

```text
http://localhost:8080
```

## Sécurité

Les secrets de production ne sont pas versionnés.

Le fichier suivant doit rester local au serveur :

```text
sync/cron_secret.txt
```

Il est ignoré par Git. Le dépôt ne doit contenir ni mot de passe SSH, ni clé API,
ni secret de tâche planifiée.

## Synchronisation HTTP

`public_html/cron-sync.php` permet de déclencher la synchronisation FI2 depuis
une tâche planifiée externe. L'accès est protégé par une clé comparée au contenu
de `sync/cron_secret.txt`.

Les chemins du projet sont calculés relativement au dépôt afin d'éviter de
publier un chemin d'hébergement propre à un compte de production.

## Déploiement

Les instructions détaillées sont disponibles dans
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Données

Les fichiers JSON présents dans `public_html/data/` sont des données générées à
partir de Formadep360. Ils permettent au front-end de fonctionner directement
après clonage du dépôt et peuvent être régénérés à tout moment avec les scripts
de synchronisation.

## Auteur

**Yassine Wasel**  
BUT Informatique — UPEC

## Licence

Ce projet est distribué sous licence MIT. Voir [`LICENSE`](LICENSE).
