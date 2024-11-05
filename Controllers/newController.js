const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const News = require('../models/News'); // Importer le modèle News correctement
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

// Fonction pour aimer ou détester une news
const likeDislikeNews = async (req, res) => {
    try {
        const { newsId, action } = req.body; // "action" peut être "like" ou "dislike"
        const news = await News.findById(newsId);
        
        if (!news) {
            return res.status(404).json({ error: 'News non trouvée' });
        }

        if (action === 'like') {
            news.likes += 1;
        } else if (action === 'dislike') {
            news.dislikes += 1;
        } else {
            return res.status(400).json({ error: "Action invalide. Utilisez 'like' ou 'dislike'." });
        }

        await news.save();
        res.status(200).json({ message: 'Action appliquée avec succès', likes: news.likes, dislikes: news.dislikes });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l’action like/dislike' });
    }
};


module.exports = { addNews,addComment ,likeDislikeNews };
