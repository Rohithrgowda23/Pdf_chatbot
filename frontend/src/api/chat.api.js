import apiClient from '/src/api/axios.js';

export const chatApi = {
    sendMessage: (data) => apiClient.post('/chat/message', data, { timeout: 120000 }),
};