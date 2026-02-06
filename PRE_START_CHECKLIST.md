# ✅ Checklist de Connectivité - Avant de Démarrer

## Pré-requis Système

- [ ] Java 17+ installé
- [ ] Maven installé
- [ ] Node.js 18+ installé
- [ ] PostgreSQL lancé sur localhost:5432
- [ ] Base de données `db_fiz_cot` créée

**Vérifier** :
```bash
java -version        # Java 17+
mvn -version         # Maven
node -v              # Node 18+
psql -U postgres     # PostgreSQL connecté
```

---

## Backend - Préparation

- [ ] Fichier `api/src/main/resources/application.properties` vérifié
  - [ ] `server.port=3000`
  - [ ] `spring.datasource.url=jdbc:postgresql://localhost:5432/db_fiz_cot`
  - [ ] `spring.datasource.username=postgres`
  - [ ] `spring.datasource.password=mekill404`

- [ ] `AdminsAuthController.java` contient `@RequestMapping("/api/auth")`
  ```bash
  grep -n "@RequestMapping" api/src/main/java/mg/fizanakara/api/controllers/AdminsAuthController.java
  # Doit afficher: @RequestMapping("/api/auth")
  ```

- [ ] Tous les autres controllers ont `@RequestMapping("/api/admins/...")`
  ```bash
  grep -n "@RequestMapping" api/src/main/java/mg/fizanakara/api/controllers/*.java
  # Doit afficher 6 lignes avec /api/auth ou /api/admins
  ```

---

## Frontend - Préparation

- [ ] Fichier `client/.env` existe
  ```bash
  cat client/.env
  # Doit afficher: VITE_API_BASE_URL=http://localhost:3000
  ```

- [ ] Fichier `client/.env.production` existe
  ```bash
  cat client/.env.production
  # Doit afficher: VITE_API_BASE_URL=https://fizanakara-api.onrender.com
  ```

- [ ] Fichier `client/src/api/axios.config.ts` corrigé
  ```bash
  grep "baseURL" client/src/api/axios.config.ts
  # Doit afficher: baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
  ```

- [ ] Services contiennent `/auth/` et `/admins/`
  ```bash
  grep -r "'/auth/" client/src/services/ | wc -l  # Doit être > 10
  grep -r "'/admins/" client/src/services/ | wc -l # Doit être > 10
  ```

---

## Démarrage du Backend

```bash
cd api
mvn clean spring-boot:run
```

**Vérifier** :
- [ ] Terminal affiche `Started ApiApplication`
- [ ] Pas d'erreur "Port already in use"
- [ ] Database connect : `Hibernate: ...` dans les logs
- [ ] Serveur écoute sur `localhost:3000`

**Test rapide** :
```bash
curl http://localhost:3000/api/health
# Doit retourner 200 OK
```

---

## Démarrage du Frontend

**(Dans un nouveau terminal)**

```bash
cd client
npm install  # Si première fois
npm run dev
```

**Vérifier** :
- [ ] Terminal affiche `Local: http://localhost:5173`
- [ ] Pas d'erreur de compilation TypeScript
- [ ] Page de login s'affiche correctement

---

## Test de Connectivité

### 1. Ouvrir le navigateur

```
http://localhost:5173
```

- [ ] Page de login affichée
- [ ] Pas de page blanche ou erreur

### 2. Ouvrir DevTools (F12)

- [ ] Onglet **Console** : pas d'erreur rouge
- [ ] Onglet **Network** : activer (pour observer les requêtes)

### 3. Tester la connexion

Entrer les credentials (exemple) :
- Email : `admin@example.com`
- Mot de passe : `1234`

Cliquer "Se connecter"

**Dans Network Tab** :
- [ ] Voir une requête `POST http://localhost:3000/api/auth/login`
- [ ] Réponse : `Status 200` (OK)
- [ ] Response contient `accessToken` et `refreshToken`

**Exemple de réponse** :
```json
{
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstname": "...",
    "lastname": "..."
  },
  "role": "SUPERADMIN",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 4. Vérifier les tokens stockés

**En console (F12)** :
```javascript
localStorage.getItem('accessToken')
// Doit afficher une longue chaîne (JWT)

localStorage.getItem('refreshToken')
// Doit afficher une longue chaîne (JWT)
```

### 5. Accéder aux ressources

Si connecté, la page devrait afficher :
- [ ] Dashboard
- [ ] Menu de navigation
- [ ] Liste des membres (si endpoint fonctionne)

**Dans Network Tab** :
- [ ] Requête `GET http://localhost:3000/api/admins/persons`
- [ ] Status 200
- [ ] Response contient un array de membres

---

## Dépannage Rapide

### "Failed to fetch" / Connection refused

```bash
# Vérifier que backend est en écoute
curl http://localhost:3000/api/health
# Doit retourner 200, sinon redémarrer backend
```

### "404 Not Found"

```bash
# Vérifier l'endpoint exact
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"1234"}'
# Doit retourner 200 ou 401 (pas 404)
```

### "CORS error"

**Console du navigateur** :
```
Access to XMLHttpRequest at 'http://localhost:3000/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution** : Vérifier `SecurityConfig.java` :
```java
config.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "http://localhost:5173"
));
```

---

## ✅ Tout fonctionne?

Si tous les tests passent :

- [ ] Page login s'affiche
- [ ] Login réussit (tokens reçus et stockés)
- [ ] Dashboard accessible
- [ ] Ressources listées (membres, districts, etc.)
- [ ] Pas d'erreurs Console ou Network
- [ ] Pas d'erreurs CORS

**Vous pouvez continuer au développement des features!**

---

## 📋 Points à retenir

| Point | Valeur |
|-------|--------|
| Backend port | `3000` |
| Frontend port | `5173` |
| Axios baseURL (dev) | `http://localhost:3000` |
| Auth endpoint prefix | `/api/auth/` |
| Admins endpoint prefix | `/api/admins/` |
| Database port | `5432` |
| Database | `db_fiz_cot` |
| Auth method | JWT + Refresh Token |

