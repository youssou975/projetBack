const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userroute = require('./Routes/UserRoutes');
const newroute = require('./Routes/NewRoutes')
const scoreroute= require('./Routes/ScoreRoutes')
const addfriend=require('./Routes/AddFriend')
// Initialisation de l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/users', userroute);
app.use('/api/news', newroute);
app.use('/api/score', scoreroute);
app.use('/api/friend', addfriend);



// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
