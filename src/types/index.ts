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

export type TiptapDoc = Record<string, any>;
    
    // Content types
    export type PublishStatus = 'DRAFT' | 'PUBLISHED';
    
    export interface Newsletter {
      id: string;
      title: string;
  subtitle?: string | null;
      content: TiptapDoc; // Required
      date: string;
      edition?: string | null;
      status: PublishStatus;
      authorId: string;
      createdAt: string;
      updatedAt: string;
      imageUrl?: string | null; // Derived from content
      author: {
        id: string;
        username: string;
        email: string;
      };
    }
    
    export interface Blog {
      id: string;
      title: string;
  subtitle?: string | null;
      content: TiptapDoc; // Required
      date: string;
      status: PublishStatus;
      authorId: string;
      createdAt: string;
      updatedAt: string;
      imageUrl?: string | null; // Derived from content
      author: {
        id: string;
        username: string;
        email: string;
      };
    }
    
    export interface CaseStudy {
      id: string;
      title: string;
  subtitle?: string | null;
      content: TiptapDoc; // Required
      date: string;
      category?: string | null;
      status: PublishStatus;
      authorId: string;
      createdAt: string;
      updatedAt: string;
      imageUrl?: string | null; // Derived from content
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