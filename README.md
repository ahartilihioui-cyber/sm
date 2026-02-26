# Student Manager - Gestion des Étudiants

Application complète de gestion des étudiants construite avec Next.js, SQLite et NextAuth.

## Fonctionnalités

- **Authentification** : Connexion sécurisée avec NextAuth (credentials)
- **Tableau de bord** : Statistiques et aperçu des étudiants
- **CRUD Étudiants** : Créer, lire, modifier, supprimer des étudiants
- **Recherche et filtres** : Recherche par nom/email, filtre par statut
- **Interface responsive** : Design moderne avec Tailwind CSS

## Technologies

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : API Routes Next.js
- **Base de données** : SQLite (sql.js - pur JavaScript)
- **Authentification** : NextAuth.js v4
- **Déploiement** : Vercel-ready

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env.local` à la racine :

```
NEXTAUTH_SECRET=votre-clé-secrète
NEXTAUTH_URL=http://localhost:3000
```

## Lancement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Identifiants par défaut

- **Email** : admin@school.com
- **Mot de passe** : admin123

## Structure du projet

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # Authentification NextAuth
│   │   ├── stats/               # API statistiques
│   │   └── students/            # API CRUD étudiants
│   ├── dashboard/               # Tableau de bord
│   ├── login/                   # Page de connexion
│   └── students/                # Pages étudiants
├── components/                  # Composants réutilisables
├── lib/                         # Utilitaires (DB, auth config)
└── types/                       # Définitions TypeScript
```

## Déploiement sur Vercel

Le projet est configuré pour Vercel avec `vercel.json`. Les données sont stockées en mémoire (SQLite via sql.js).

## Auteur

a.hartilihioui@esisa.ac.ma
