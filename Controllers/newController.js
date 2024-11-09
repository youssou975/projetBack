const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const News = require('../Models/news'); // Importer le modèle News correctement
const SECRET_KEY = '1223444RF4';

const addNews = async (req, res) => {
    try {
        const { url, titre } = req.body; // Supprimez dateAjout de la désignation
        const auteur = req.user.login; // Utilisateur authentifié via le token JWT

        // Vérifier si la news avec la même URL existe déjà
        const existingNews = await News.findOne({ url });
        if (existingNews) {
            return res.status(409).json({ message: 'La news avec cette URL existe déjà.' });
        }

        // Créer et enregistrer la nouvelle news
        const news = new News({
            url,
            titre,
            dateAjout: new Date().toISOString(), // Assurez-vous d'ajouter cette ligne ici
            auteur
        });

        await news.save();

        res.status(201).json({ message: 'News ajoutée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’ajout de la news:', error); 
        res.status(500).json({ error: 'Erreur lors de l’ajout de la news.' });
    }
};
// Fonction pour commenter une news
const addComment = async (req, res) => {
    try {
        const { newsId, texte } = req.body;
        const auteur = req.user.login; // Utilisateur authentifié via le token JWT

        // Trouver la news
        const news = await News.findById(newsId);
        if (!news) {
            return res.status(404).json({ error: 'News non trouvée' });
        }

        // Ajouter le commentaire
        const comment = { auteur, texte };
        news.commentaires.push(comment);
        await news.save();

        res.status(201).json({ message: 'Commentaire ajouté avec succès', commentaires: news.commentaires });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire' });
    }
};



const traiteReponseNews = async (req, res) => {
    try {
      // Récupérer toutes les news depuis la base de données
      const newsList = await News.find();  // Retrieve all news from the database
  
      // Vérification si des news existent
      if (newsList.length === 0) {
        return res.status(404).json({ message: 'Aucune news trouvée.' });
      }
  
      // Traitement de la liste pour l'affichage (par exemple, formater les titres)
      const formattedNews = newsList.map(news => ({
        titre: news.titre,
        url: news.url,
        dateAjout: news.dateAjout,
        auteur: news.auteur,
        likes:news.likes,
        dislikes:news.Dislikes,
        commentaires:news.commentaires
      }));
  
      // Retourner les news formatées
      res.status(200).json({ formattedNews });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors du traitement des news.', error });
    }
  };
  
  module.exports = { traiteReponseNews };
  
module.exports = { addNews,addComment  , traiteReponseNews };
