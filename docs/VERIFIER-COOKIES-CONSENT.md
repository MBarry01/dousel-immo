# ✅ Guide de Vérification : Cookies et Consent Mode v2

## 🎯 Objectif

Vérifier que le système de consentement aux cookies et Google Consent Mode v2 fonctionnent correctement.

---

## 📋 Checklist de Vérification

### ✅ 1. Configuration Initiale

**Avant de commencer**, vérifiez que :
- [ ] La variable d'environnement `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-HCQXTE7LS1` est définie
- [ ] Le serveur de développement est redémarré (`npm run dev`)
- [ ] Le navigateur est en mode navigation privée (pour tester le premier chargement)

---

## 🧪 Tests Étape par Étape

### Test 1 : Premier Chargement (Bandeau de Consentement)

1. **Ouvrez le navigateur en mode navigation privée** (ou videz le localStorage)
   ```javascript
   // Dans la console du navigateur (F12)
   localStorage.removeItem('cookie-consent');
   location.reload();
   ```

2. **Ouvrez l'application** (`http://localhost:3000`)

3. **Vérifiez visuellement** :
   - ✅ Un bandeau noir apparaît en bas de la page
   - ✅ Texte : "Nous utilisons des cookies pour améliorer votre expérience..."
   - ✅ Deux boutons : "Refuser" et "Accepter"

4. **Inspectez le code source** (F12 → Console) :
   ```javascript
   // Vérifier que le consentement n'est pas encore défini
   localStorage.getItem('cookie-consent')
   // Doit retourner : null
   ```

---

### Test 2 : Vérifier le Consent Mode v2 (Avant Choix)

1. **Avant de cliquer sur Accepter/Refuser**, ouvrez la console (F12)

2. **Vérifiez que dataLayer existe** :
   ```javascript
   window.dataLayer
   // Doit retourner un tableau avec des objets de consentement
   ```

3. **Vérifiez le consentement par défaut** :
   ```javascript
   window.dataLayer
   // Cherchez un objet qui contient :
   // {
   //   0: "consent",
   //   1: "default",
   //   2: {
   //     ad_storage: "denied",
   //     analytics_storage: "denied",
   //     ...
   //   }
   // }
   ```

4. **Vérifiez que Google Analytics est chargé** :
   - Onglet **Network** (Réseau) → Filtrez par `gtag`
   - ✅ Vous devriez voir : `https://www.googletagmanager.com/gtag/js?id=G-HCQXTE7LS1`
   - ✅ Status : `200 OK` (même sans consentement)

5. **Vérifiez que gtag existe** :
   ```javascript
   typeof window.gtag
   // Doit retourner : "function"
   ```

---

### Test 3 : Accepter les Cookies

1. **Cliquez sur le bouton "Accepter"**

2. **Vérifiez visuellement** :
   - ✅ Le bandeau disparaît avec une animation

3. **Vérifiez le localStorage** :
   ```javascript
   localStorage.getItem('cookie-consent')
   // Doit retourner : "granted"
   ```

4. **Vérifiez la mise à jour du consentement dans dataLayer** :
   ```javascript
   window.dataLayer
   // Cherchez le dernier objet qui contient :
   // {
   //   0: "consent",
   //   1: "update",
   //   2: {
   //     analytics_storage: "granted",
   //     ad_storage: "granted",
   //     ...
   //   }
   // }
   ```

5. **Vérifiez les cookies** (F12 → Application → Cookies) :
   - ✅ Cookies `_ga`, `_ga_*` apparaissent (si vous êtes sur le domaine de production)
   - ⚠️ En localhost, les cookies peuvent ne pas apparaître (comportement normal de Chrome)

