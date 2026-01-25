import api from './api';
import { API_ENDPOINTS } from './config';

export type InlineImageUploadResult = {
  url: string;
  filePath: string;
};

export async function uploadInlineImage(
  type: 'newsletter' | 'blog' | 'case-study',
  id: string,
  file: File
): Promise<InlineImageUploadResult> {
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

  const url = res.data?.data?.url;
  const filePath = res.data?.data?.filePath;
  if (!url || !filePath) {
    throw new Error('Upload succeeded but response is missing url/filePath');
  }
  return { url, filePath };
}

// Note: inline images are cleaned up by backend sync/purge on save.
