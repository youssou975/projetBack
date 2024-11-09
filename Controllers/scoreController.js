const User = require('../Models/user'); // Assurez-vous que le modèle est bien importé
const News = require('../Models/news'); // Importer le modèle News correctement


const calculateTotalScore = async (req, res) => {
    try {
        // Récupère toutes les news dans la base de données
        const newsList = await News.find();

        // Utilise `map` pour extraire les scores dans un tableau, puis `reduce` pour additionner les scores
        const totalScore = newsList
            .map(news => news.score)        // Création d'un tableau des scores
            .reduce((sum, score) => sum + score, 0); // Somme des scores

        // Retourne le score total
        res.status(200).json({ totalScore });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du calcul du score total.', error });
    }
};

module.exports = { calculateTotalScore };
