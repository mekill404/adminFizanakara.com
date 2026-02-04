/**
 * Représente le rôle d'un utilisateur au sein du système.
 * À adapter selon les valeurs de votre Enum Java "Role".
 */
export type Role = 'ADMIN' | 'SUPERADMIN'; // Ajustez selon votre Enum

/**
 * Réponse renvoyée par l'API après la récupération d'un administrateur.
 * Note : Le champ 'password' est volontairement exclu par sécurité.
 */
export interface AdminResponseDto {
  /** Identifiant unique de l'administrateur */
  id: string;
  /** Prénom de l'administrateur */
  firstName: string;
  /** Nom de famille de l'administrateur */
  lastName: string;
  /** Date de naissance au format ISO (YYYY-MM-DD) */
  birthDate: string;
  /** Genre de l'utilisateur (ex: MALE, FEMALE, OTHER) */
  gender: string;
  /** URL de la photo de profil */
  imageUrl: string;
  /** Numéro de téléphone au format international */
  phoneNumber: string;
  /** Adresse email professionnelle */
  email: string;
  /** Rôle assigné pour la gestion des permissions */
  role: Role;
  /** Indique si le compte a été vérifié (email/téléphone) */
  verified: boolean;
  /** Date de création du compte au format ISO */
  createdAt: string;
}

/**
 * Modèle de données pour la requête de connexion.
 */
export interface LoginRequestDto {
  /** Email utilisé comme identifiant de connexion */
  email: string;
  /** Mot de passe de l'utilisateur */
  password: string;
}

/**
 * Modèle de données pour la création d'un nouveau compte administrateur.
 */
export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  /** Date de naissance (format string recommandé pour les inputs HTML5 date) */
  birthDate: string;
  gender: string;
  imageUrl: string;
  phoneNumber: string;
  email: string;
  password: string;
}

/**
 * Modèle pour la mise à jour partielle ou totale d'un profil administrateur.
 * Tous les champs sont optionnels pour permettre des mises à jour spécifiques.
 */
export interface UpdateAdminDto {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  imageUrl?: string;
  phoneNumber?: string;
  email?: string;
  /** Nouveau mot de passe si changement souhaité */
  password?: string;
  verified?: boolean;
}

/**
 * Réponse de l'API après une authentification réussie
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    gender: string;
  };
  role: 'ADMIN' | 'SUPERADMIN';
  accessToken: string;
  refreshToken: string;
  success?: boolean;
}

/**
 * Réponse pour les opérations réussies
 */
export interface SuccessResponse {
  message: string;
  success: boolean;
}

/**
 * Réponse d'erreur standardisée
 */
export interface ErrorResponse {
  error: string;
  success: boolean;
}

/**
 * Requête pour le rafraîchissement du token
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Requête pour l'oubli de mot de passe
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Requête pour la réinitialisation de mot de passe
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Réponse du rafraîchissement du token
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * Réponse de mise à jour du profil
 */
export interface UpdateProfileResponse {
  message: string;
  success: boolean;
  user: AdminResponseDto;
}