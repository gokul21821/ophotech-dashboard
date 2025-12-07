export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  GET_ME: '/api/auth/me',

  // Newsletters
  GET_NEWSLETTERS: '/api/newsletters',
  GET_NEWSLETTER: (id: string) => `/api/newsletters/${id}`,
  CREATE_NEWSLETTER: '/api/newsletters',
  UPDATE_NEWSLETTER: (id: string) => `/api/newsletters/${id}`,
  DELETE_NEWSLETTER: (id: string) => `/api/newsletters/${id}`,

  // Blogs
  GET_BLOGS: '/api/blogs',
  GET_BLOG: (id: string) => `/api/blogs/${id}`,
  CREATE_BLOG: '/api/blogs',
  UPDATE_BLOG: (id: string) => `/api/blogs/${id}`,
  DELETE_BLOG: (id: string) => `/api/blogs/${id}`,

  // Case Studies
  GET_CASE_STUDIES: '/api/case-studies',
  GET_CASE_STUDY: (id: string) => `/api/case-studies/${id}`,
  CREATE_CASE_STUDY: '/api/case-studies',
  UPDATE_CASE_STUDY: (id: string) => `/api/case-studies/${id}`,
  DELETE_CASE_STUDY: (id: string) => `/api/case-studies/${id}`,
};