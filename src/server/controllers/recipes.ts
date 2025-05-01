import { pool } from "../db";
import { Request, Response } from "express";
import multer from "multer";
import mysql from "mysql2";
import path from "path";


// Configuration de Multer pour définir où et sous quel nom les fichiers seront stockés
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, 'uploads');  // Dossier "uploads" à la racine de ton projet
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    // Utilise un timestamp pour garantir un nom unique
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

export const getRecipes = async (req: Request, res: Response) => {
  pool.query("SELECT * FROM recettes", (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });   
};

export const getRecipe = async (req: Request, res: Response) => {
  const slug = req.params["slug"];
  pool.query("SELECT * FROM recettes WHERE slug = ?", [slug], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
}

export const addRecipe = async (req: Request, res: Response) => {
  // Utilisation de Multer pour gérer l'upload
  upload.single('image')(req, res, async (err: any) => {
    if (err) {
      console.error('Erreur lors du téléchargement de l\'image:', err); // Log de l'erreur dans la console
      return res.status(500).json({ 
        error: true, 
        message: 'Une erreur est survenue lors du téléchargement de l\'image. Veuillez réessayer.' 
      });
    }

    // Vérification de la présence des champs requis
    const { name, slug, intro, ingredients, ustensiles, preparation, conseil, presentation } = req.body;
    if (!name || !slug || !intro || !ingredients || !ustensiles || !preparation || !presentation) {
      return res.status(400).json({
        error: true,
        message: 'Tous les champs requis doivent être remplis, y compris le nom, le slug, l\'intro, etc.'
      });
    }

    // Conversion des champs ingrédients, ustensiles et préparation en tableaux
    const ingredientsArray = ingredients.split('\r\n').map((item: string) => item.trim());
    const ustensilesArray = ustensiles.split('\r\n').map((item: string) => item.trim());
    const preparationArray = preparation.split('\r\n').map((item: string) => item.trim());

    // Création de l'objet recette
    const recipe = {
      nom: name,  // Correspondance avec le nom de colonne 'nom'
      slug,
      intro,
      ingredients: ingredientsArray,  // Tableau des ingrédients
      ustensiles: ustensilesArray,     // Tableau des ustensiles
      preparation: preparationArray,  // Tableau de la préparation
      conseil,
      presentation,
      image: req.file ? req.file.path : null, // Récupère le chemin de l'image téléchargée
    };

    // Normalisation du chemin de l'image (remplacement des \ par /)
    if (recipe.image) {
      recipe.image = recipe.image.replace(/\\/g, '/');
    }

    // Enregistrement de la recette en base de données
    const query = "INSERT INTO recettes (nom, slug, intro, ingredients, ustensiles, preparation, conseil, presentation, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      recipe.nom,
      recipe.slug,
      recipe.intro,
      JSON.stringify(recipe.ingredients),  // Conversion en JSON pour l'insertion
      JSON.stringify(recipe.ustensiles),   // Conversion en JSON pour l'insertion
      JSON.stringify(recipe.preparation),  // Conversion en JSON pour l'insertion
      recipe.conseil,
      recipe.presentation,
      recipe.image
    ];

    pool.query(query, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'ajout de la recette en base de données:', err); // Log détaillé
        return res.status(500).json({
          error: true,
          message: `Une erreur est survenue lors de l'ajout de la recette: ${err.message}. Veuillez réessayer.`
        });
      }

      // Si la requête est réussie, répondre avec un message de succès
      return res.status(200).json({
        message: 'Recette ajoutée avec succès.',
        recipe
      });
    });
    return;
  });
};
