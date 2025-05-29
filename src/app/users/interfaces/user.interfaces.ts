//SINGULAR
export interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}

//PLURAL
export interface UsersResponse {
    success: boolean;
    message: string;
    data: Data;
}

export interface Data {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    users: User[];
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    avatar: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    Role: Role;
    auth?: boolean;
    role_id?: string;
}
export interface Role {
    id: string;
    name: string;
}

//------------

export interface RolesResponse {
    success: boolean;
    message: string;
    data: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        roles: Role[];
    };
}

export interface Role {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
