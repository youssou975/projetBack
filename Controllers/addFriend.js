const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '1223444RF4';

const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    // Récupérer l'utilisateur authentifié (à partir de l'ID dans le token JWT)
    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: 'Utilisateur ou ami non trouvé' });
    }

    // Empêcher l'auto-ajout
    if (user._id.equals(friend._id)) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous ajouter vous-même en tant qu’ami' });
    }

    // Vérifier si l'ami est déjà dans la liste des amis
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà dans la liste des amis' });
    }

    // Ajouter l'ami dans les deux sens (bidirectionnel)
    user.friends.push(friendId);
    friend.friends.push(user._id);

    // Sauvegarder les deux utilisateurs
    await user.save();
    await friend.save();

    // Charger les amis avec leurs login pour l'utilisateur authentifié
    await user.populate('friends', 'login');

    res.status(200).json({
      message: 'Ami ajouté avec succès',
      friends: user.friends.map(friend => friend.login), // Renvoyer seulement les logins des amis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout d\'un ami' });
  }
};



module.exports = { addFriend };