import api from '../api/axios.config';
import { PersonDto, PersonResponseDto } from '../lib/types/models/person.type';

const PERSON_URL = '/api/admins/persons';

export const PersonService = {
    getAll: async (): Promise<PersonResponseDto[]> => {
        return (await api.get(PERSON_URL)).data;
    },

    getById: async (id: string): Promise<PersonResponseDto> => {
        return (await api.get(`${PERSON_URL}/${id}`)).data;
    },

    create: async (data: PersonDto): Promise<PersonResponseDto> => {
        return (await api.post(PERSON_URL, data)).data;
    },

    // Correspond à @PostMapping("/{parentId}/children")
    addChild: async (parentId: string, data: PersonDto): Promise<PersonResponseDto> => {
        return (await api.post(`${PERSON_URL}/${parentId}/children`, data)).data;
    },

    // Le back utilise @PutMapping("/{id}")
    update: async (id: string, data: PersonDto): Promise<PersonResponseDto> => {
        return (await api.put(`${PERSON_URL}/${id}`, data)).data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${PERSON_URL}/${id}`);
    }
};