const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Assurez-vous que le modèle est bien importé
const SECRET_KEY = '1223444RF4';

// Fonction pour créer un utilisateur et le connecter automatiquement
const createUser = async (req, res) => {
    try {
        const { nom, prenom, login, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        let user = await User.findOne({ login });
        if (user) {
            return res.status(400).json({ error: 'Utilisateur existe déjà' });
        }

        // Hacher le mot de passe et créer un nouvel utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ nom, prenom, login, password: hashedPassword });
        await user.save();

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, login: user.login }, SECRET_KEY, { expiresIn: '1h' });

        // Retourner le token
        res.status(201).json({
            message: 'Utilisateur créé et connecté avec succès',
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
    }
};

// Fonction pour se connecter
const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(400).json({ error: 'Login ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Login ou mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id, login: user.login }, SECRET_KEY, { expiresIn: '1h' });

        // Retourner le token
        res.status(200).json({
            message: 'Connexion réussie',
            token
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};




module.exports = { createUser, loginUser };
