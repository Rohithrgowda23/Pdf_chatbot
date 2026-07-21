import apiClient from './axios';

export const documentApi = {
    getAll: (params) => apiClient.get('/documents', { params }),
    getReady: () => apiClient.get('/documents/ready'),
    upload: (formData, onUploadProgress) =>
        apiClient.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        }),
    delete: (id) => apiClient.delete(`/documents/${id}`),
};
