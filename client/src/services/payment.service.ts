import api from '../api/axios.config';
import { PaymentDto, PaymentResponseDto } from '../lib/types/models/payment.type';

const BASE_URL = '/api/admins/payments';

export const PaymentService = {
    getByContribution: async (contributionId: string): Promise<PaymentResponseDto[]> => {
        const response = await api.get(`${BASE_URL}/contribution/${contributionId}`);
        return response.data;
    },

    create: async (data: PaymentDto): Promise<PaymentResponseDto> => {
        const response = await api.post(BASE_URL, data);
        return response.data;
    }
};