 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index bfe4086eba6b8440fa9013ddb7b1e245f55790fc..2f31c7f00f27432bf1d937a0e2ca836ef2993534 100644
--- a/README.md
+++ b/README.md
@@ -1,60 +1,79 @@
 # MiamDV
 
-This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.
+## Présentation
 
-## Development server
+Cette application combine un front‑end Angular et un serveur Express connecté à MySQL. Le code du serveur se trouve dans `src/server` et expose plusieurs API pour gérer menus, recettes, messages et utilisateurs.
 
-To start a local development server, run:
+## Prérequis
 
-```bash
-ng serve
-```
-
-Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
-
-## Code scaffolding
-
-Angular CLI includes powerful code scaffolding tools. To generate a new component, run:
-
-```bash
-ng generate component component-name
-```
-
-For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:
-
-```bash
-ng generate --help
-```
+- Node.js **22.12.0** (voir le `Dockerfile`).
+- npm (fourni avec Node).
+- Une base de données **MySQL** disponible.
 
-## Building
+## Installation
 
-To build the project run:
+1. Cloner ce dépôt.
+2. Lancer `npm install` à la racine.
+3. Créer un fichier `.env` avec au minimum :
 
-```bash
-ng build
 ```
-
-This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
-
-## Running unit tests
-
-To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:
-
-```bash
-ng test
+JWT_SECRET=your_jwt_secret
+DB_HOST=localhost
+DB_USER=miamdv
+DB_PASSWORD=yourpassword
+DB_DATABASE=miam_dv
 ```
 
-## Running end-to-end tests
-
-For end-to-end (e2e) testing, run:
-
-```bash
-ng e2e
-```
-
-Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.
-
-## Additional Resources
+## Lancement en développement
+
+- Front‑end : `ng serve`.
+- Serveur Express : `npm run serve:ssr` ou `docker-compose up`.
+
+## Initialisation de la base de données
+
+Importer le fichier `backup_miam_dv.sql` dans votre instance MySQL pour créer les tables et les données de départ.
+
+## Tests et build
+
+- Exécuter les tests : `ng test`.
+- Construire l’application : `ng build`.
+- Démarrer via Docker : `docker-compose up --build`.
+
+## Principales routes API
+
+### /api
+
+- `GET /menu` – récupérer le menu.
+- `POST /menuajout` – créer ou modifier le menu.
+- `DELETE /menufinal` – supprimer le menu.
+- `GET /proverbe` – obtenir le proverbe courant.
+- `POST /proverbeajout` – mettre à jour le proverbe.
+- `GET /allProverbe` – liste des proverbes.
+- `GET /miammi` – lire les messages.
+- `POST /miammiajout` – ajouter un message.
+- `DELETE /deletemsg/:id` – supprimer un message.
+- `DELETE /deletemiammi` – vider tous les messages.
+- `GET /recipes` – lister les recettes.
+- `GET /recipe/:slug` – détail d’une recette.
+- `POST /recipeajout` – ajouter une recette.
+- `GET /allPreferences` – lister toutes les préférences.
+- `POST /getPreferences` – récupérer les préférences.
+- `POST /updatePreferences` – mettre à jour les préférences.
+- `POST /addDesign` – créer une configuration.
+
+### /auth
+
+- `POST /register` – inscription.
+- `POST /login` – connexion.
+- `POST /change-password` – changer le mot de passe.
+- `POST /change-username` – changer le nom d’utilisateur.
+- `DELETE /delete-account/:token` – supprimer son compte.
+- `GET /all-users` – liste des utilisateurs (admin).
+- `GET /check` – vérifier l’authentification.
+- `GET /role` – rôle de l’utilisateur courant.
+- `GET /user` – informations de l’utilisateur courant.
+- `POST /logout` – déconnexion.
+- `DELETE /delete-user/:id` – supprimer un utilisateur (admin).
+- `PATCH /update-user-passwd/:id` – modifier le mot de passe d’un utilisateur (admin).
+- `PATCH /update-user-role/:id` – modifier le rôle d’un utilisateur (admin).
 
-For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
-# Miam-DV
 
EOF
)
