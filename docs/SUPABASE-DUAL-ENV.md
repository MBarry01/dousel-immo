# 🔧 Configuration Supabase pour Localhost ET Vercel

## 🎯 Objectif

Configurer Supabase pour que l'authentification fonctionne à la fois en **local** (localhost) et en **production** (Vercel) sans modifier le code.

## ✅ Configuration Supabase Dashboard

### 1. Authentication → URL Configuration

1. Allez dans votre projet Supabase Dashboard
2. **Authentication** → **URL Configuration**

#### Site URL (L'adresse principale) :
Mettez votre adresse Vercel :
```
https://dousell-immo.vercel.app
```
*(C'est l'adresse par défaut utilisée dans les emails de confirmation)*

#### Redirect URLs (La liste blanche) :
C'est ici qu'il faut ajouter votre localhost. Assurez-vous d'avoir ces **deux lignes** dans la liste :

1. `https://dousell-immo.vercel.app/**` (Pour la production)
2. `http://localhost:3000/**` (Pour votre développement)

> **Important :** Les deux étoiles `**` à la fin sont cruciales. Elles disent à Supabase "Autorise toutes les pages de ce site".

**Comment ajouter :**
- Cliquez sur **"+ Add URL"** pour chaque ligne
- Ajoutez une ligne à la fois
- Cliquez sur **Save** après chaque ajout

### 2. Google Cloud Console (OAuth)

Si vous utilisez Google OAuth, ajoutez aussi les deux URLs dans Google Cloud Console :

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com/)
2. Projet : **dousell**
3. **APIs & Services** → **Credentials**
4. Cliquez sur votre OAuth Client ID
5. Dans **"Authorized redirect URIs"**, ajoutez :
   - `https://votre-projet.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
   - `https://dousell-immo.vercel.app/auth/callback`

## 💻 Comment ça fonctionne dans le code

Le fichier `app/auth/callback/route.ts` utilise automatiquement l'origine de la requête :

```typescript
export async function GET(request: Request) {
  // 1. On récupère l'URL actuelle (que ce soit localhost ou vercel)
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. On redirige vers la même origine qui a appelé
      // Si tu es sur localhost, origin sera "http://localhost:3000"
      // Si tu es sur Vercel, origin sera "https://dousell-immo.vercel.app"
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
```

### 🔑 Points clés :

1. **`origin`** : Détecte automatiquement l'URL actuelle (localhost ou Vercel)
2. **Supabase autorise les deux adresses** : Dans les Redirect URLs
3. **Le code s'adapte automatiquement** : Utilise toujours `origin` pour rediriger

## ✅ Résultat

Avec cette configuration :

- ✅ **En local** : `http://localhost:3000` → OAuth fonctionne
- ✅ **En production** : `https://dousell-immo.vercel.app` → OAuth fonctionne
- ✅ **Un seul Client ID Google** : Pour les deux environnements
- ✅ **Même configuration Supabase** : Pour les deux environnements
- ✅ **Le code s'adapte automatiquement** : Pas besoin de changer le code

## 🧪 Tester

### En local :
```bash
npm run dev
# Allez sur http://localhost:3000/login
# Cliquez sur "Continuer avec Google"
# Ça devrait fonctionner ! ✅
```

### En production :
1. Allez sur `https://dousell-immo.vercel.app/login`
2. Cliquez sur "Continuer avec Google"
3. Ça devrait fonctionner ! ✅

## 📝 Notes importantes

- ⚠️ **N'oubliez pas** : Ajoutez les deux URLs dans Supabase Redirect URLs avec `/**` à la fin
- ✅ **Un seul Client ID Google** : Fonctionne pour localhost ET production
- ✅ **Le code utilise `origin`** : S'adapte automatiquement à l'environnement
- ✅ **Pas besoin de modifier le code** : Tout fonctionne automatiquement

## 🎉 Résultat final

Vous pouvez maintenant :
- 🔧 **Développer en local** avec `http://localhost:3000`
- 🚀 **Déployer sur Vercel** avec `https://dousell-immo.vercel.app`
- ✅ **L'authentification fonctionne** des deux côtés sans modification du code !

