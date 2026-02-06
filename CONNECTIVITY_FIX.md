# Résolution des problèmes de connectivité Backend-Frontend

## 🔴 Problèmes détectés

### 1. **Axios Configuration Corrompue** ✅
- **Problème** : Intercepteurs dupliqués et logique de refresh cassée
- **Solution** : Nettoyage et consolidation des intercepteurs
- **Fichier** : `client/src/api/axios.config.ts`

### 2. **URL Backend incorrecte** ✅
- **Problème** : Axios utilisait `https://fizanakara-application.onrender.com` au lieu de `http://localhost:3000`
- **Solution** : Création de fichiers `.env` avec `VITE_API_BASE_URL=http://localhost:3000`
- **Fichiers** :
  - `client/.env` (développement)
  - `client/.env.production` (production Render)

### 3. **Route Backend incorrecte** ✅
- **Problème** : `AdminsAuthController` annotée avec `@RestController("/api")` au lieu de `@RequestMapping`
- **Solution** : Modification en `@RestController` + `@RequestMapping("/api/auth")`
- **Fichier** : `api/src/main/java/mg/fizanakara/api/controllers/AdminsAuthController.java`

### 4. **Endpoints Frontend mal préfixés** ✅
- **Problème** : 
  - `auth.service.ts` appelait `/login` au lieu de `/auth/login`
  - `admin.services.ts` appelait `/login` au lieu de `/auth/login`
- **Solution** : Ajout du préfixe `/auth` à tous les endpoints d'authentification
- **Fichiers modifiés** :
  - `client/src/services/auth.service.ts`
  - `client/src/services/admin.services.ts`

## ✅ Corrections appliquées

### Frontend
```
client/.env                          → VITE_API_BASE_URL=http://localhost:3000
client/.env.production               → VITE_API_BASE_URL=https://fizanakara-api.onrender.com
client/src/api/axios.config.ts       → Intercepteurs consolidés
client/src/services/auth.service.ts  → Endpoints avec préfixe /auth
client/src/services/admin.services.ts → Endpoints avec préfixe /auth
```

### Backend
```
api/src/main/.../AdminsAuthController.java → @RequestMapping("/api/auth")
```

## 🔗 Structure d'API correcte

### Endpoints d'authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Enregistrement (SUPERADMIN)
- `GET /api/auth/admins/me` - Profil connecté
- `PATCH /api/auth/admins/me` - Mise à jour profil
- `POST /api/auth/refresh` - Rafraîchissement token
- `POST /api/auth/forgot-password` - Demande réinitialisation
- `POST /api/auth/reset-password` - Réinitialisation mot de passe

### Endpoints de gestion
- `GET /api/admins/persons` - Liste des membres
- `POST /api/admins/persons` - Créer membre
- `PATCH /api/admins/persons/{id}` - Mettre à jour membre
- `POST /api/admins/persons/{id}/children` - Ajouter enfant
- `GET /api/admins/districts` - Districts
- `GET /api/admins/tributes` - Tribus
- `GET /api/admins/contributions` - Cotisations
- `GET /api/admins/payments` - Paiements

## 🚀 Configuration locale

**Port du backend** : `3000` (application.properties)
**Port du frontend** : `5173` (Vite défaut)
**CORS configuré** pour :
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (Fallback)

## 📋 Prochaines étapes

1. Redémarrer le backend (port 3000)
2. Redémarrer le frontend (port 5173)
3. Vérifier les logs du navigateur (F12 > Console)
4. Tester login → vérifier token stocké → accéder aux ressources

## 🐛 Dépannage

**La connexion échoue** :
- Vérifier que backend est sur `http://localhost:3000`
- Vérifier `.env` du frontend : `VITE_API_BASE_URL=http://localhost:3000`
- Vérifier les logs du navigateur (Network tab)

**401 Unauthorized** :
- Token absent ou expiré
- Vérifier localStorage (accessToken, refreshToken)
- Vérifier que backend redémarre le refresh token

**404 Not Found** :
- Vérifier que endpoint existe (voir structure ci-dessus)
- Vérifier préfixes `/api/auth` ou `/api/admins`

