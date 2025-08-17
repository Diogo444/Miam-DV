import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../../environments/environment';

const key: string = environment.JWT_SECRET;

// ✅ Middleware pour vérifier si l'utilisateur est ADMIN
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['token'];

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, key) as { role: string };

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit, admin requis' });
    }

    return next(); // ✅ Continue vers la route suivante si l'utilisateur est admin
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
