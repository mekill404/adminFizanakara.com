import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AdminResponseDto, LoginRequestDTO } from "../lib/types/models/admin.type";
import { AuthService } from "../services/auth.service";
import toast from "react-hot-toast";

// 1. Définition de la forme du contexte
interface AuthContextType {
    user: AdminResponseDto | null;
    token: string | null;
    isAuthenticated: boolean;
    isSuperAdmin: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequestDTO) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// 2. Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AdminResponseDto | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
    const [isLoading, setIsLoading] = useState(true);

    // Initialisation : Vérifier si un utilisateur est déjà connecté
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem("auth_token");
            if (savedToken) {
                try {
                    // On récupère les infos de l'admin via la route /admins/me
                    const userData = await AuthService.getCurrentAdmin();
                    setUser(userData);
                } catch (error) {
                    console.error("Session expirée ou invalide");
                    logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    // Fonction de connexion
    const login = async (credentials: LoginRequestDTO) => {
        try {
            const response = await AuthService.login(credentials);
            // On attend de la réponse : { token: string, admin: AdminResponseDto }
            const { accessToken, admin } = response.data;

            localStorage.setItem("auth_token", accessToken);
            setToken(accessToken);
            setUser(admin);
            
            toast.success(`Bienvenue, ${admin.firstName} !`);
        } catch (error: any) {
            const message = error.response?.data?.message || "Erreur d'authentification";
            toast.error(message);
            throw error;
        }
    };

    // Fonction de déconnexion
    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
        toast.success("Déconnexion réussie");
    };

    // Rafraîchir les données utilisateur (ex: après mise à jour du profil)
    const refreshUser = async () => {
        try {
            const userData = await AuthService.getCurrentAdmin();
            setUser(userData);
        } catch (error) {
            console.error("Échec du rafraîchissement");
        }
    };

    // Dérivations d'état pratiques
    const isAuthenticated = !!token && !!user;
    const isSuperAdmin = user?.role === "SUPERADMIN";

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated, 
            isSuperAdmin, 
            isLoading, 
            login, 
            logout, 
            refreshUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};