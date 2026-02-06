#!/bin/bash
# Script de vérification de la connectivité Backend-Frontend

echo "=== Vérification de la Configuration ==="
echo ""

echo "1. Vérification des fichiers .env"
if [ -f "client/.env" ]; then
    echo "✅ client/.env existe"
    grep "VITE_API_BASE_URL" client/.env
else
    echo "❌ client/.env manquant"
fi

if [ -f "client/.env.production" ]; then
    echo "✅ client/.env.production existe"
    grep "VITE_API_BASE_URL" client/.env.production
else
    echo "❌ client/.env.production manquant"
fi

echo ""
echo "2. Vérification du port backend"
grep "server.port" api/src/main/resources/application.properties

echo ""
echo "3. Vérification des endpoints auth dans AdminsAuthController"
grep -A 2 "@RequestMapping" api/src/main/java/mg/fizanakara/api/controllers/AdminsAuthController.java | head -5

echo ""
echo "4. Vérification des imports dans services frontend"
echo "   - Recherche de endpoints /auth/"
grep -r "'/auth/" client/src/services/ | wc -l
echo "   - Recherche de endpoints /admins/"
grep -r "'/admins/" client/src/services/ | wc -l

echo ""
echo "5. Vérification de axios.config.ts"
echo "   - BaseURL configuration:"
grep "baseURL" client/src/api/axios.config.ts

echo ""
echo "=== Résumé des modifications ==="
echo ""
echo "Files modifiés:"
echo "  ✅ client/.env (créé)"
echo "  ✅ client/.env.production (créé)"
echo "  ✅ client/src/api/axios.config.ts"
echo "  ✅ client/src/services/auth.service.ts"
echo "  ✅ client/src/services/admin.services.ts"
echo "  ✅ client/src/services/contribution.services.ts"
echo "  ✅ client/src/hooks/useDistrict.ts"
echo "  ✅ client/src/hooks/useTribute.ts"
echo "  ✅ client/src/lib/validators/finance.validator.ts"
echo "  ✅ api/src/main/java/.../AdminsAuthController.java"
echo ""
echo "=== Instructions de démarrage ==="
echo ""
echo "1. Backend:"
echo "   cd api && mvn clean spring-boot:run"
echo ""
echo "2. Frontend:"
echo "   cd client && npm run dev"
echo ""
echo "3. Tester l'API:"
echo "   - Aller à http://localhost:5173"
echo "   - Essayer de se connecter"
echo "   - Vérifier F12 > Network et Console"
echo ""
