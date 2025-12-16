# 🗨️ Forum Next.js

Forum web moderne permettant aux utilisateurs d'échanger publiquement ou en privé via des conversations privées.

**🌐 Application en ligne :** [https://esd-b3-dw-nextjs-forum.vercel.app/](https://esd-b3-dw-nextjs-forum.vercel.app/)

## 🚀 Démarrage rapide

### Prérequis

- Node.js v18+
- Docker & Docker Compose

### Installation

```bash
# 1. Cloner et installer
git clone https://github.com/Just1P/ESD_B3DW_nextjs-forum.git
cd ESD_B3DW_nextjs-forum
npm install

# 2. Copier le fichier d'environnement et le placer dans votre .env
cp .env.example .env

# 3. Générer le secret d'authentification
openssl rand -base64 32
# Copier le secret généré dans .env (BETTER_AUTH_SECRET)

# 4. Démarrer PostgreSQL
docker compose up -d

# 5. Initialiser la base de données
npx prisma db push
npm run seed

# 6. Lancer l'application
npm run dev
```

L'application sera disponible sur **[http://localhost:3000](http://localhost:3000)**

## ⚙️ Stack Technique

- **Next.js 15** (App Router) + TypeScript
- **PostgreSQL** + Prisma ORM
- **Better Auth** (email/password + OAuth Google/GitHub)
- **Tailwind CSS v4** + Radix UI
- **Vercel Blob** (stockage images)
- **Resend** (emails)

## 🔧 Configuration

Les variables d'environnement essentielles sont dans [.env.example](.env.example).

**Obligatoires :**

- `DATABASE_URL` : Connexion PostgreSQL (fournie par Docker)
- `BETTER_AUTH_SECRET` : Secret d'authentification (à générer)

**Optionnelles :**

- OAuth Google/GitHub : Pour l'authentification sociale
- Resend : Pour l'envoi d'emails
- Vercel Blob : Pour uploader des images de profil

## ✨ Fonctionnalités

### Forum Public
- Créer et participer à des discussions publiques
- Système de votes (upvote/downvote) sur les conversations
- Commentaires et réponses sur les discussions
- Profils utilisateurs avec statistiques

### Messages Privés
- Conversations privées entre 2 utilisateurs
- Interface dédiée pour gérer vos messages
- Démarrer une conversation depuis le profil d'un utilisateur
- Historique des conversations avec aperçu du dernier message
- Sécurité : seuls les participants peuvent voir et participer

### Authentification & Sécurité
- Authentification par email/mot de passe
- OAuth avec Google et GitHub
- Gestion de session sécurisée avec Better Auth
- Système de rôles (USER, MODERATOR, ADMIN)
- Réinitialisation de mot de passe par email

### Interface Utilisateur
- Design moderne et responsive avec Tailwind CSS
- Navigation intuitive
- Composants UI avec Radix UI
- Images de profil personnalisables
- Thème cohérent et professionnel
