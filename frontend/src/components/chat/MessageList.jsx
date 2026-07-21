import { useEffect, useRef } from 'react';
import { Box, Avatar, Stack, Typography } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { ChatMessage } from './ChatMessage';
import { EmptyState } from '../common/EmptyState';
import { Chat } from '@mui/icons-material';

function TypingIndicator() {
    return (
        <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
            <Avatar
                sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #5B6EF5 0%, #10B981 100%)',
                }}
            >
                <AutoAwesome sx={{ fontSize: 16 }} />
            </Avatar>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '4px 18px 18px 18px',
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: 'text.secondary',
                            animation: 'dcTypingBounce 1.2s infinite',
                            animationDelay: `${i * 0.15}s`,
                            '@keyframes dcTypingBounce': {
                                '0%, 60%, 100%': { opacity: 0.3, transform: 'translateY(0)' },
                                '30%': { opacity: 1, transform: 'translateY(-3px)' },
                            },
                        }}
                    />
                ))}
            </Box>
        </Stack>
    );
}

export function MessageList({ messages, isSending }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    if (messages.length === 0 && !isSending) {
        return (
            <EmptyState
                icon={<Chat sx={{ fontSize: 28 }} />}
                title="Start the conversation"
                description="Ask a question about your uploaded documents and I'll answer with cited sources."
                sx={{ height: '100%', justifyContent: 'center' }}
            />
        );
    }

    return (
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 3 }}>
            {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
            ))}
            {isSending && <TypingIndicator />}
            <div ref={bottomRef} />
        </Box>
    );
}
