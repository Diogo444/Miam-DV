import { pool } from '../db'; // Connexion à la base de données
import { Request, Response } from 'express';
import mysql from 'mysql2';

export const getMessage = (req: Request, res: Response): void => {

    if (typeof pool.query !== 'function') {
        res.status(500).send('Query method not available.');
        return;
    }

    pool.query('SELECT * FROM miammi', (error: mysql.QueryError | null, results: mysql.RowDataPacket[]) => {
        if (error) {
            console.error(error);
            res.status(500).send('Database error');
            return;
        }
        res.status(200).json(results);
    });
};

export const ajoutMessage = (req: Request, res: Response): void => {
    
    const { message } = req.body;

    if (!message) {
        res.status(400).json({ error: 'Le champ message est requis.' });
        return;
    }

    // Obtenir la date et l'heure actuelles
    const now = new Date();
    const annee = now.getFullYear();
    const mois = String(now.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const jour = String(now.getDate()).padStart(2, '0');
    const heure = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    // Insérer dans la base de données
    const query = `
        INSERT INTO miammi (message, annee, mois, jour, heure, minute)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [message, annee, mois, jour, heure, minute];

    // Utilisation de la version callback de mysql2
    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Erreur lors de l\'ajout du message :', error);
            res.status(500).json({ error: 'Une erreur est survenue.' });
        } else {
            res.status(201).json({
                success: true,
                message: 'Message ajouté avec succès.',
                data: { annee, mois, jour, heure, minute }
            });
        }
    });
};


export const trashMessage = (req: Request, res: Response): void => {
    const { id } = req.params;
    pool.query('DELETE FROM miammi WHERE id = ?', [id], (error: mysql.QueryError | null, results: mysql.OkPacket) => {
        if (error) {
            console.error(error);
            res.status(500).send('Database error');
            return;
        }
        res.status(200).json({ message: 'Message supprimé avec succès.' });
    });
};

export const trashAllMessage = (req: Request, res: Response): void => {
    pool.query('DELETE FROM miammi', (error: mysql.QueryError | null, results: mysql.OkPacket) => {
        if (error) {
            console.error(error);
            res.status(500).send('Database error');
            return;
        }
        res.status(200).json({ message: 'Messages supprimés avec succès.' });
    });
};