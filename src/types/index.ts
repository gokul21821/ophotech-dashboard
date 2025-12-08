// User types
export interface User {
      id: string;
      email: string;
      username: string;
      role: 'admin' | 'editor';
      createdAt: string;
    }
    
    export interface AuthResponse {
      success: boolean;
      user: User;
      token: string;
    }
    
    // Content types
    export interface Newsletter {
      id: string;
      title: string;
      description: string;
      date: string;
      authorId: string;
      createdAt: string;
      updatedAt: string;
  imagePath?: string | null;
  imageUrl?: string | null;
      author: {
        id: string;
        username: string;
        email: string;
      };
    }
    
    export interface Blog {
      id: string;
      title: string;
      description: string;
      date: string;
      authorId: string;
      createdAt: string;
      updatedAt: string;
  imagePath?: string | null;
  imageUrl?: string | null;
      author: {
        id: string;
        username: string;
        email: string;
      };
    }
    
    export interface CaseStudy {
      id: string;
      title: string;
      description: string;
      date: string;
      authorId: string;
      createdAt: string;
      updatedAt: string;
  imagePath?: string | null;
  imageUrl?: string | null;
      author: {
        id: string;
        username: string;
        email: string;
      };
    }
    
    // API Response types
    export interface ApiSuccessResponse<T> {
      success: true;
      data?: T;
      message?: string;
      count?: number;
    }
    
    export interface ApiErrorResponse {
      success?: false;
      error: string;
    }
    
    export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;