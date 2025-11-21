# ⚠️ GitHub Pages Workflow Désactivé

## Pourquoi ?

Le workflow GitHub Pages a été **désactivé** car ce projet Next.js utilise des fonctionnalités serveur qui ne sont **pas compatibles** avec GitHub Pages :

### ❌ Fonctionnalités incompatibles :

1. **Server Actions** (`app/auth/actions.ts`)
   - L'authentification, l'inscription et la connexion utilisent des Server Actions
   - GitHub Pages ne supporte que les sites statiques

2. **API Routes** (`app/auth/callback/route.ts`)
   - Les routes API nécessitent un serveur Node.js
   - GitHub Pages ne peut pas exécuter de code serveur

3. **Middleware** (`middleware.ts`)
   - Le middleware Next.js nécessite un serveur
   - Impossible à exporter statiquement

4. **Server Components dynamiques**
   - Les pages qui utilisent `async` et récupèrent des données depuis Supabase côté serveur
   - Nécessitent un environnement serveur

## ✅ Solution Recommandée : Vercel

**Vercel** est la meilleure option pour déployer ce projet :

1. ✅ **Support complet** de toutes les fonctionnalités Next.js
2. ✅ **Déploiement automatique** depuis GitHub
3. ✅ **Gratuit** pour les projets open source
4. ✅ **Configuration simple** (détection automatique)

### Déployer sur Vercel :

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Connectez votre compte GitHub
3. Importez le dépôt `dousel-immo`
4. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Déployez ! 🚀

Votre site sera disponible en quelques minutes avec toutes les fonctionnalités !

## 🔧 Réactiver GitHub Pages (Non Recommandé)

Si vous voulez absolument utiliser GitHub Pages (avec des limitations), vous devrez :

1. Supprimer toutes les Server Actions
2. Supprimer toutes les API routes
3. Supprimer le middleware
4. Convertir toutes les Server Components en Client Components
5. Utiliser uniquement des appels API côté client vers Supabase

**⚠️ Cela casserait toutes les fonctionnalités d'authentification et d'administration.**

## 📋 État Actuel

- ✅ **Workflow désactivé** : Ne se déclenchera plus automatiquement
- ✅ **Déploiement manuel possible** : Via `workflow_dispatch` si nécessaire
- ✅ **Vercel recommandé** : Pour un déploiement complet sans limitations