6. **Vérifiez dans Google Analytics** :
   - Allez sur [Google Analytics Real-Time](https://analytics.google.com/analytics/web/#/realtime)
   - ✅ Votre visite doit apparaître dans "Utilisateurs en temps réel"

---

### Test 4 : Refuser les Cookies

1. **Réinitialisez le consentement** :
   ```javascript
   localStorage.removeItem('cookie-consent');
   location.reload();
   ```

2. **Cliquez sur le bouton "Refuser"**

3. **Vérifiez le localStorage** :
   ```javascript
   localStorage.getItem('cookie-consent')
   // Doit retourner : "denied"
   ```

4. **Vérifiez la mise à jour du consentement** :
   ```javascript
   window.dataLayer
   // Le dernier objet doit contenir :
   // {
   //   0: "consent",
   //   1: "update",
   //   2: {
   //     analytics_storage: "denied",
   //     ad_storage: "denied",
   //     ...
   //   }
   // }
   ```

5. **Vérifiez qu'il n'y a PAS de cookies Google Analytics** :
   - F12 → Application → Cookies
   - ❌ Pas de cookies `_ga`, `_ga_*`

---

### Test 5 : Persistance du Choix

1. **Après avoir accepté ou refusé**, rechargez la page (F5)

2. **Vérifiez** :
   - ✅ Le bandeau ne réapparaît PAS
   - ✅ Le choix est mémorisé

3. **Vérifiez le localStorage** :
   ```javascript
   localStorage.getItem('cookie-consent')
   // Doit retourner : "granted" ou "denied" (selon votre choix précédent)
   ```

---

## 🔍 Commandes Utiles dans la Console

### Vérifier l'état actuel du consentement

```javascript
// État du localStorage
localStorage.getItem('cookie-consent')

// État dans dataLayer
window.dataLayer.filter(item => 
  Array.isArray(item) && item[0] === 'consent'
)

// Vérifier que gtag existe
typeof window.gtag

// Vérifier que dataLayer existe
Array.isArray(window.dataLayer)
```

### Simuler un choix programmatiquement

```javascript
// Accepter
localStorage.setItem('cookie-consent', 'granted');
location.reload();

// Refuser
localStorage.setItem('cookie-consent', 'denied');
location.reload();

// Réinitialiser (afficher le bandeau)
localStorage.removeItem('cookie-consent');
location.reload();
```

### Vérifier les cookies Google Analytics

```javascript
// Lister tous les cookies
document.cookie

// Vérifier spécifiquement les cookies GA
document.cookie.split(';').filter(c => c.includes('_ga'))
```

---

## 🌐 Test en Production

### Vérifier dans Google Analytics

1. **Allez sur [Google Analytics](https://analytics.google.com/)**
2. **Sélectionnez votre propriété** (ID: G-HCQXTE7LS1)
3. **Onglet "Temps réel"** :
   - ✅ Votre visite doit apparaître
   - ✅ Les événements doivent être enregistrés

### Vérifier les Headers de Sécurité

1. **Ouvrez les DevTools** (F12)
2. **Onglet Network** (Réseau)
3. **Rechargez la page** (F5)
4. **Sélectionnez la requête principale** (généralement `localhost:3000` ou votre domaine)
5. **Onglet Headers** → **Response Headers** :
   - ✅ `X-DNS-Prefetch-Control: on`
   - ✅ `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
   - ✅ `X-Frame-Options: SAMEORIGIN`
   - ✅ `X-Content-Type-Options: nosniff`
   - ✅ `Referrer-Policy: origin-when-cross-origin`
   - ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

---

## ❌ Problèmes Courants

### Le bandeau n'apparaît pas

**Solution** :
```javascript
// Vérifier si le localStorage contient déjà un choix
localStorage.getItem('cookie-consent')

// Si oui, réinitialiser :
localStorage.removeItem('cookie-consent');
location.reload();
```

### Google Analytics ne se charge pas

**Vérifications** :
1. ✅ Variable d'environnement définie : `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-HCQXTE7LS1`
2. ✅ Redémarrer le serveur après modification de `.env.local`
3. ✅ Vérifier dans Network si `gtag/js` est chargé

### Le consentement ne se met pas à jour

**Vérifications** :
1. ✅ Vérifier que `window.gtag` existe dans la console
2. ✅ Vérifier que `window.dataLayer` existe
3. ✅ Regarder les erreurs dans la console (F12 → Console)

### Les cookies ne s'activent pas après acceptation

**Causes possibles** :
- ⚠️ En localhost, Chrome peut bloquer les cookies tiers (comportement normal)
- ✅ Testez en production ou avec un domaine réel
- ✅ Vérifiez que le Consent Mode est bien mis à jour dans `dataLayer`

---

## ✅ Checklist Finale

Avant de considérer que tout est fonctionnel, vérifiez :

- [ ] Le bandeau apparaît au premier chargement
- [ ] Le Consent Mode v2 est initialisé (vérifié dans `dataLayer`)
- [ ] Google Analytics se charge (même sans consentement)
- [ ] En acceptant : les cookies sont activés (`analytics_storage: 'granted'`)
- [ ] En refusant : les cookies restent désactivés
- [ ] Le choix est mémorisé (pas de bandeau au rechargement)
- [ ] Les headers de sécurité sont présents (en production)
- [ ] Les données apparaissent dans Google Analytics Real-Time (si accepté)

---

## 🎉 Tout est OK !

Si tous les tests passent, votre système de consentement aux cookies et Google Consent Mode v2 sont **correctement configurés** ! 🚀

