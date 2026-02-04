import { useState, useCallback } from 'react';
import MemberService from '../services/member.services';
import type { PersonModel, PersonResponseModel, MemberStatus } from '../lib/types/models/person.models.types';

/**
 * Hook personnalisé pour la gestion des personnes
 */
export const usePersons = () => {
  const [persons, setPersons] = useState<PersonResponseModel[]>([]);
  const [currentPerson, setCurrentPerson] = useState<PersonResponseModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge toutes les personnes
   */
  const loadAllPersons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MemberService.getAll();
      setPersons(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charge une personne par son ID
   */
  const loadPersonById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await MemberService.getById(id);
      setCurrentPerson(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crée une nouvelle personne
   */
  const createPerson = useCallback(async (personData: PersonModel) => {
    setLoading(true);
    setError(null);
    try {
      const newPerson = await MemberService.create(personData);
      setPersons(prev => [...prev, newPerson]);
      return newPerson;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ajoute un enfant à un parent
   */
  const addChildToPerson = useCallback(async (parentId: string, childData: PersonModel) => {
    setLoading(true);
    setError(null);
    try {
      const child = await MemberService.addChild(parentId, childData);
      
      // Mettre à jour le parent dans la liste
      setPersons(prev => prev.map(person => {
        if (person.id === parentId) {
          return {
            ...person,
            childrenCount: person.childrenCount + 1,
            children: [...(person.children || []), child]
          };
        }
        return person;
      }));
      
      return child;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour une personne
   */
  const updatePerson = useCallback(async (id: string, updateData: Partial<PersonModel>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPerson = await MemberService.update(id, updateData as PersonModel);
      
      // Mettre à jour dans la liste
      setPersons(prev => prev.map(person => 
        person.id === id ? updatedPerson : person
      ));
      
      // Mettre à jour la personne courante si c'est celle-ci
      if (currentPerson?.id === id) {
        setCurrentPerson(updatedPerson);
      }
      
      return updatedPerson;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPerson]);

  /**
   * Promouvoir une personne à membre actif
   */
  const promoteToActiveMember = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const promotedPerson = await MemberService.promote(id);
      
      // Mettre à jour dans la liste
      setPersons(prev => prev.map(person => 
        person.id === id ? promotedPerson : person
      ));
      
      return promotedPerson;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Supprime une personne
   */
  const deletePerson = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await MemberService.delete(id);
      
      // Retirer de la liste
      setPersons(prev => prev.filter(person => person.id !== id));
      
      // Effacer la personne courante si c'est celle-ci
      if (currentPerson?.id === id) {
        setCurrentPerson(null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPerson]);

  /**
   * Charge les enfants d'un parent
   */
  const loadChildren = useCallback(async (parentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const children = await MemberService.getChildren(parentId);
      
      // Mettre à jour le parent dans la liste
      setPersons(prev => prev.map(person => {
        if (person.id === parentId) {
          return { ...person, children };
        }
        return person;
      }));
      
      return children;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Met à jour le statut d'une personne
   */
  const updatePersonStatus = useCallback(async (id: string, status: MemberStatus) => {
    return updatePerson(id, { status });
  }, [updatePerson]);

  /**
   * Efface les données locales
   */
  const clearData = useCallback(() => {
    setPersons([]);
    setCurrentPerson(null);
    setError(null);
  }, []);

  return {
    // État
    persons,
    currentPerson,
    loading,
    error,
    
    // Actions
    loadAllPersons,
    loadPersonById,
    createPerson,
    addChildToPerson,
    updatePerson,
    promoteToActiveMember,
    deletePerson,
    loadChildren,
    updatePersonStatus,
    clearData,
    
    // Utilitaires
    clearError: () => setError(null),
  };
};