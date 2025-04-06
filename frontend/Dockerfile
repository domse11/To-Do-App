# Basis-Image mit Node.js
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Nur package.json zuerst kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Rest des Codes kopieren
COPY . .

# React-App im Entwicklungsmodus starten
CMD ["npm", "start"]
