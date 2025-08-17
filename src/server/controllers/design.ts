import e, { Request, Response } from 'express';
import { pool } from '../db';
import jwt from 'jsonwebtoken';
import { environment } from '../../environments/environment';

const secret: string = environment.JWT_SECRET;

export const getAllPreferences = async (req: Request, res: Response) => {
  pool.query('SELECT * FROM all_preference', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
};
export const getPreferences = async (req: Request, res: Response) => {
  const token = req.cookies['token'];

  if (!secret) {
    return res.status(500).send('JWT_SECRET non défini');
  }

  jwt.verify(
    token,
    secret,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        return res.status(400).send('Token invalide ou non décodable');
      }

      const userId = (decoded as jwt.JwtPayload)['id'];
      const query = `
            SELECT 
                p.id AS preference_id, 
                p.user_id, 
                p.design_id, 
                a.color_text, 
                a.bg_container, 
                a.color_text_type
            FROM 
                preference p
            INNER JOIN 
                all_preference a 
            ON 
                p.design_id = a.id
            WHERE 
                p.user_id = ?;
        `;

      pool.query(query, [userId], (err, rows) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        return res.json(rows);
      });
      return;
    }
  );
  return;
};

export const updatePreferences = async (req: Request, res: Response) => {
  const { idDesign } = req.body;

  const token = req.cookies['token'];

  if (!secret) {
    return res.status(500).send('JWT_SECRET non défini');
  }

  jwt.verify(
    token,
    secret,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
        return res.status(400).send('Token invalide ou non décodable');
      }

      const userId = (decoded as jwt.JwtPayload)['id'];
      const query = `UPDATE preference SET design_id = ? WHERE user_id = ?;`;

      pool.query(query, [idDesign, userId], (err) => {
        if (err) {
          return res.status(500).send(err.message);
        }

        return res.status(200).json({ message: 'Préférences mises à jour' });
      });
      return;
    }
  );
  return;
};

export const createPreferences = async (req: Request, res: Response) => {
  const { bg, title, element } = req.body;

  const query = `INSERT INTO all_preference (bg_container, color_text, color_text_type) VALUES (?, ?, ?);`;

  pool.query(query, [bg, title, element], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.status(200).json({ message: 'Préférence ajoutée' });
  });
  return;
};
