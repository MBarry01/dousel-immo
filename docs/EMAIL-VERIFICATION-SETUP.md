# Configuration des emails de vérification Gmail

## Vue d'ensemble

Les emails de vérification de compte sont maintenant envoyés **uniquement via Gmail** (mb3186802@gmail.com). Supabase n'envoie plus d'emails automatiquement. Cela permet d'avoir un contrôle total sur le design et le contenu des emails.

## Configuration requise

### 1. Variables d'environnement

Ajoutez dans `.env.local` :

```env
# Gmail (déjà configuré)
GMAIL_USER=mb3186802@gmail.com
GMAIL_APP_PASSWORD=zpgvuyffanvdiyio

# Supabase Service Role Key (pour générer les liens de confirmation)
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

### 2. Obtenir SUPABASE_SERVICE_ROLE_KEY

1. Allez sur votre [Dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez la **`service_role` key** (⚠️ **NE JAMAIS** exposer cette clé côté client)

⚠️ **Sécurité** : Cette clé donne un accès complet à votre base de données. Ne la commitez **JAMAIS** dans Git.

## Fonctionnement

### Flux d'inscription

1. **Utilisateur s'inscrit** → `app/auth/actions.ts` → `signup()`
2. **Supabase crée le compte** → `supabase.auth.signUp()`
3. **Si email de confirmation requis** :
   - `sendVerificationEmailGmail()` est appelée avec le mot de passe de l'utilisateur
   - Génère le lien de confirmation via l'API Admin Supabase (`admin.generateLink`)
   - Envoie l'email **uniquement via Gmail** avec le template personnalisé
   - **Supabase n'envoie pas d'email** (désactivé)
4. **Utilisateur clique sur le lien** → Redirigé vers `/auth/callback` → Compte confirmé

### Important

- Le mot de passe de l'utilisateur est nécessaire pour générer le lien de confirmation
- Le mot de passe n'est jamais stocké, il est utilisé uniquement lors de l'inscription
- Pour renvoyer l'email, l'utilisateur devra réinitialiser son mot de passe

### Template d'email

Le template est défini dans `emails/verification-email.tsx` :
- Design professionnel avec logo Doussel Immo
- Bouton de confirmation cliquable
- Lien de secours si le bouton ne fonctionne pas
- Responsive et compatible tous clients email

## Désactiver l'envoi automatique Supabase

**Recommandé** : Désactivez l'envoi automatique d'emails dans Supabase pour éviter les doublons :

1. Dashboard Supabase → **Authentication** → **Providers** → **Email**
2. Décochez **"Enable email confirmations"** ou configurez un template vide
3. Tous les emails seront envoyés uniquement via Gmail

## Test

### Test manuel

```bash
npm run test:verification
```

### Test dans l'application

1. Allez sur `/register`
2. Créez un compte avec un email valide
3. Vérifiez votre boîte de réception
4. Vous devriez recevoir un email avec le design Doussel Immo

## Renvoyer un email de confirmation

**Note importante** : Pour renvoyer un email de confirmation, le mot de passe de l'utilisateur est nécessaire. Comme le mot de passe n'est pas stocké après l'inscription, l'utilisateur devra :

1. Utiliser la fonctionnalité "Mot de passe oublié" sur la page de connexion
2. Ou contacter le support pour réinitialiser son compte

Le bouton "Renvoyer l'email" sur la page d'inscription a été désactivé pour cette raison.

## Dépannage

### Erreur : "SUPABASE_SERVICE_ROLE_KEY non défini"

**Solution** : Ajoutez `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

**Note** : Sans cette clé, le système utilisera `resend()` de Supabase comme fallback, mais Supabase enverra aussi son propre email (doublon possible).

### L'utilisateur reçoit 2 emails

**Cause** : Supabase envoie toujours son email par défaut + votre email Gmail

**Solution** : Désactivez "Enable email confirmations" dans Supabase Dashboard

### Le lien de confirmation ne fonctionne pas

**Vérifiez** :
1. Que `NEXT_PUBLIC_APP_URL` est correct dans `.env.local`
2. Que la route `/auth/callback` existe et fonctionne
3. Que le token n'a pas expiré (24h par défaut)

## Avantages de Gmail

✅ **Design personnalisé** : Contrôle total sur l'apparence  
✅ **Nom d'expéditeur professionnel** : "Doussel Immo Support"  
✅ **Pas de limite de domaine** : Fonctionne immédiatement  
✅ **Logging détaillé** : Voir les emails envoyés dans les logs  
✅ **Gratuit** : Jusqu'à 500 emails/jour avec Gmail gratuit

## Limites

⚠️ **500 emails/jour** pour les comptes Gmail gratuits  
⚠️ **Pas de tracking** : Pas de statistiques d'ouverture/clics  
⚠️ **Risque spam** : Les emails peuvent arriver en spam

Pour la production à grande échelle, considérez :
- **SendGrid** : 100 emails/jour gratuits, tracking inclus
- **Resend** : Service moderne avec React Email
- **Postmark** : Spécialisé transactionnel

