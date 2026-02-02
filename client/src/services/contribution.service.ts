import api from '../api/axios.config';
import { ContributionResponseDto } from '../lib/types/models/contribution.type';

const BASE_URL = '/api/admins/contributions';

export const ContributionService = {
    getByPersonAndYear: async (personId: string, year: number): Promise<ContributionResponseDto[]> => {
        const response = await api.get(`${BASE_URL}/person/${personId}/year/${year}`);
        return response.data;
    },
    generateForYear: async (year: number): Promise<ContributionResponseDto[]> => {
        const response = await api.post(BASE_URL, { year });
        return response.data;
    }
};