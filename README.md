# Miam-DV

## 📜 Présentation

**Miam-DV** est une application web de gestion de menus, recettes et messages pour la cantine.
Elle combine un front-end **Angular** et un back-end **Express** avec une base de données **MySQL**.

* **Front-end** : interface utilisateur Angular
* **Back-end** : serveur Express (`src/server`) avec des API REST sécurisées via JWT
* **Base de données** : MySQL pour les utilisateurs, menus, recettes, proverbes, etc.

---

## ⚙️ Prérequis

* **Node.js** `22.12.0`
* **npm** (inclus avec Node.js)
* **MySQL** (local ou distant)
* Optionnel : **Docker** + **Docker Compose**

---

## 🚀 Installation

1. Clone le dépôt :

   ```bash
   git clone https://github.com/ton-projet/miam-dv.git
   cd miam-dv
   ```

2. Installe les dépendances :

   ```bash
   npm install
   ```

3. Crée un fichier `.env` à la racine :

   ```env
   JWT_SECRET=your_jwt_secret
   DB_HOST=localhost
   DB_USER=miamdv
   DB_PASSWORD=yourpassword
   DB_DATABASE=miam_dv
   ```

---

## ▶️ Lancer en développement

* Lancer le front-end Angular :

  ```bash
  ng serve
  ```

* Lancer le back-end Express :

  ```bash
  npm run serve:ssr
  ```

* Ou tout lancer avec Docker :

  ```bash
  docker-compose up --build
  ```

---

## 📄 Base de données

1. Assure-toi que MySQL est lancé.
2. Importe le fichier SQL :

   ```bash
   mysql -u miamdv -p miam_dv < backup_miam_dv.sql
   ```

---

## 🧰 Tests & Build

* Lancer les tests unitaires :

  ```bash
  ng test
  ```

* Compiler le projet :

  ```bash
  ng build
  ```

---

## 📡 Routes API principales

### `/api`

| Méthode | Route                | Description                     |
| ------: | -------------------- | ------------------------------- |
|     GET | `/menu`              | Récupère le menu actuel         |
|    POST | `/menuajout`         | Crée ou modifie le menu         |
|  DELETE | `/menufinal`         | Supprime le menu                |
|     GET | `/proverbe`          | Récupère le proverbe du jour    |
|    POST | `/proverbeajout`     | Ajoute ou modifie un proverbe   |
|     GET | `/allProverbe`       | Liste des proverbes             |
|     GET | `/miammi`            | Liste des messages utilisateurs |
|    POST | `/miammiajout`       | Ajoute un message               |
|  DELETE | `/deletemsg/:id`     | Supprime un message précis      |
|  DELETE | `/deletemiammi`      | Vide tous les messages          |
|     GET | `/recipes`           | Liste des recettes              |
|     GET | `/recipe/:slug`      | Détail d’une recette            |
|    POST | `/recipeajout`       | Ajoute une recette              |
|     GET | `/allPreferences`    | Liste toutes les préférences    |
|    POST | `/getPreferences`    | Récupère les préférences        |
|    POST | `/updatePreferences` | Met à jour les préférences      |
|    POST | `/addDesign`         | Ajoute un thème de style        |

### `/auth`

| Méthode | Route                     | Description                          |
| ------: | ------------------------- | ------------------------------------ |
|    POST | `/register`               | Inscription                          |
|    POST | `/login`                  | Connexion                            |
|    POST | `/change-password`        | Modifier le mot de passe             |
|    POST | `/change-username`        | Modifier le nom d'utilisateur        |
|  DELETE | `/delete-account/:token`  | Supprimer son compte                 |
|     GET | `/check`                  | Vérifie l’authentification           |
|     GET | `/user`                   | Infos utilisateur connecté           |
|     GET | `/role`                   | Rôle de l’utilisateur                |
|    POST | `/logout`                 | Déconnexion                          |
|     GET | `/all-users`              | Liste des utilisateurs (admin)       |
|  DELETE | `/delete-user/:id`        | Supprime un utilisateur (admin)      |
|   PATCH | `/update-user-passwd/:id` | Change mot de passe d’un utilisateur |
|   PATCH | `/update-user-role/:id`   | Change rôle d’un utilisateur (admin) |

---

## 📁 Structure du projet

```
miam-dv/
│
├── src/
│   ├── app/            → Code Angular
│   └── server/         → API Express
├── docker-compose.yml → Déploiement simplifié
├── .env               → Variables d'environnement
├── backup_miam_dv.sql → Dump SQL de la base
└── README.md          → Ce fichier
```

---

## 📌 Infos utiles

* Angular CLI : [angular.dev/tools/cli](https://angular.dev/tools/cli)
* Express.js : [expressjs.com/fr](https://expressjs.com/fr/)
* MySQL : [dev.mysql.com/doc](https://dev.mysql.com/doc)
