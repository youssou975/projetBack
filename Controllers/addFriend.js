const mongoose = require('mongoose');
const User = require('../Models/user'); // Import du modèle User
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const addFriend = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur authentifié et l'ID de l'ami
    const userId = req.user._id;
    const friendId = req.body.friendId;

    console.log("ID de l'utilisateur authentifié:", userId);
    console.log("ID de l'ami:", friendId);

    // Vérifier que friendId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ error: 'ID d\'ami invalide' });
    }

    // Rechercher les documents utilisateur et ami dans la base de données
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    console.log("Utilisateur trouvé:", user);
    console.log("Ami trouvé:", friend);

    // Vérifier si l'utilisateur et l'ami existent
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    if (!friend) {
      return res.status(404).json({ error: 'Ami non trouvé' });
    }

    // Vérifier si l'ami est déjà dans la liste des amis
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: 'Vous êtes déjà amis' });
    }

    // Ajouter l'ami à la liste des amis de l'utilisateur
    user.friends.push(friendId);
    await user.save();

    return res.status(200).json({ message: 'Ami ajouté avec succès', friends: user.friends });
  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { addFriend };
