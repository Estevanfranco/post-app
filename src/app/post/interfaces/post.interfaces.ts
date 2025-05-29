export interface PostsResponse {
    success: boolean;
    message: string;
    data: Data;
}

export interface PostResponse{
    success: boolean;
    message: string;
    data: Post;
}

export interface Author {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    avatar: string;
}


export interface Data {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    posts: Post[];
}

export interface Post {
    id: string;
    title: string;
    content: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    Author: Author;
    author_id?: string;
}

export interface Author {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    telephone: string;
    avatar: string;
}