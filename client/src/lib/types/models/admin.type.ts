import { Gender, Role } from "./common.type";

export interface IBaseAdmin {
	firstName: string;
	lastName: string;
	birthDate: string;
	gender: Gender
	imageUrl: string;
	phoneNumber: string;
	email: string;
}

export interface RegisterRequestDTO extends IBaseAdmin {
	password: string;
}

export interface AdminResponseDto extends IBaseAdmin {
	id: string;
	role: Role;
	verified: boolean;
	createdAt: string;
}

export interface UpdateAdminDto extends Partial<RegisterRequestDTO> {
	verified?: boolean;
}

export interface LoginRequestDTO extends Pick<IBaseAdmin, 'email'> {
	password: string;
}