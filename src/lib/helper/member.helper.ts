// utils/person.utils.ts
import type { PersonResponseDto } from '../types/models/person.type';

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Formate une date en français
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Retourne le nom complet d'une personne
 */
export const getFullName = (person: PersonResponseDto | { firstName: string; lastName: string }): string => {
  return `${person.firstName} ${person.lastName}`;
};

/**
 * Formate un numéro de téléphone malgache
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Supprimer les espaces et caractères spéciaux
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Formater selon le format malgache
  if (cleaned.length === 10) {
    return `0${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
};

/**
 * Vérifie si une personne est éligible pour la promotion (18+ ans)
 */
export const isEligibleForPromotion = (person: PersonResponseDto): boolean => {
  return calculateAge(person.birthDate) >= 18 && !person.isActiveMember;
};