import api from './api';
import { API_ENDPOINTS } from './config';

export async function uploadContentImage(
  type: 'newsletter' | 'blog' | 'case-study',
  id: string,
  file: File
): Promise<string | null> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint =
    type === 'newsletter'
      ? API_ENDPOINTS.UPLOAD_NEWSLETTER_IMAGE(id)
      : type === 'blog'
      ? API_ENDPOINTS.UPLOAD_BLOG_IMAGE(id)
      : API_ENDPOINTS.UPLOAD_CASE_STUDY_IMAGE(id);

  const res = await api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data?.data?.imageUrl ?? null;
}

export async function deleteContentImage(
  type: 'newsletter' | 'blog' | 'case-study',
  id: string
): Promise<void> {
  const endpoint =
    type === 'newsletter'
      ? API_ENDPOINTS.DELETE_NEWSLETTER_IMAGE(id)
      : type === 'blog'
      ? API_ENDPOINTS.DELETE_BLOG_IMAGE(id)
      : API_ENDPOINTS.DELETE_CASE_STUDY_IMAGE(id);

  await api.delete(endpoint);
}

