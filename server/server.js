const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({patch: './.env'});

const adRoutes = require('./routes/ads');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const server = http.createServer(app); 

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/build/index.html'));
// });

app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false, 
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );

app.use('/api/ads', adRoutes);
app.use('/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
});

server.listen(process.env.PORT, () => {
    console.log('Server is running on port: 8000');
});