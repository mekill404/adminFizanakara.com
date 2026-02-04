import { PersonFilterOptions } from "../../../services/person.services";

/**
 * Énumérations basées sur les Enums Java correspondants.
 */
export type Gender = 'MALE' | 'FEMALE';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DECEASED'; // À ajuster selon vos valeurs exactes

/**
 * Interface pour la création et la mise à jour d'un membre.
 * Utilisé pour les formulaires d'ajout/édition.
 */
export interface PersonDto {
  /** Prénom du membre */
  firstName: string;
  /** Nom de famille */
  lastName: string;
  /** Date de naissance (format ISO YYYY-MM-DD) */
  birthDate: string;
  /** Genre du membre */
  gender: Gender;
  /** URL de la photo stockée */
  imageUrl: string;
  /** Contact téléphonique */
  phoneNumber: string;
  /** Statut actuel du membre dans l'organisation */
  status: MemberStatus;
  /** ID du district lié (Géolocalisation) */
  districtId: number;
  /** ID du tribut (Lien social/culturel) */
  tributeId: number;
  /** Identifiant du parent si lien de parenté existant */
  parentId?: string;
}

/**
 * Interface de réponse complète pour un membre.
 * Inclut les données calculées et les relations hiérarchiques.
 */
export interface PersonResponseDto {
  /** Identifiant unique (UUID) */
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  imageUrl: string;
  phoneNumber: string;
  /** Date d'enregistrement dans le système */
  createdAt: string;
  /** Numéro d'ordre chronologique */
  sequenceNumber: number;
  status: MemberStatus;
  /** Flag calculé par le backend pour l'état d'activité */
  isActiveMember: boolean;

  // Liens géo/événementiels
  districtId: number;
  districtName: string;
  tributeId: number;
  tributeName: string;

  // Hiérarchie & Parenté
  /** ID du parent direct */
  parentId?: string;
  /** Nom complet du parent pour l'affichage */
  parentName?: string;
  /** Nombre total d'enfants directs */
  childrenCount: number;
  /** Liste récursive des enfants (si chargée par le backend) */
  children: PersonResponseDto[];
}

/**
 * Statistiques sur les personnes
 */
export interface PersonStats {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  pendingCount: number;
  deceasedCount: number;
  maleCount: number;
  femaleCount: number;
  averageAge: number;
  childrenCount: number;
}

/**
 * Données pour les graphiques de répartition
 */
export interface DistributionData {
  byStatus: Record<MemberStatus, number>;
  byGender: Record<Gender, number>;
  byAgeGroup: Record<string, number>;
}

/**
 * Options d'export des données
 */
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeChildren: boolean;
  includeHistory: boolean;
  filters?: PersonFilterOptions;
}