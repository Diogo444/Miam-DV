import { Request, Response } from 'express';
import { pool } from '../db'; // Connexion à la base de données
import mysql from 'mysql2';

export const getProverbe = (req: Request, res: Response): void => {
  // Vérifie si la méthode pool.query existe
  if (typeof pool.query !== 'function') {
    res.status(500).send('Query method not available.');
    return;
  }

  // Exécute la requête pour récupérer les proverbes
  pool.query(
    'SELECT * FROM proverbe',
    (error: mysql.QueryError | null, results: mysql.RowDataPacket[]) => {
      if (error) {
        console.error(error);
        res.status(500).send('Database error');
        return;
      }
      res.status(200).json(results);
    }
  );
};

export const updateProverbe = (req: Request, res: Response): void => {
  const { proverbe } = req.body;

  // Vérification de la donnée reçue
  if (!proverbe || typeof proverbe !== 'string' || proverbe.trim() === '') {
    res.status(400).json({
      error: 'Le champ proverbe est requis et doit être une chaîne non vide.',
    });
    return;
  }

  // 1️⃣ Mise à jour du proverbe
  pool.query(
    'UPDATE proverbe SET proverbe = ? WHERE id = 1',
    [proverbe],
    (updateError, updateResult: mysql.OkPacket) => {
      if (updateError) {
        console.error(
          'Erreur lors de la mise à jour du proverbe :',
          updateError
        );
        res
          .status(500)
          .json({ error: 'Une erreur est survenue lors de la mise à jour.' });
        return;
      }

      if (updateResult.affectedRows > 0) {
        // 2️⃣ Si mise à jour réussie, insérer dans all_proverbs
        pool.query(
          'INSERT INTO all_proverbs (proverbe) VALUES (?)',
          [proverbe],
          (insertError) => {
            if (insertError) {
              console.error(
                "Erreur lors de l'insertion du proverbe :",
                insertError
              );
              res.status(500).json({
                error: "Une erreur est survenue lors de l'insertion.",
              });
              return;
            }

            res.status(200).json({
              message: 'Proverbe mis à jour et sauvegardé avec succès.',
              data: { id: 1, proverbe },
            });
          }
        );
      } else {
        res.status(400).json({
          error: 'Aucune mise à jour effectuée. Vérifie que l’ID 1 existe.',
        });
      }
    }
  );
};

export const getAllProverbs = (req: Request, res: Response): void => {
  pool.query(
    'SELECT * FROM all_proverbs',
    (error: mysql.QueryError | null, results: mysql.RowDataPacket[]) => {
      if (error) {
        console.error(error);
        res.status(500).send('Database error');
        return;
      }
      res.status(200).json(results);
    }
  );
};