## Références

- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-generatelink)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [React Email](https://react.email/)


## Vue d'ensemble

Les emails de vérification de compte sont maintenant envoyés **uniquement via Gmail** (mb3186802@gmail.com). Supabase n'envoie plus d'emails automatiquement. Cela permet d'avoir un contrôle total sur le design et le contenu des emails.

## Configuration requise

### 1. Variables d'environnement

Ajoutez dans `.env.local` :

```env
# Gmail (déjà configuré)
GMAIL_USER=mb3186802@gmail.com
GMAIL_APP_PASSWORD=zpgvuyffanvdiyio

# Supabase Service Role Key (pour générer les liens de confirmation)
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

### 2. Obtenir SUPABASE_SERVICE_ROLE_KEY

1. Allez sur votre [Dashboard Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Copiez la **`service_role` key** (⚠️ **NE JAMAIS** exposer cette clé côté client)

⚠️ **Sécurité** : Cette clé donne un accès complet à votre base de données. Ne la commitez **JAMAIS** dans Git.

## Fonctionnement

### Flux d'inscription

1. **Utilisateur s'inscrit** → `app/auth/actions.ts` → `signup()`
2. **Supabase crée le compte** → `supabase.auth.signUp()`
3. **Si email de confirmation requis** :
   - `sendVerificationEmailGmail()` est appelée avec le mot de passe de l'utilisateur
   - Génère le lien de confirmation via l'API Admin Supabase (`admin.generateLink`)
   - Envoie l'email **uniquement via Gmail** avec le template personnalisé
   - **Supabase n'envoie pas d'email** (désactivé)
4. **Utilisateur clique sur le lien** → Redirigé vers `/auth/callback` → Compte confirmé

### Important

- Le mot de passe de l'utilisateur est nécessaire pour générer le lien de confirmation
- Le mot de passe n'est jamais stocké, il est utilisé uniquement lors de l'inscription
- Pour renvoyer l'email, l'utilisateur devra réinitialiser son mot de passe

### Template d'email

Le template est défini dans `emails/verification-email.tsx` :
- Design professionnel avec logo Doussel Immo
- Bouton de confirmation cliquable
- Lien de secours si le bouton ne fonctionne pas
- Responsive et compatible tous clients email

## Désactiver l'envoi automatique Supabase

**Recommandé** : Désactivez l'envoi automatique d'emails dans Supabase pour éviter les doublons :

1. Dashboard Supabase → **Authentication** → **Providers** → **Email**
2. Décochez **"Enable email confirmations"** ou configurez un template vide
3. Tous les emails seront envoyés uniquement via Gmail

## Test

### Test manuel

```bash
npm run test:verification
```

### Test dans l'application

1. Allez sur `/register`
2. Créez un compte avec un email valide
3. Vérifiez votre boîte de réception
4. Vous devriez recevoir un email avec le design Doussel Immo

## Renvoyer un email de confirmation

**Note importante** : Pour renvoyer un email de confirmation, le mot de passe de l'utilisateur est nécessaire. Comme le mot de passe n'est pas stocké après l'inscription, l'utilisateur devra :

1. Utiliser la fonctionnalité "Mot de passe oublié" sur la page de connexion
2. Ou contacter le support pour réinitialiser son compte

Le bouton "Renvoyer l'email" sur la page d'inscription a été désactivé pour cette raison.

## Dépannage

### Erreur : "SUPABASE_SERVICE_ROLE_KEY non défini"

**Solution** : Ajoutez `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`

**Note** : Sans cette clé, le système utilisera `resend()` de Supabase comme fallback, mais Supabase enverra aussi son propre email (doublon possible).

### L'utilisateur reçoit 2 emails

**Cause** : Supabase envoie toujours son email par défaut + votre email Gmail

**Solution** : Désactivez "Enable email confirmations" dans Supabase Dashboard

### Le lien de confirmation ne fonctionne pas

**Vérifiez** :
1. Que `NEXT_PUBLIC_APP_URL` est correct dans `.env.local`
2. Que la route `/auth/callback` existe et fonctionne
3. Que le token n'a pas expiré (24h par défaut)

## Avantages de Gmail

✅ **Design personnalisé** : Contrôle total sur l'apparence  
✅ **Nom d'expéditeur professionnel** : "Doussel Immo Support"  
✅ **Pas de limite de domaine** : Fonctionne immédiatement  
✅ **Logging détaillé** : Voir les emails envoyés dans les logs  
✅ **Gratuit** : Jusqu'à 500 emails/jour avec Gmail gratuit

## Limites

⚠️ **500 emails/jour** pour les comptes Gmail gratuits  
⚠️ **Pas de tracking** : Pas de statistiques d'ouverture/clics  
⚠️ **Risque spam** : Les emails peuvent arriver en spam

Pour la production à grande échelle, considérez :
- **SendGrid** : 100 emails/jour gratuits, tracking inclus
- **Resend** : Service moderne avec React Email
- **Postmark** : Spécialisé transactionnel

## Références

- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-generatelink)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [React Email](https://react.email/)

