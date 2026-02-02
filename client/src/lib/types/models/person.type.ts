import { Gender, MemberStatus } from "./common.type";

/**
 * Input pour la création/mise à jour (PersonDto.java)
 */
export interface PersonDto {
    firstName: string;
    lastName: string;
    birthDate: string; // LocalDate
    gender: Gender;
    imageUrl: string;
    phoneNumber: string;
    status: MemberStatus;
    districtId: number; // Long
    tributeId: number;  // Long
    parentId?: string;  // String (custom ID)
}

export interface PersonResponseDto extends Omit<PersonDto, 'districtId' | 'tributeId'> {
    id: string;             // Format MBR...
    createdAt: string;      // LocalDate
    sequenceNumber: number; // Long
    isActiveMember: boolean;
    
    // Données liées
    districtId: number;
    districtName: string;
    tributeId: number;
    tributeName: string;
    
    // Hiérarchie
    parentId: string;
    parentName?: string;
    childrenCount: number;
    children?: PersonResponseDto[]; 
}