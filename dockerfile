# Image de base : Node.js version 20 légère (alpine = très léger)
FROM node:20-alpine

# Définir le dossier de travail dans la boîte Docker
WORKDIR /app

# Copier les fichiers de dépendances en premier (optimisation)
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier tout le reste du code
COPY . .

# Le port que l'app utilise
EXPOSE 3000

# Commande pour démarrer l'app
CMD ["node", "index.js"]