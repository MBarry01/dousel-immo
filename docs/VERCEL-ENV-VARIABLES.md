# 🔑 Configuration des Variables d'Environnement sur Vercel

## ⚠️ Important

Pour que votre application fonctionne correctement sur Vercel, vous devez configurer les variables d'environnement dans le dashboard Vercel.

## 📋 Variables Requises

Les variables suivantes sont **obligatoires** :

### 1. `NEXT_PUBLIC_SUPABASE_URL`

L'URL de votre projet Supabase.

**Format :** `https://votre-projet.supabase.co`

**Exemple :** `https://blyanhulvwpdfpezlaji.supabase.co`

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

La clé publique "anon" de votre projet Supabase (pas la clé "service_role").

**Où la trouver :**
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez la clé **"anon"** (publique), pas **"service_role"** (secrète)

### 3. `NEXT_PUBLIC_APP_URL` (Optionnel mais recommandé)

L'URL de votre application déployée sur Vercel.

**Exemple :** `https://votre-app.vercel.app`

## 🔧 Comment Configurer sur Vercel

### Méthode 1 : Via le Dashboard Vercel (Recommandé)

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet `dousel-immo`
3. Allez dans **Settings** → **Environment Variables**
4. Cliquez sur **Add New**
5. Ajoutez chaque variable une par une :
   - **Name** : `NEXT_PUBLIC_SUPABASE_URL`
   - **Value** : Votre URL Supabase
   - **Environments** : Sélectionnez **Production**, **Preview**, et **Development**
   - Cliquez sur **Save**
6. Répétez pour `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `NEXT_PUBLIC_APP_URL`

### Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI (si pas déjà installé)
npm i -g vercel

# Se connecter
vercel login

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## 🔄 Redéployer Après Configuration

**Important :** Après avoir ajouté ou modifié des variables d'environnement, vous devez redéployer votre application :

1. Via le Dashboard :
   - Allez dans **Deployments**
   - Trouvez le dernier déploiement
   - Cliquez sur les **3 points** (⋯) → **Redeploy**

2. Via Git :
   - Faites un commit et push sur votre branche
   - Vercel redéploiera automatiquement

## ✅ Vérification

Pour vérifier que les variables sont correctement configurées :

1. Allez sur votre site déployé
2. Ouvrez la console du navigateur (F12)
3. Tapez : `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
4. Vous devriez voir votre URL Supabase

## 🐛 Problèmes Courants

### "Supabase credentials are missing"

**Cause :** Les variables d'environnement ne sont pas configurées sur Vercel.

**Solution :** Configurez les variables comme indiqué ci-dessus et redéployez.

### "Invalid API key"

**Cause :** Vous avez utilisé la clé "service_role" au lieu de "anon".

**Solution :** Utilisez la clé "anon" (publique) depuis Supabase Dashboard → Settings → API.

### Les variables ne sont pas disponibles

**Cause :** Vous avez ajouté les variables mais n'avez pas redéployé.

**Solution :** Redéployez l'application après avoir ajouté les variables.

## 📝 Exemple de Configuration Complète

Dans Vercel Dashboard → Settings → Environment Variables :

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://blyanhulvwpdfpezlaji.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (votre clé anon) | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://votre-app.vercel.app` | Production, Preview |

⚠️ **Remplacez les valeurs par vos propres identifiants !**

