This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé) ⭐

Le moyen le plus simple de déployer votre application Next.js est d'utiliser [Vercel](https://vercel.com/new) :

1. Connectez votre compte GitHub
2. Importez le dépôt `dousel-immo`
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Déployez ! 🚀

👉 [Déployer sur Vercel](https://vercel.com/new)

### Option 2 : GitHub Pages

⚠️ **Limitation** : GitHub Pages ne supporte que les sites statiques. Les fonctionnalités serveur (authentification, API routes) ne fonctionneront pas.

Pour plus de détails, consultez [docs/GITHUB-PAGES-SETUP.md](docs/GITHUB-PAGES-SETUP.md).

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
