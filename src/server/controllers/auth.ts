import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { pool } from '../db'; // Remplace par ton chemin réel
import { RowDataPacket } from 'mysql2'; // Importer RowDataPacket
import { environment } from '../../environments/environment';

const key: string = environment.JWT_SECRET;

export const login = (req: Request, res: Response): void => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: 'Le nom et le mot de passe sont requis' });
    return;
  }

  const checkUserSql = 'SELECT * FROM user WHERE name = ?';
  pool.query(checkUserSql, [name], (err, results) => {
    if (err) {
      console.error("Erreur lors de la recherche de l'utilisateur :", err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }

    const users = results as RowDataPacket[]; // ✅ Cast explicite
    if (users.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const user = users[0];

    bcrypt.compare(password, user['password'], (compareErr, isMatch) => {
      if (compareErr) {
        console.error('Erreur de comparaison du mot de passe:', compareErr);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }

      if (!isMatch) {
        res.status(401).json({ message: 'Mot de passe incorrect' });
        return;
      }

      // Création du token JWT
      const token = jwt.sign(
        { id: user['id'], name, role: user['role'] },
        key,
        { expiresIn: '8h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // ✅ Corrigé
        maxAge: 8 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: 'Connexion réussie' });
    });
  });
};

export const register = (req: Request, res: Response): void => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: 'Le nom et le mot de passe sont requis' });
    return;
  }
  if (password.length < 4) {
    res
      .status(422)
      .json({ message: 'Le mot de passe doit contenir au moins 4 caractères' });
    return;
  }

  // Vérifier si le nom d'utilisateur existe déjà
  const checkUserSql = 'SELECT * FROM user WHERE name = ?';
  pool.query(checkUserSql, [name], (err, results) => {
    const users = results as RowDataPacket[];

    if (err) {
      console.error('Erreur lors de la vérification du nom :', err);
      res.status(500).json({
        message: "Erreur serveur lors de la vérification du nom d'utilisateur",
      });
      return;
    }

    if (users.length > 0) {
      res.status(409).json({ message: "Nom d'utilisateur déjà pris" });
      return;
    }

    // Hashage du mot de passe
    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error('Erreur lors du chiffrement du mot de passe:', hashErr);
        res.status(500).json({
          message: 'Erreur serveur lors du chiffrement du mot de passe',
        });
        return;
      }

      // Insérer l'utilisateur dans la base de données
      const insertUserSql =
        "INSERT INTO user (name, password, role, is_active) VALUES (?, ?, 'user', 1)";
      pool.query(insertUserSql, [name, hash], (insertErr, result: any) => {
        if (insertErr) {
          console.error(
            "Erreur lors de l'inscription de l'utilisateur:",
            insertErr
          );
          res.status(500).json({
            message: "Erreur serveur lors de l'inscription de l'utilisateur",
          });
          return;
        }

        const userId = result.insertId;

        // Création des préférences par défaut
        const insertPreferencesSql =
          'INSERT INTO preference (user_id, design_id) VALUES (?, 1)';
        pool.query(insertPreferencesSql, [userId], (prefErr) => {
          if (prefErr) {
            console.error(
              "Erreur lors de l'ajout des préférences utilisateur:",
              prefErr
            );
            res.status(500).json({
              message:
                "Erreur serveur lors de l'ajout des préférences utilisateur",
            });
            return;
          }

          // Création du token JWT
          const token = jwt.sign({ id: userId, name, role: 'user' }, key, {
            expiresIn: '8h',
          });

          // 🔥 Envoyer le token en cookie sécurisé (comme dans `login`)
          res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Nécessite HTTPS en production
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000, // Expire après 8 heures
          });

          res
            .status(201)
            .json({ message: 'Utilisateur enregistré avec succès' });
        });
      });
    });
  });
};

export const changePassword = (req: Request, res: Response): void => {
  const { token, newPassword } = req.body;

  // Vérification du token JWT
  jwt.verify(token, key, (err: Error | null, decoded: any) => {
    if (err) {
      res.status(401).json({ message: 'Token invalide' });
      return;
    }

    // Hash du nouveau mot de passe
    bcrypt.hash(newPassword, 10, (hashErr, hash) => {
      if (hashErr) {
        res
          .status(500)
          .json({ message: 'Erreur de hashage du nouveau mot de passe' });
        return;
      }

      // Mise à jour du mot de passe dans la base de données
      const updatePasswordSql = 'UPDATE user SET password = ? WHERE id = ?';
      pool.query(updatePasswordSql, [hash, decoded.id], (updateErr) => {
        if (updateErr) {
          console.error(
            'Erreur lors de la mise à jour du mot de passe :',
            updateErr
          );
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }

        res
          .status(200)
          .json({ message: 'Mot de passe mis à jour avec succès' });
      });
    });
  });
};

