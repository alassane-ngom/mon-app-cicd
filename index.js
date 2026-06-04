const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src/public'));

const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Hello CI/CD World! 🚀',
    status: 'ok'
  });
});
app.get('/api/health', (req, res) => {
  return res.json({
    message: "Hello CI/CD World! 🚀",
    status: "ok"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
}

module.exports = app;