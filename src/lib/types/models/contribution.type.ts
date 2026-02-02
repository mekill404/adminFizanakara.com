import { ContributionStatus } from "./common.type";
import { PaymentResponseDto } from "./payment.type";

export interface ContributionCreateDto {
    year: number; 
    status?: ContributionStatus;
}

export interface ContributionYearDto {
    year: number;
}

export interface ContributionUpdateDto {
    amount?: number;
    status?: ContributionStatus;
    memberId: string;
}


export interface ContributionResponseDto {
    id: string;         // Format COT2026-001
    year: number;       // Year en Java
    amount: number;     // BigDecimal
    status: ContributionStatus;
    dueDate: string;    // LocalDate
    totalPaid: number;  // BigDecimal calculé
    remaining: number;  // BigDecimal calculé
    memberId: string;
    memberName: string;
    childId?: string;   // Optionnel (pour les mineurs)
    payments: PaymentResponseDto[];
}