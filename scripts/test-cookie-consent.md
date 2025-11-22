# 🧪 Script de Test Rapide : Cookies et Consent

## ⚡ Test Express (2 minutes)

### 1. Ouvrir la Console du Navigateur

1. Ouvrez votre application : `http://localhost:3000`
2. Appuyez sur **F12** (ou Clic droit → Inspecter)
3. Allez dans l'onglet **Console**

### 2. Réinitialiser le Consentement

```javascript
localStorage.removeItem('cookie-consent');
location.reload();
```

### 3. Vérifier que le Bandeau Apparaît

✅ Un bandeau noir doit apparaître en bas de la page

### 4. Vérifier le Consent Mode (Avant Choix)

```javascript
// Vérifier que dataLayer existe
console.log('dataLayer:', window.dataLayer);

// Vérifier le consentement par défaut
const consentDefault = window.dataLayer.find(item => 
  Array.isArray(item) && item[0] === 'consent' && item[1] === 'default'
);
console.log('Consentement par défaut:', consentDefault);

// Vérifier que gtag existe
console.log('gtag existe:', typeof window.gtag === 'function');
```

**Résultat attendu** :
- ✅ `dataLayer` est un tableau
- ✅ `consentDefault` existe et contient `analytics_storage: "denied"`
- ✅ `gtag` est une fonction

### 5. Accepter les Cookies

1. Cliquez sur le bouton **"Accepter"**
2. Vérifiez dans la console :

```javascript
// Vérifier le localStorage
console.log('Consentement:', localStorage.getItem('cookie-consent'));

// Vérifier la mise à jour du consentement
const consentUpdate = window.dataLayer.find(item => 
  Array.isArray(item) && item[0] === 'consent' && item[1] === 'update'
);
console.log('Mise à jour consentement:', consentUpdate);
```

**Résultat attendu** :
- ✅ `localStorage.getItem('cookie-consent')` = `"granted"`
- ✅ `consentUpdate` existe et contient `analytics_storage: "granted"`

### 6. Vérifier que le Bandeau ne Réapparaît Pas

```javascript
location.reload();
```

✅ Le bandeau ne doit PAS réapparaître

---

## 🔍 Tests Avancés

### Vérifier que Google Analytics est Chargé

```javascript
// Vérifier dans l'onglet Network (Réseau)
// 1. F12 → Onglet Network
// 2. Filtrez par "gtag"
// 3. Rechargez la page (F5)
// ✅ Vous devriez voir : https://www.googletagmanager.com/gtag/js?id=G-HCQXTE7LS1
```

### Vérifier les Cookies (En Production)

```javascript
// Lister tous les cookies Google Analytics
document.cookie.split(';').filter(c => c.includes('_ga'))

// Après acceptation, vous devriez voir des cookies comme :
// _ga=GA1.1.xxxxx
// _ga_XXXXXX=GS1.1.xxxxx
```

### Vérifier dans Google Analytics Real-Time

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Sélectionnez votre propriété (ID: G-HCQXTE7LS1)
3. Menu de gauche → **Temps réel**
4. ✅ Votre visite doit apparaître dans "Utilisateurs en temps réel"

---

## ❌ Dépannage Rapide

### Le bandeau n'apparaît pas

```javascript
// Vérifier si un consentement existe déjà
localStorage.getItem('cookie-consent')

// Si oui, réinitialiser :
localStorage.removeItem('cookie-consent');
location.reload();
```

### Google Analytics ne se charge pas

```javascript
// Vérifier que la variable d'environnement est définie
console.log('GA ID:', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
// Note: En production, vérifiez les variables d'environnement du déploiement

// Vérifier que gtag existe
typeof window.gtag
// Doit retourner: "function"
```

### Le consentement ne se met pas à jour

```javascript
// Vérifier que dataLayer existe
Array.isArray(window.dataLayer)

// Vérifier tous les événements de consentement
window.dataLayer.filter(item => 
  Array.isArray(item) && item[0] === 'consent'
)
```

---

## ✅ Checklist Finale

- [ ] Le bandeau apparaît au premier chargement
- [ ] `window.dataLayer` existe
- [ ] Consent Mode initialisé avec `analytics_storage: "denied"`
- [ ] Google Analytics se charge (vérifié dans Network)
- [ ] Après acceptation : `analytics_storage: "granted"` dans dataLayer
- [ ] Le choix est mémorisé (pas de bandeau au rechargement)
- [ ] Les données apparaissent dans Google Analytics Real-Time (si accepté)

---

**🎉 Si tous les tests passent, tout est raccordé correctement !**

