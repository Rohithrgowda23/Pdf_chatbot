import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box, IconButton, Tooltip, Typography, Divider, Stack, Button,
    Drawer, useMediaQuery, useTheme, Chip, LinearProgress,
} from '@mui/material';
import {
    ContentCopy, Refresh, DeleteSweep, Article, Tag, MenuOpen, Close,
} from '@mui/icons-material';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { sessionApi } from '../api/session.api';
import { useNotify } from '../components/common/SnackbarProvider';

const PANEL_WIDTH = 300;

function ScoreBar({ score }) {
    const pct = Math.round((score || 0) * 100);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
                variant="determinate"
                value={pct}
                sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
                color={pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'error'}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 30 }}>{pct}%</Typography>
        </Box>
    );
}

export default function ChatPage() {
    const { sessionId } = useParams();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
    const notify = useNotify();

    const { messages, send, isSending, clearMessages, setMessages } = useChat(sessionId);
    const { documents } = useDocuments();
    const [selectedDocIds, setSelectedDocIds] = useState([]);
    const [panelOpen, setPanelOpen] = useState(false);

    const readyDocuments = useMemo(() => documents.filter((d) => d.status === 'READY'), [documents]);

    // Hydrate existing history when switching sessions
    useEffect(() => {
        let cancelled = false;
        setMessages([]);
        if (!sessionId) return;

        sessionApi
            .getMessages(sessionId)
            .then((res) => {
                if (cancelled) return;
                const history = (res.data || []).map((m) => ({
                    id: m.id,
                    role: (m.role || '').toLowerCase() === 'user' ? 'user' : 'assistant',
                    content: m.content,
                    sources: m.sources || [],
                    modelUsed: m.modelUsed,
                    tokensUsed: m.tokensUsed,
                    createdAt: m.createdAt,
                }));
                setMessages(history);
            })
            .catch(() => {
                // No history endpoint available yet, or a brand-new session — start empty.
            });

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

    const handleCopyAnswer = async () => {
        if (!lastAssistantMessage) return;
        try {
            await navigator.clipboard.writeText(lastAssistantMessage.content);
            notify('Answer copied to clipboard', 'success');
        } catch {
            notify('Could not copy to clipboard', 'error');
        }
    };

    const handleRegenerate = () => {
        if (!lastUserMessage || isSending) return;
        send(lastUserMessage.content, selectedDocIds);
    };

    const handleClearChat = () => {
        clearMessages();
    };

    const panelContent = (
        <Box sx={{ width: PANEL_WIDTH, p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Conversation tools
                </Typography>
                {!isDesktop && (
                    <IconButton size="small" onClick={() => setPanelOpen(false)}>
                        <Close fontSize="small" />
                    </IconButton>
                )}
            </Stack>

            <Stack spacing={1} sx={{ mb: 3 }}>
                <Button
                    size="small"
                    startIcon={<ContentCopy sx={{ fontSize: 15 }} />}
                    onClick={handleCopyAnswer}
                    disabled={!lastAssistantMessage}
                    variant="outlined"
                >
                    Copy last answer
                </Button>
                <Button
                    size="small"
                    startIcon={<Refresh sx={{ fontSize: 15 }} />}
                    onClick={handleRegenerate}
                    disabled={!lastUserMessage || isSending}
                    variant="outlined"
                >
                    Regenerate
                </Button>
                <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteSweep sx={{ fontSize: 15 }} />}
                    onClick={handleClearChat}
                    disabled={messages.length === 0}
                    variant="outlined"
                >
                    Clear chat
                </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Sources for last answer
            </Typography>

            <Box sx={{ flex: 1, overflowY: 'auto', mt: 1.5 }}>
                {!lastAssistantMessage || lastAssistantMessage.sources.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        No sources cited yet. Ask a question about your documents to see citations here.
                    </Typography>
                ) : (
                    <Stack spacing={1.25}>
                        {lastAssistantMessage.sources.map((src, i) => (
                            <Box
                                key={i}
                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}
                            >
                                <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
                                    <Article sx={{ fontSize: 14, color: 'primary.main' }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {src.documentTitle || src.document?.title || 'Document'}
                                    </Typography>
                                    {src.pageNumber && (
                                        <Chip icon={<Tag sx={{ fontSize: 11, ml: '4px !important' }} />} label={`p.${src.pageNumber}`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                                    )}
                                </Stack>
                                <ScoreBar score={src.score} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary', fontSize: '0.76rem', lineHeight: 1.5, mt: 1,
                                        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}
                                >
                                    {src.chunkText}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, height: { lg: '100vh' } }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ px: { xs: 2, md: 4 }, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Chat
                    </Typography>
                    {!isDesktop && (
                        <Tooltip title="Sources & tools">
                            <IconButton size="small" onClick={() => setPanelOpen(true)}>
                                <MenuOpen fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                <MessageList messages={messages} isSending={isSending} />

                <ChatInput
                    onSend={send}
                    disabled={isSending}
                    documents={readyDocuments}
                    selectedDocIds={selectedDocIds}
                    onChangeSelectedDocIds={setSelectedDocIds}
                />
            </Box>

            {isDesktop ? (
                <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                    {panelContent}
                </Box>
            ) : (
                <Drawer anchor="right" open={panelOpen} onClose={() => setPanelOpen(false)}>
                    {panelContent}
                </Drawer>
            )}
        </Box>
    );
}
