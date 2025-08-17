# Utiliser une image de base Node.js
FROM node:22.12.0

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers restants dans le conteneur
COPY . .

# Exposer le port nécessaire
EXPOSE 4000

# Démarrer l'application
CMD [ "npm", "run", "serve:ssr" ]