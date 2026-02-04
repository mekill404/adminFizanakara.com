import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Configuration centrale de l'instance axios
 */
class AxiosConfig {
  private static instance: AxiosInstance;
  
  /**
   * Obtient l'instance singleton d'axios configurée
   */
  public static getInstance(): AxiosInstance {
    if (!AxiosConfig.instance) {
      AxiosConfig.instance = axios.create({
        baseURL: 'http://localhost:8080/api', // Base URL du backend
        timeout: 10000, // Timeout de 10 secondes
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Intercepteur pour les requêtes
      AxiosConfig.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          // Ajouter le token d'authentification si disponible
          const token = localStorage.getItem('accessToken');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Intercepteur pour les réponses
      AxiosConfig.instance.interceptors.response.use(
        (response: AxiosResponse) => {
          return response;
        },
        (error) => {
          // Gérer les erreurs 401 (non autorisé)
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Rediriger vers la page de login
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      );
    }
    
    return AxiosConfig.instance;
  }

  /**
   * Met à jour le token d'accès dans le localStorage
   */
  public static setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Récupère le token d'accès du localStorage
   */
  public static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Met à jour le token de rafraîchissement
   */
  public static setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  /**
   * Récupère le token de rafraîchissement
   */
  public static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Définit les informations de l'utilisateur connecté
   */
  public static setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  public static getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Nettoie tous les tokens et données utilisateur
   */
  public static clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export default AxiosConfig;