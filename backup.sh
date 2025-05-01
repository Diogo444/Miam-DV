#!/bin/bash

# Variables
CONTAINER_NAME="bdd_miam_dv"  # Nom de ton conteneur MySQL
BACKUP_FILE="/home/serveur/Bureau/Sites/miamdv/backup_miam_dv.sql"  # Chemin où tu veux stocker la sauvegarde

# Exécuter la commande mysqldump pour sauvegarder la base de données
docker exec $CONTAINER_NAME mysqldump -u root miam_dv > $BACKUP_FILE

# docker exec bdd_miam_dv mysqldump -u root miam_dv > ./backup_miam_dv.sql