# Virgin - Next.js Starter Template

Template de démarrage Next.js avec authentification, base de données Prisma, Redux et configuration clé en main.

## 🚀 Installation rapide

### Prérequis
- Node.js 18 ou supérieur
- npm ou yarn
- Git

### Installation en 5 minutes

#### 1. Cloner le projet
```bash
git clone <url-du-repo> nom_du_projet
cd nom_du_projet
```

#### 2. Configurer l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Générer une clé secrète pour NextAuth
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copier la clé générée et la coller dans `NEXTAUTH_SECRET` dans `.env.local`

#### 3. Installer les dépendances
```bash
npm install
# ou avec Make
make install
```


#### 4. Initialiser la base de données
```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma migrate dev
```

Ou avec Make :
```bash
make setup
```

#### 5. Lancer l'application
```bash
npm run dev
# ou
make dev
```

✅ **L'application est maintenant accessible sur [http://localhost:3000](http://localhost:3000)**

## 📁 Configuration

### Variables d'environnement requises

Votre fichier `.env.local` doit contenir au minimum :

```env
# Base de données
DATABASE_URL="file:./database.db"  # SQLite par défaut

# Authentification
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<votre_clé_secrète_générée>

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Structure du projet

```
virgin/
├── app/                  # Routes et pages Next.js
│   ├── api/             # Routes API
│   │   ├── auth/        # NextAuth endpoints
│   │   └── register/    # Inscription
│   ├── login/           # Page de connexion
│   ├── register/        # Page d'inscription
│   └── dashboard/       # Dashboard (protégé)
├── lib/                 # Utilitaires
│   ├── prisma.ts       # Client Prisma
│   ├── axios.ts        # Instance Axios configurée
│   └── api-response.ts # Helpers pour les réponses API
├── prisma/
│   └── schema.prisma   # Schéma de base de données
├── types/              # Types TypeScript
└── middleware.ts       # Protection des routes
```

## 🛠️ Commandes disponibles

### Avec npm
```bash
npm run dev         # Serveur de développement
npm run build       # Build de production
npm run start       # Lancer en production
npm run lint        # Vérifier le code
```

### Avec Make
```bash
# Base de données
make migrate name=nom   # Créer une migration
make studio            # Interface graphique BDD
make reset            # ⚠️ Réinitialiser la BDD
make push             # Push le schema sans migration

# Développement
make dev              # Lancer le serveur
make build            # Build de production
make lint             # Linter

# Installation
make setup            # Installation complète
make clean            # Nettoyer et réinstaller
make restart          # Redémarrage propre
```

## 🔐 Authentification

### Routes disponibles
- `/` - Page d'accueil
- `/dashboard` - Dashboard (route protégée)

### Utilisation dans le code

```typescript
// Côté client
import { useSession, signIn, signOut } from "next-auth/react"

// Connexion
await signIn("credentials", {
  email: "user@example.com",
  password: "password",
  redirect: false
})

// Déconnexion
await signOut({ callbackUrl: "/" })

// Récupérer la session
const { data: session, status } = useSession()
if (session) {
  console.log(session.user.email)
}
```

## 🗄️ Base de données

### Prisma Studio
Pour visualiser et éditer vos données :
```bash
make studio
# ou
npx prisma studio
```

### Créer une migration
```bash
make migrate name=ajout_champ_user
# ou
npx prisma migrate dev --name ajout_champ_user
```

### Modèle User par défaut
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🐛 Dépannage

### Erreur "DATABASE_URL not set"
➜ Vérifier que `.env.local` existe et contient `DATABASE_URL`

### Erreur "Invalid NEXTAUTH_SECRET"
➜ Générer une nouvelle clé :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### La base de données est corrompue
➜ Réinitialiser :
```bash
make reset
# ou
npx prisma migrate reset
```

### Les types Prisma ne sont pas reconnus
➜ Régénérer le client :
```bash
make generate
# ou
npx prisma generate
```

## 📚 Stack technique

- **Framework** : Next.js 14 (App Router)
- **Base de données** : Prisma avec SQLite (dev) / PostgreSQL (prod)
- **Authentification** : NextAuth.js
- **Styles** : Sass
- **State** : Redux Toolkit
- **HTTP Client** : Axios
- **Language** : TypeScript

## 📝 Prochaines étapes

1. Modifier le schéma Prisma selon vos besoins
2. Ajouter vos propres pages dans `/app`
3. Configurer les services externes (email, storage, etc.)
4. Personnaliser les styles dans `/styles`
5. Ajouter des middlewares Redux si nécessaire

## 🤝 Contribution

Ce projet est un template de base. N'hésitez pas à :
- Ajouter de nouvelles fonctionnalités
- Améliorer la documentation
- Proposer des optimisations

---

**Virgin** - Un départ solide pour vos projets Next.js 🚀

**Anthony Boschat**, Développeur full-stack