import { Box, Avatar, Typography, Stack } from '@mui/material';
import { Person, AutoAwesome } from '@mui/icons-material';
import { MarkdownRenderer } from '../../utils/markdown';
import { SourcesPanel } from './SourcesPanel';

export function ChatMessage({ message }) {
    const isUser = message.role === 'user';

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                mb: 2.5,
                maxWidth: '100%',
            }}
        >
            {!isUser && (
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        flexShrink: 0,
                        mt: 0.5,
                        background: 'linear-gradient(135deg, #5B6EF5 0%, #10B981 100%)',
                    }}
                >
                    <AutoAwesome sx={{ fontSize: 16 }} />
                </Avatar>
            )}

            <Box sx={{ maxWidth: isUser ? '70%' : '85%', minWidth: 0 }}>
                <Box
                    sx={{
                        bgcolor: isUser ? 'primary.main' : 'background.paper',
                        color: isUser ? '#fff' : 'text.primary',
                        px: 2,
                        py: 1.5,
                        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                        border: isUser ? 'none' : '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    }}
                >
                    {isUser ? (
                        <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#fff' }}>
                            {message.content}
                        </Typography>
                    ) : (
                        <MarkdownRenderer content={message.content} />
                    )}
                </Box>

                {!isUser && <SourcesPanel sources={message.sources} />}

                <Stack direction="row" spacing={1} sx={{ mt: 0.5, px: 0.5 }} justifyContent={isUser ? 'flex-end' : 'flex-start'}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                    {message.modelUsed && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                            · {message.modelUsed}
                        </Typography>
                    )}
                    {message.tokensUsed && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                            · {message.tokensUsed} tokens
                        </Typography>
                    )}
                </Stack>
            </Box>

            {isUser && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', flexShrink: 0, mt: 0.5 }}>
                    <Person sx={{ fontSize: 18 }} />
                </Avatar>
            )}
        </Box>
    );
}
