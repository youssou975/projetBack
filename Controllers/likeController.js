

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const News = require('../Models/news'); // Importer le modèle News correctement
const SECRET_KEY = '1223444RF4';
const User = require('../Models/user'); // Assurez-vous d'importer le modèle User



const likeDislikeNews = async (req, res) => {
    try {
        const { newsId, action } = req.body;
        const userId = req.user.userId;

        let news = await News.findById(newsId).populate('likedBy', 'login').populate('dislikedBy', 'login');
        
        if (!news) {
            return res.status(404).json({ error: 'News non trouvée' });
        }

        // Vérifier si l'utilisateur a déjà liké ou disliké
        const hasLiked = news.likedBy.some(user => user._id.toString() === userId);
        const hasDisliked = news.dislikedBy.some(user => user._id.toString() === userId);

        if (action === 'like') {
            if (hasLiked) {
                return res.status(400).json({ error: 'Vous avez déjà liké cette news.' });
            }
            news.likes += 1;
            news.likedBy.push(userId);

            if (hasDisliked) {
                news.dislikes -= 1;
                news.dislikedBy = news.dislikedBy.filter(user => user._id.toString() !== userId);
            }
        } else if (action === 'dislike') {
            if (hasDisliked) {
                return res.status(400).json({ error: 'Vous avez déjà disliké cette news.' });
            }
            news.dislikes += 1;
            news.dislikedBy.push(userId);

            if (hasLiked) {
                news.likes -= 1;
                news.likedBy = news.likedBy.filter(user => user._id.toString() !== userId);
            }
        } else {
            return res.status(400).json({ error: "Action invalide. Utilisez 'like' ou 'dislike'." });
        }

        news.score = news.likes - news.dislikes;
        await news.save();

        // Recharger pour inclure les utilisateurs avec leur `login`
        news = await News.findById(newsId).populate('likedBy', 'login').populate('dislikedBy', 'login');

        res.status(200).json({
            message: 'Action appliquée avec succès',
            likes: news.likes,
            dislikes: news.dislikes,
            score: news.score,
            likedBy: news.likedBy.map(user => user.login), // Liste des logins ayant liké
            dislikedBy: news.dislikedBy.map(user => user.login) // Liste des logins ayant disliké
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l’action like/dislike' });
    }
};


const getLikesDislikesUsers = async (req, res) => {
    try {
        const { newsId } = req.params;

        // Rechercher la news avec les utilisateurs qui ont liké et disliké
        const news = await News.findById(newsId)
            .populate('likedBy', 'login')
            .populate('dislikedBy', 'login');

        if (!news) {
            return res.status(404).json({ error: 'News non trouvée' });
        }

        // Créer les listes des logins
        const likedBylogins = news.likedBy.map(user => user.login);
        const dislikedBylogins = news.dislikedBy.map(user => user.login);

        // Envoyer la réponse avec les listes de likes et dislikes
        res.status(200).json({
            message: 'Liste des utilisateurs qui ont liké et disliké',
            likedBy: likedBylogins,
            dislikedBy: dislikedBylogins
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs qui ont liké et disliké' });
    }
};




const getLikedNewsTitlesByUser = async (req, res) => {
    try {
        const { login } = req.params;

        // Trouver l'utilisateur par son username
        const user = await User.findOne({ login });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Trouver les news likées par cet utilisateur
        const likedNews = await News.find({ likedBy: user._id });

        // Extraire les titres des news
        const likedNewsTitles = likedNews.map(news => news.titre);

        // Envoyer la réponse avec la liste des titres
        res.status(200).json({
            message: `Liste des titres des news aimées par ${login}`,
            titles: likedNewsTitles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des titres des news aimées par l'utilisateur" });
    }
};

module.exports = {likeDislikeNews,getLikesDislikesUsers ,getLikedNewsTitlesByUser };

