const jwt = require('jsonwebtoken');
const SECRET_KEY = '1223444RF4'; // Utiliser une clé sécurisée pour la production

// Middleware pour vérifier l'authentification
function authMiddleware(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token JWT de l'en-tête

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Vérifie le token JWT
        req.user = decoded; // Ajoute les informations de l'utilisateur à la requête
        next(); // Passe à la route suivante
    } catch (error) {
        res.status(400).json({ error: 'Token invalide.' });
    }
}

module.exports = authMiddleware;
