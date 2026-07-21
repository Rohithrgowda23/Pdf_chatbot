import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '../api/chat.api';

export function useChat(sessionId) {
    const [messages, setMessages] = useState([]);
    const queryClient = useQueryClient();

    const { mutate: sendMessage, isPending: isSending } = useMutation({
        mutationFn: (payload) => chatApi.sendMessage(payload),
        onSuccess: (res) => {
            const data = res.data;
            setMessages((prev) => [
                ...prev,
                {
                    id: data.messageId || Date.now(),
                    role: 'assistant',
                    content: data.answer || data.content,
                    sources: data.sources || [],
                    modelUsed: data.modelUsed,
                    tokensUsed: data.tokensUsed,
                    createdAt: data.createdAt || new Date().toISOString(),
                },
            ]);
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
        onError: (err) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'assistant',
                    content: `**Error:** ${err.response?.data?.message || 'Failed to get a response. Please try again.'}`,
                    sources: [],
                    isError: true,
                    createdAt: new Date().toISOString(),
                },
            ]);
        },
    });

    const send = useCallback(
        (question, documentIds = []) => {
            const userMsg = {
                id: Date.now(),
                role: 'user',
                content: question,
                sources: [],
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, userMsg]);

            sendMessage({
                sessionId,
                question,
                documentIds,
            });
        },
        [sessionId, sendMessage]
    );

    const clearMessages = useCallback(() => setMessages([]), []);

    return { messages, send, isSending, clearMessages, setMessages };
}