export const changeUsername = (req: Request, res: Response): void => {
  const { token, newUsername } = req.body;

  // Vérification du token JWT
  jwt.verify(token, key, (err: Error | null, decoded: any) => {
    if (err) {
      res.status(401).json({ message: 'Token invalide' });
      return;
    }

    // Mise à jour du nom d'utilisateur dans la base de données
    const updateUsernameSql = 'UPDATE user SET name = ? WHERE id = ?';
    pool.query(updateUsernameSql, [newUsername, decoded.id], (updateErr) => {
      if (updateErr) {
        console.error(
          "Erreur lors de la mise à jour du nom d'utilisateur :",
          updateErr
        );
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }

      // Mise à jour du token JWT
      const newToken = jwt.sign(
        { id: decoded.id, name: newUsername, role: decoded.role },
        key,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: "Nom d'utilisateur mis à jour avec succès",
        token: newToken,
      });
    });
  });
};

export const delete_account = (req: Request, res: Response): void => {
  const { token } = req.params;
  // Vérification du token JWT
  jwt.verify(token, key, (err: Error | null, decoded: any) => {
    if (err) {
      res.status(401).json({ message: 'Token invalide' });
      return;
    }

    // Suppression de l'utilisateur de la base de données
    const deleteSql = 'DELETE FROM user WHERE id = ?';
    pool.query(deleteSql, [decoded.id], (deleteErr) => {
      if (deleteErr) {
        console.error(
          "Erreur lors de la suppression de l'utilisateur :",
          deleteErr
        );
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }

      res.status(200).json({ message: 'Compte supprimé avec succès' });
    });
  });
};

export const select_user = (req: Request, res: Response): void => {
  const SQL = 'SELECT id, name, role FROM user';

  pool.query(SQL, (err, results: RowDataPacket[]) => {
    if (err) {
      console.error('Erreur lors de la recherche des utilisateurs :', err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }

    res.status(200).json(results);
  });
};

export const checkAuth = (req: Request, res: Response): void => {
  const token = req.cookies['token'];
  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, key);
    res.json({ authenticated: true });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      }); // Supprime le cookie expiré
      res.json({ authenticated: false, message: 'Token expiré' });
    }
    res.json({ authenticated: false });
  }
};

// ✅ Renvoie le rôle de l'utilisateur
export const getRole = (req: Request, res: Response) => {
  const token = req.cookies['token'];
  if (!token) {
    return res.json({ role: 'guest' }); // ✅ Ajout de `return`
  }

  try {
    const decoded = jwt.verify(token, key) as { role: string };
    return res.json({ role: decoded.role }); // ✅ Ajout de `return`
  } catch {
    return res.json({ role: 'guest' }); // ✅ Ajout de `return`
  }
};

// ✅ Renvoie le nom de l'utilisateur
export const getUser = (req: Request, res: Response) => {
  const token = req.cookies['token'];
  if (!token) {
    return res.json({ name: '' }); // ✅ Ajout de `return`
  }

  try {
    const decoded = jwt.verify(token, key) as { name: string };
    return res.json({ name: decoded.name }); // ✅ Ajout de `return`
  } catch {
    return res.json({ name: '' }); // ✅ Ajout de `return`
  }
};

// ✅ Route pour supprimer le cookie (déconnexion)
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Déconnexion réussie' });
};

export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;

  // Suppression de l'utilisateur de la base de données
  const deleteSql = 'DELETE FROM user WHERE id = ?';
  pool.query(deleteSql, [id], (deleteErr) => {
    if (deleteErr) {
      console.error(
        "Erreur lors de la suppression de l'utilisateur :",
        deleteErr
      );
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }

    res.status(200).json({ message: 'Compte supprimé avec succès' });
  });
};

export const updateUserPassword = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // hash du nouveau mot de passe
  bcrypt.hash(newPassword, 10, (hashErr, hash) => {
    if (hashErr) {
      res
        .status(500)
        .json({ message: 'Erreur de hashage du nouveau mot de passe' });
      return;
    }

    // Mise à jour du mot de passe de l'utilisateur dans la base de données
    const updateSql = 'UPDATE user SET password = ? WHERE id = ?';
    pool.query(updateSql, [hash, id], (updateErr) => {
      if (updateErr) {
        console.error(
          "Erreur lors de la mise à jour du mot de passe de l'utilisateur :",
          updateErr
        );
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }

      res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    });
  });
};

export const updateRoleUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { role } = req.body;

  // Mise à jour du rôle de l'utilisateur dans la base de données
  const updateSql = 'UPDATE user SET role = ? WHERE id = ?';
  pool.query(updateSql, [role, id], (updateErr) => {
    if (updateErr) {
      console.error(
        "Erreur lors de la mise à jour du rôle de l'utilisateur :",
        updateErr
      );
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }

    res.status(200).json({ message: 'Rôle mis à jour avec succès' });
  });
};
