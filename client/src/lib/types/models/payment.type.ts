import { PaymentStatus } from "./common.type";

export interface PaymentDto {
    amountPaid: number;
    paymentDate?: string;
    status: PaymentStatus;
    contributionId: string;
}

export interface PaymentResponseDto {
    id: string;
    amountPaid: number;
    paymentDate: string;
    status: PaymentStatus;
    contributionId: string;
}