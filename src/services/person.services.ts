import AxiosConfig from '../api/axios.config';
import type {
  PersonDto,
  PersonResponseDto,
  MemberStatus,
  Gender
} from '../lib/types/models/person.type';

/**
 * Réponse standard pour les opérations de suppression
 */
interface DeleteResponse {
  message: string;
  success: boolean;
}

/**
 * Options de filtrage pour la récupération des personnes
 */
export interface PersonFilterOptions {
  status?: MemberStatus;
  gender?: Gender;
  districtId?: number;
  tributeId?: number;
  parentId?: string;
  isActiveMember?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Service pour la gestion des personnes/membres
 */
class PersonService {
  private axios = AxiosConfig.getInstance();
  private basePath = '/admins/persons';

  /**
   * Récupère toutes les personnes
   * @param filters Options de filtrage optionnelles
   * @returns Liste de toutes les personnes
   */
  async getAllPersons(filters?: PersonFilterOptions): Promise<PersonResponseDto[]> {
    try {
      const params = filters ? this.buildFilterParams(filters) : {};
      const response = await this.axios.get<PersonResponseDto[]>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch persons:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère une personne par son ID
   * @param id ID de la personne
   * @returns Les informations de la personne
   */
  async getPersonById(id: string): Promise<PersonResponseDto> {
    try {
      const response = await this.axios.get<PersonResponseDto>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch person ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Crée une nouvelle personne
   * @param personData Données de la personne à créer
   * @returns La personne créée
   */
  async createPerson(personData: PersonDto): Promise<PersonResponseDto> {
    try {
      const response = await this.axios.post<PersonResponseDto>(this.basePath, personData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create person:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Promouvoir une personne à membre actif (à partir de 18 ans)
   * @param id ID de la personne à promouvoir
   * @returns La personne mise à jour
   */
  async promoteToActiveMember(id: string): Promise<PersonResponseDto> {
    try {
      const response = await this.axios.post<PersonResponseDto>(
        `${this.basePath}/${id}/promote`,
        {}
      );
      return response.data;
    } catch (error: any) {
      console.error(`Failed to promote person ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Ajoute un enfant à une personne existante
   * @param parentId ID du parent
   * @param childData Données de l'enfant à ajouter
   * @returns L'enfant créé
   */
  async addChild(parentId: string, childData: PersonDto): Promise<PersonResponseDto> {
    try {
      const response = await this.axios.post<PersonResponseDto>(
        `${this.basePath}/${parentId}/children`,
        childData
      );
      return response.data;
    } catch (error: any) {
      console.error(`Failed to add child to parent ${parentId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère tous les enfants d'une personne
   * @param parentId ID du parent
   * @param filters Options de filtrage optionnelles pour les enfants
   * @returns Liste des enfants du parent
   */
  async getChildrenByParentId(
    parentId: string, 
    filters?: Omit<PersonFilterOptions, 'parentId'>
  ): Promise<PersonResponseDto[]> {
    try {
      const params = filters ? this.buildFilterParams(filters) : {};
      const response = await this.axios.get<PersonResponseDto[]>(
        `${this.basePath}/${parentId}/children`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch children for parent ${parentId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Met à jour une personne existante
   * @param id ID de la personne à mettre à jour
   * @param updateData Données de mise à jour
   * @returns La personne mise à jour
   */
  async updatePerson(id: string, updateData: Partial<PersonDto>): Promise<PersonResponseDto> {
    try {
      const response = await this.axios.put<PersonResponseDto>(
        `${this.basePath}/${id}`,
        updateData
      );
      return response.data;
    } catch (error: any) {
      console.error(`Failed to update person ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Supprime une personne par son ID
   * @param id ID de la personne à supprimer
   * @returns Réponse de confirmation
   */
  async deletePerson(id: string): Promise<DeleteResponse> {
    try {
      const response = await this.axios.delete<DeleteResponse>(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to delete person ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Supprime toutes les personnes (opération dangereuse)
   * @returns Réponse de confirmation
   */
  async deleteAllPersons(): Promise<DeleteResponse> {
    try {
      const response = await this.axios.delete<DeleteResponse>(`${this.basePath}/delete-all`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete all persons:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère l'arbre généalogique d'une personne
   * @param personId ID de la personne racine
   * @param depth Profondeur maximale de l'arbre (par défaut: 3)
   * @returns L'arbre généalogique
   */
  async getFamilyTree(personId: string, depth: number = 3): Promise<PersonResponseDto> {
    try {
      // On pourrait implémenter une logique récursive côté frontend
      // ou ajouter un endpoint backend dédié. Pour l'instant, on récupère avec les enfants.
      const person = await this.getPersonById(personId);
      
      // Récupérer récursivement les enfants si demandé
      if (depth > 0 && person.childrenCount > 0) {
        const children = await this.getChildrenByParentId(personId);
        person.children = await Promise.all(
          children.map(child => this.getFamilyTree(child.id, depth - 1))
        );
      }
      
      return person;
    } catch (error: any) {
      console.error(`Failed to fetch family tree for ${personId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Recherche de personnes par critères multiples
   * @param searchCriteria Critères de recherche
   * @returns Personnes correspondant aux critères
   */
  async searchPersons(searchCriteria: {
    query?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    status?: MemberStatus;
    gender?: Gender;
    minBirthDate?: string;
    maxBirthDate?: string;
  }): Promise<PersonResponseDto[]> {
    try {
      // Pour l'instant, on filtre côté client après récupération
      // À terme, on pourrait ajouter un endpoint de recherche backend
      const allPersons = await this.getAllPersons();
      
      return allPersons.filter(person => {
        if (searchCriteria.query) {
          const query = searchCriteria.query.toLowerCase();
          return (
            person.firstName.toLowerCase().includes(query) ||
            person.lastName.toLowerCase().includes(query) ||
            person.phoneNumber.includes(query)
          );
        }
        
        if (searchCriteria.firstName && !person.firstName.toLowerCase().includes(searchCriteria.firstName.toLowerCase())) {
          return false;
        }
        
        if (searchCriteria.lastName && !person.lastName.toLowerCase().includes(searchCriteria.lastName.toLowerCase())) {
          return false;
        }
        
        if (searchCriteria.phoneNumber && !person.phoneNumber.includes(searchCriteria.phoneNumber)) {
          return false;
        }
        
        if (searchCriteria.status && person.status !== searchCriteria.status) {
          return false;
        }
        
        if (searchCriteria.gender && person.gender !== searchCriteria.gender) {
          return false;
        }
        
        if (searchCriteria.minBirthDate && person.birthDate < searchCriteria.minBirthDate) {
          return false;
        }
        
        if (searchCriteria.maxBirthDate && person.birthDate > searchCriteria.maxBirthDate) {
          return false;
        }
        
        return true;
      });
    } catch (error: any) {
      console.error('Search failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Met à jour le statut d'une personne
   * @param id ID de la personne
   * @param newStatus Nouveau statut
   * @returns La personne mise à jour
   */
  async updateStatus(id: string, newStatus: MemberStatus): Promise<PersonResponseDto> {
    return this.updatePerson(id, { status: newStatus });
  }

  /**
   * Construit les paramètres de filtre pour les requêtes
   * @param filters Filtres à appliquer
   * @returns Objet de paramètres
   */
  private buildFilterParams(filters: PersonFilterOptions): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (filters.status) params.status = filters.status;
    if (filters.gender) params.gender = filters.gender;
    if (filters.districtId) params.districtId = filters.districtId;
    if (filters.tributeId) params.tributeId = filters.tributeId;
    if (filters.parentId) params.parentId = filters.parentId;
    if (filters.isActiveMember !== undefined) params.isActiveMember = filters.isActiveMember;
    if (filters.page) params.page = filters.page;
    if (filters.size) params.size = filters.size;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortDirection) params.sortDirection = filters.sortDirection;
    
    return params;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): Error {
    if (error.response) {
      const apiError = error.response.data;
      return new Error(
        apiError.error || apiError.message || `API Error: ${error.response.status}`
      );
    } else if (error.request) {
      return new Error('Network error: Unable to reach the server');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Export d'une instance unique (singleton)
export default new PersonService();