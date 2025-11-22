# 🔐 Configuration Google Analytics avec Consent Mode v2

## 📋 Vue d'ensemble

Dousell Immo utilise **Google Consent Mode v2** avec un système de consentement aux cookies conforme RGPD/EEE (Espace économique européen).

### ✨ Avantages du Consent Mode v2

- ✅ **Conformité EEE** : Respecte les exigences de l'Union européenne
- ✅ **Données modélisées** : Collecte de données agrégées même sans consentement
- ✅ **Cookies conditionnels** : Les cookies ne sont activés que si l'utilisateur accepte
- ✅ **Recommandation Google** : Méthode officielle recommandée par Google Analytics

## 🔑 Configuration

### 1. Variable d'environnement

Ajoutez votre ID Google Analytics dans votre fichier `.env.local` (développement) et dans les variables d'environnement de votre plateforme de déploiement (production) :

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-HCQXTE7LS1
```

**⚠️ Important** :
- Pour le développement local : Créez/modifiez `.env.local` à la racine du projet
- Pour la production : Configurez cette variable dans votre plateforme de déploiement (Vercel, Netlify, etc.)

### 2. Fonctionnement avec Consent Mode v2

Le système fonctionne automatiquement :

1. **Initialisation** : Consent Mode est initialisé avec les cookies **refusés par défaut**
2. **Chargement Google Analytics** : GA est chargé immédiatement mais **sans cookies** (mode refusé)
3. **Bandeau de consentement** : Au premier chargement, un bandeau apparaît en bas de la page
4. **Choix utilisateur** : L'utilisateur peut accepter ou refuser les cookies
5. **Mise à jour du consentement** : Le consentement est mis à jour dans Google Analytics :
   - **Accepté** : Les cookies sont activés (analytics_storage, ad_storage, etc.)
   - **Refusé** : Les cookies restent désactivés, mais les données modélisées continuent
6. **Stockage** : Le choix est sauvegardé dans `localStorage` (clé `cookie-consent`)

### 🔍 Mode de fonctionnement

**Sans consentement** :
- ❌ Pas de cookies Google Analytics
- ✅ Collecte de données modélisées (agrégées, anonymisées)
- ✅ Mesure basique du trafic

**Avec consentement** :
- ✅ Cookies activés (analytics_storage)
- ✅ Données précises et personnalisées
- ✅ Fonctionnalités complètes de Google Analytics

### 3. Vérification

Après configuration :

1. **Redémarrez le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Ouvrez votre application** dans le navigateur

3. **Inspectez le code source** :
   - Le script gtag.js est **toujours chargé** (même sans consentement)
   - Vérifiez la console : vous verrez `gtag('consent', 'default', {...})` au chargement
   - Quand l'utilisateur accepte : `gtag('consent', 'update', {...})` avec `analytics_storage: 'granted'`

4. **Vérifier le Consent Mode** :
   - Ouvrez les DevTools (F12)
   - Onglet Console : Tapez `window.dataLayer`
   - Vous devriez voir les événements de consentement

### 4. Code généré

Le composant génère automatiquement le code avec Consent Mode v2 :

```html
<!-- Consent Mode v2 (chargé en premier) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Consentement par défaut : REFUSÉ (conforme EEE)
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
</script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HCQXTE7LS1"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-HCQXTE7LS1');
  
  // Si l'utilisateur accepte (mise à jour automatique) :
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    // ...
  });
</script>
```

## 🎨 Personnalisation

Le bandeau de consentement peut être personnalisé dans `components/ui/cookie-consent.tsx`.

## 🔒 Conformité RGPD/EEE

- ✅ **Consent Mode v2** : Méthode recommandée par Google pour l'EEE
- ✅ **Cookies refusés par défaut** : Conforme aux exigences européennes
- ✅ **Consentement explicite** : Les cookies ne s'activent qu'après acceptation
- ✅ **Données modélisées** : Continuation de la mesure même sans cookies (anonymisées)
- ✅ **Choix stocké localement** : Le consentement est mémorisé dans `localStorage`
- ✅ **Possibilité de refuser** : L'utilisateur peut refuser les cookies
- ✅ **Respect de la vie privée** : Conforme aux directives européennes

### 📊 Différence avec l'ancienne méthode

**Ancienne méthode** (sans Consent Mode) :
- ❌ Google Analytics ne se charge pas sans consentement
- ❌ Perte totale de données pour les utilisateurs qui refusent
- ⚠️ Moins conforme aux recommandations Google pour l'EEE

**Consent Mode v2** (méthode actuelle) :
- ✅ Google Analytics se charge toujours
- ✅ Collecte de données modélisées même sans consentement
- ✅ Cookies activés seulement après consentement
- ✅ Meilleure conformité EEE
- ✅ Recommandation officielle Google

## 🧪 Guide de Vérification Complet

Pour vérifier que tout fonctionne correctement, consultez le **[Guide de Vérification détaillé](VERIFIER-COOKIES-CONSENT.md)** qui inclut :
- ✅ Checklist de vérification étape par étape
- ✅ Commandes utiles dans la console
- ✅ Tests pour accepter/refuser les cookies
- ✅ Vérification du Consent Mode v2
- ✅ Vérification des headers de sécurité
- ✅ Résolution des problèmes courants

## 🧹 Réinitialiser le consentement (Développement)

Pour tester à nouveau le bandeau, supprimez la clé dans la console du navigateur :

```javascript
localStorage.removeItem('cookie-consent');
// Puis rechargez la page (F5)
```

