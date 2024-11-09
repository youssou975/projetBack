const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    auteur: { type: String, required: true },
    texte: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const newsSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    titre: { type: String, required: true },
    dateAjout: { type: String, required: true },
    auteur: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des utilisateurs ayant liké
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] ,
    score:{type:Number,default:0},
    commentaires: [commentSchema] // Liste des commentaires
});

module.exports = mongoose.model('News', newsSchema);
