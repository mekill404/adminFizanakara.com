import AxiosConfig from '../api/axios.config';
import type {
  LoginRequestDto,
  RegisterRequestDto,
  UpdateAdminDto,
  AdminResponseDto,
  LoginResponse,
  SuccessResponse,
  ErrorResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileResponse
} from '../lib/types/models/admin.type';
/**
 * Service pour la gestion des opérations d'authentification et d'administration
 */
class AdminService {
  private axios = AxiosConfig.getInstance();

  /**
   * Inscription d'un nouvel administrateur
   * @param registerData Données d'inscription
   * @returns L'administrateur créé
   * @throws {Error} Si l'inscription échoue
   */
  async register(registerData: RegisterRequestDto): Promise<AdminResponseDto> {
    try {
      const response = await this.axios.post<AdminResponseDto>('/register', registerData);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Connexion d'un administrateur
   * @param loginData Données de connexion (email et mot de passe)
   * @returns Réponse avec tokens et informations utilisateur
   * @throws {Error} Si la connexion échoue
   */
  async login(loginData: LoginRequestDto): Promise<LoginResponse> {
    try {
      const response = await this.axios.post<LoginResponse>('/login', loginData);
      const data = response.data;
      
      // Stocker les tokens et informations utilisateur
      if (data.accessToken) {
        AxiosConfig.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        AxiosConfig.setRefreshToken(data.refreshToken);
      }
      if (data.user) {
        AxiosConfig.setUser(data.user);
      }
      
      return data;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    AxiosConfig.clearAuth();
    // Rediriger vers la page de login
    window.location.href = '/login';
  }

  /**
   * Suppression d'un administrateur par son ID
   * @param id ID de l'administrateur à supprimer
   * @returns Message de succès
   * @throws {Error} Si la suppression échoue
   */
  async deleteAdmin(id: string): Promise<SuccessResponse> {
    try {
      const response = await this.axios.delete<SuccessResponse>(`/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to delete admin ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Rafraîchissement du token d'accès
   * @param refreshToken Token de rafraîchissement
   * @returns Nouveau token d'accès
   * @throws {Error} Si le rafraîchissement échoue
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const request: RefreshTokenRequest = { refreshToken };
      const response = await this.axios.post<RefreshTokenResponse>('/refresh', request);
      const data = response.data;
      
      // Mettre à jour le token d'accès
      if (data.accessToken) {
        AxiosConfig.setAccessToken(data.accessToken);
      }
      
      return data;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // Si le refresh token a expiré, déconnecter l'utilisateur
      if (error.response?.status === 401) {
        this.logout();
      }
      throw this.handleError(error);
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   * @param email Email de l'administrateur
   * @returns Message de confirmation
   * @throws {Error} Si la demande échoue
   */
  async forgotPassword(email: string): Promise<string> {
    try {
      const request: ForgotPasswordRequest = { email };
      const response = await this.axios.post<string>('/forgot-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Forgot password request failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Réinitialisation du mot de passe
   * @param token Token de réinitialisation
   * @param newPassword Nouveau mot de passe
   * @returns Message de confirmation
   * @throws {Error} Si la réinitialisation échoue
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      const request: ResetPasswordRequest = { token, newPassword };
      const response = await this.axios.post<string>('/reset-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Password reset failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupération du profil de l'administrateur connecté
   * @returns Profil de l'administrateur
   * @throws {Error} Si la récupération échoue
   */
  async getMyProfile(): Promise<AdminResponseDto> {
    try {
      const response = await this.axios.get<AdminResponseDto>('/admins/me');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupération de tous les administrateurs
   * @returns Liste de tous les administrateurs
   * @throws {Error} Si la récupération échoue
   */
  async getAllAdmins(): Promise<AdminResponseDto[]> {
    try {
      const response = await this.axios.get<AdminResponseDto[]>('/admins/all');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch all admins:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Mise à jour du profil de l'administrateur connecté
   * @param updateData Données de mise à jour
   * @returns Réponse avec message et données mises à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updateMyProfile(updateData: UpdateAdminDto): Promise<UpdateProfileResponse> {
    try {
      const response = await this.axios.patch<UpdateProfileResponse>('/admins/me', updateData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns True si un token d'accès est présent
   */
  isAuthenticated(): boolean {
    return !!AxiosConfig.getAccessToken();
  }

  /**
   * Tente de rafraîchir le token d'accès automatiquement
   * @returns Nouveau token ou null si échec
   */
  async tryAutoRefresh(): Promise<string | null> {
    try {
      const refreshToken = AxiosConfig.getRefreshToken();
      if (!refreshToken) {
        return null;
      }
      
      const response = await this.refreshToken(refreshToken);
      return response.accessToken;
    } catch {
      return null;
    }
  }

  /**
   * Gestion centralisée des erreurs
   * @param error Erreur d'axios
   * @returns Erreur formatée
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Erreur de l'API
      const apiError = error.response.data;
      return new Error(
        apiError.error || apiError.message || `API Error: ${error.response.status}`
      );
    } else if (error.request) {
      // Pas de réponse du serveur
      return new Error('Network error: Unable to reach the server');
    } else {
      // Erreur de configuration
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export d'une instance unique (singleton)
export default new AdminService();