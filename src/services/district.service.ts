import api from '../api/axios.config';
import { DistrictDto } from '../lib/types/models/common.type';

const BASE_URL = '/api/admins/districts';

export const DistrictService = {
	getAll: async () => {
		const response = await api.get(BASE_URL);
		return response.data;
	},
	getById: async (id: number) => {
		const response = await api.get(`${BASE_URL}/${id}`);
		return response.data;
	},
	create: async (data: DistrictDto) => {
		const response = await api.post(BASE_URL, data);
		return response.data;
	},
	update: async (id: number, data: DistrictDto) => {
		const response = await api.put(`${BASE_URL}/${id}`, data);
		return response.data;
	},
	delete: async (id: number) => {
		await api.delete(`${BASE_URL}/${id}`);
	}
};