#!/bin/bash

# Variables
USER="root"
PASSWORD="root"
DATABASE="miam_dv"
CONTAINER="bdd_miam_dv"
BACKUP_FILE="backup_miam_dv.sql"

# Exécution de la sauvegarde depuis le conteneur MySQL
docker exec $CONTAINER mysqldump -u$USER -p$PASSWORD $DATABASE > $BACKUP_FILE
