import apiClient from './axios';

export const sessionApi = {
    getAll: () => apiClient.get('/sessions'),
    create: (data) => apiClient.post('/sessions', data),
    delete: (id) => apiClient.delete(`/sessions/${id}`),
    // NOTE: not present in the supplied backend controllers — added so
    // ChatPage can hydrate a session's history on load/refresh.
    // See the note at the end of the response for what the backend needs.
    getMessages: (id) => apiClient.get(`/sessions/${id}/messages`),
    rename: (id, data) => apiClient.put(`/sessions/${id}`, data),
};
