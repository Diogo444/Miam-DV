<<<<<<< HEAD
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
=======
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
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
CMD [ "npm", "run", "serve:ssr" ]