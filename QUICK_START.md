# 🚀 Guide de Démarrage Après Corrections

## État Actuel

Tous les problèmes de connectivité backend-frontend ont été résolus :

✅ Configuration axios corrigée  
✅ Endpoints auth et admins correctement préfixés  
✅ Variables d'environnement configurées  
✅ Imports TypeScript corrigés  
✅ MemberForm.tsx restauré et fonctionnel  

---

## 1️⃣ Démarrer le Backend

```bash
cd /home/mekill404/Dev/adminFizanakara/api

# Option A : Avec Maven
mvn clean spring-boot:run

# Option B : Avec JAR (si déjà compilé)
java -jar target/api_fizanakara-*.jar
```

**Vérifications** :
- Backend écoute sur `http://localhost:3000`
- Logs ne contiennent pas d'erreurs
- Database PostgreSQL est accessible (localhost:5432)

```
spring.datasource.url=jdbc:postgresql://localhost:5432/db_fiz_cot
spring.datasource.username=postgres
spring.datasource.password=mekill404
```

---

## 2️⃣ Démarrer le Frontend

```bash
cd /home/mekill404/Dev/adminFizanakara/client

# Installation des dépendances (si nécessaire)
npm install

# Mode développement
npm run dev
```

**Vérifications** :
- Frontend accessible sur `http://localhost:5173`
- Pas d'erreurs dans le terminal
- Vite compile correctement

---

## 3️⃣ Tester la Connectivité

### Test 1 : Page de connexion
1. Ouvrir `http://localhost:5173`
2. Voir la page de login
3. Ouvrir DevTools (F12)

### Test 2 : Vérifier la requête API
1. Aller à l'onglet **Network**
2. Entrer `admin@example.com` / `1234` (ou vos credentials)
3. Cliquer "Se connecter"
4. Voir dans Network tab :
   - Requête vers `http://localhost:3000/api/auth/login`
   - Réponse 200 avec `accessToken` et `refreshToken`

### Test 3 : Vérifier les tokens
1. Ouvrir l'onglet **Console**
2. Exécuter :
   ```javascript
   localStorage.getItem('accessToken')
   localStorage.getItem('refreshToken')
   ```
3. Les deux doivent contenir des valeurs JWT (longues chaînes avec points)

### Test 4 : Accéder aux ressources
Si connecté, vous devriez pouvoir :
- Voir le dashboard
- Lister les membres → `GET /api/admins/persons`
- Ajouter un membre → `POST /api/admins/persons`
- Voir les districts → `GET /api/admins/districts`

---

## 🔴 Dépannage

### "Failed to fetch" ou "Connection refused"

**Cause** : Backend n'est pas en écoute

**Solution** :
```bash
# Vérifier que le backend tourne
curl http://localhost:3000/api/health

# Si erreur 404, le backend répond - CORS ou endpoint problem
# Si erreur de connexion, le backend ne tourne pas - redémarrer
```

### "404 Not Found" sur une requête API

**Cause** : Endpoint mal orthographié ou mauvais préfixe

**Vérifier** :
```javascript
// En console du navigateur
fetch('http://localhost:3000/api/auth/login')
  .then(r => console.log(r.status))  // Doit être 400 ou 200, pas 404
```

### "401 Unauthorized"

**Cause** : Token absent, expiré, ou invalide

**Solution** :
1. Vérifier `localStorage` :
   ```javascript
   localStorage.getItem('accessToken')
   ```
2. Si vide, se reconnecter
3. Si token présent mais rejeté :
   - Vérifier que le secret JWT du backend correspond
   - Vérifier `jwt.secret` dans `application.properties`

### "CORS Error"

**Cause** : Frontend origin non dans la liste CORS

**Vérification** :
- Backend doit avoir `localhost:5173` dans `CORS allowedOrigins`
- Voir `SecurityConfig.java` :
  ```java
  config.setAllowedOrigins(List.of(
      "http://localhost:3000",
      "http://localhost:5173"
  ));
  ```

---

## 📊 Vue d'ensemble des ports

| Service | Port | URL |
|---------|------|-----|
| Backend (Spring Boot) | 3000 | http://localhost:3000 |
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Database (PostgreSQL) | 5432 | localhost:5432 |

---

## 📁 Structure des fichiers clés

```
adminFizanakara/
├── api/
│   ├── src/main/resources/
│   │   └── application.properties        (Port 3000)
│   └── src/main/java/.../AdminsAuthController.java (@RequestMapping("/api/auth"))
│
├── client/
│   ├── .env                              (VITE_API_BASE_URL=http://localhost:3000)
│   ├── .env.production                   (Pour Render)
│   ├── src/api/
│   │   └── axios.config.ts               (Intercepteurs + baseURL)
│   └── src/services/
│       ├── auth.service.ts               (Endpoints /auth/*)
│       ├── admin.services.ts             (Endpoints /auth/*)
│       └── *.services.ts                 (Endpoints /admins/*)
│
├── CONNECTIVITY_FIX.md                   (Détails techniques)
├── CORRECTIONS_SUMMARY.md                (Résumé des changements)
└── verify-connectivity.sh                (Script de vérification)
```

---

## ✅ Checklist avant de continuer

- [ ] Backend tourne sur port 3000
- [ ] Frontend tourne sur port 5173
- [ ] Page de login s'affiche
- [ ] Login fonctionne → tokens stockés dans localStorage
- [ ] Dashboard/ressources accessibles après login
- [ ] Pas d'erreurs CORS dans la console
- [ ] Pas d'erreurs 404 ou 401 inattendus

---

## 🎯 Prochaines étapes

1. **Tests locaux** : Valider tous les CRUD (Créer, Lire, Mettre à jour, Supprimer)
2. **Déploiement** : Pousser vers le dépôt Git
3. **Production (Render)** :
   - Backend déployé sur Render
   - Frontend construit et déployé
   - Variables d'environnement configurées sur Render
   - CORS mis à jour pour l'URL de production

---

## 📞 Points de contact

**Documentation locale** :
- `CONNECTIVITY_FIX.md` → Résolution des problèmes
- `CORRECTIONS_SUMMARY.md` → Détails techniques
- `verify-connectivity.sh` → Vérification rapide

**Logs à vérifier** :
- Backend : Terminal (mvn output) ou logs Spring
- Frontend : F12 > Console et Network
- Database : Vérifier connexion avec `psql`

