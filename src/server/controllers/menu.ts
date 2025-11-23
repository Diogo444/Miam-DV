<<<<<<< HEAD
import { Request, Response } from 'express';
import { pool } from '../db'; // Connexion à la base de données
import mysql from 'mysql2';

export const getMenu = (req: Request, res: Response): void => {
    

    if (typeof pool.query !== 'function') {
        res.status(500).send('Query method not available.');
        return;
    }

    pool.query('SELECT * FROM menu', (error: mysql.QueryError | null, results: mysql.RowDataPacket[]) => {
        if (error) {
            console.error(error);
            res.status(500).send('Database error');
            return;
        }
        res.status(200).json(results);
    });
};


export const updateMenu = (req: Request, res: Response): void => {
    const { jour, periode, entree, plats, accompagnement, fromage, dessert } = req.body;
  
    // Vérification des paramètres requis
    if (!jour || !periode) {
      res.status(400).json({ message: 'Jour et période sont requis.' });
      return;
    }
  
    // Initialisation des parties de la requête et des valeurs
    const updates: string[] = [];
    const values: any[] = [];
  
    // Ajout dynamique des champs à mettre à jour
    if (entree !== undefined && entree !== null && entree !== '') {
      updates.push('entree = ?');
      values.push(entree);
    }
    if (plats !== undefined && plats !== null && plats !== '') {
      updates.push('plats = ?');
      values.push(plats);
    }
    if (accompagnement !== undefined && accompagnement !== null && accompagnement !== '') {
      updates.push('accompagnement = ?');
      values.push(accompagnement);
    }
    if (fromage !== undefined && fromage !== null && fromage !== '') {
      updates.push('fromage = ?');
      values.push(fromage);
    }
    if (dessert !== undefined && dessert !== null && dessert !== '') {
      updates.push('dessert = ?');
      values.push(dessert);
    }
  
    // Si aucune mise à jour n'est fournie
    if (updates.length === 0) {
      res.status(400).json({ message: 'Aucune mise à jour fournie.' });
      return;
    }
  
    // Création de la requête SQL
    const query = `UPDATE menu SET ${updates.join(', ')} WHERE jour = ? AND periode = ?`;
    values.push(jour, periode);
  
    // Exécution de la requête
    pool.query(query, values, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du menu:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
        return;
      }
  
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Menu non trouvé.' });
        return;
      }
  
      res.status(200).json({ message: 'Menu mis à jour avec succès.' });
    });
  };

export const trashMenu = (req: Request, res: Response): void => {
    const clearMenuSql =
    "UPDATE menu SET entree = NULL, plats = NULL, accompagnement = NULL, fromage = NULL, dessert = NULL";
  const clearProverbeSql = "UPDATE proverbe SET proverbe = NULL";

  pool.query(clearMenuSql, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
    if (error) {
      console.error('Erreur lors de la mise à jour du menu:', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
      return;
    }

    pool.query(clearProverbeSql, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du menu:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
        return;
      }

      res.status(200).json({ message: 'Menu vidé avec succès.' });
    });
  });
=======
import { Request, Response } from 'express';
import { pool } from '../db'; // Connexion à la base de données
import mysql from 'mysql2';

export const getMenu = (req: Request, res: Response): void => {
    

    if (typeof pool.query !== 'function') {
        res.status(500).send('Query method not available.');
        return;
    }

    pool.query('SELECT * FROM menu', (error: mysql.QueryError | null, results: mysql.RowDataPacket[]) => {
        if (error) {
            console.error(error);
            res.status(500).send('Database error');
            return;
        }
        res.status(200).json(results);
    });
};


export const updateMenu = (req: Request, res: Response): void => {
    const { jour, periode, entree, plats, accompagnement, fromage, dessert } = req.body;
  
    // Vérification des paramètres requis
    if (!jour || !periode) {
      res.status(400).json({ message: 'Jour et période sont requis.' });
      return;
    }
  
    // Initialisation des parties de la requête et des valeurs
    const updates: string[] = [];
    const values: any[] = [];
  
    // Ajout dynamique des champs à mettre à jour
    if (entree !== undefined && entree !== null && entree !== '') {
      updates.push('entree = ?');
      values.push(entree);
    }
    if (plats !== undefined && plats !== null && plats !== '') {
      updates.push('plats = ?');
      values.push(plats);
    }
    if (accompagnement !== undefined && accompagnement !== null && accompagnement !== '') {
      updates.push('accompagnement = ?');
      values.push(accompagnement);
    }
    if (fromage !== undefined && fromage !== null && fromage !== '') {
      updates.push('fromage = ?');
      values.push(fromage);
    }
    if (dessert !== undefined && dessert !== null && dessert !== '') {
      updates.push('dessert = ?');
      values.push(dessert);
    }
  
    // Si aucune mise à jour n'est fournie
    if (updates.length === 0) {
      res.status(400).json({ message: 'Aucune mise à jour fournie.' });
      return;
    }
  
    // Création de la requête SQL
    const query = `UPDATE menu SET ${updates.join(', ')} WHERE jour = ? AND periode = ?`;
    values.push(jour, periode);
  
    // Exécution de la requête
    pool.query(query, values, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du menu:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
        return;
      }
  
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Menu non trouvé.' });
        return;
      }
  
      res.status(200).json({ message: 'Menu mis à jour avec succès.' });
    });
  };

export const trashMenu = (req: Request, res: Response): void => {
    const clearMenuSql =
    "UPDATE menu SET entree = NULL, plats = NULL, accompagnement = NULL, fromage = NULL, dessert = NULL";
  const clearProverbeSql = "UPDATE proverbe SET proverbe = NULL";

  pool.query(clearMenuSql, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
    if (error) {
      console.error('Erreur lors de la mise à jour du menu:', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
      return;
    }

    pool.query(clearProverbeSql, (error: mysql.QueryError | null, results: mysql.OkPacket) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du menu:', error);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
        return;
      }

      res.status(200).json({ message: 'Menu vidé avec succès.' });
    });
  });
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
};