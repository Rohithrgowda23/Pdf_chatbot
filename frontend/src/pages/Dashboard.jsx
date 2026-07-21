import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box, Card, Typography, Button, Stack, List, ListItemButton,
    ListItemIcon, ListItemText, Skeleton, Chip,
} from '@mui/material';
import { CloudUpload, Chat, Description, ArrowForward, Add } from '@mui/icons-material';
import { TopBar } from '../components/layout/TopBar';
import { DashboardCards } from '../components/dashboard/DashboardCards';
import { StatusChip } from '../components/documents/StatusChip';
import { EmptyState } from '../components/common/EmptyState';
import { UploadDialog } from '../components/documents/UploadDialog';
import { useDocuments } from '../hooks/useDocuments';
import { sessionApi } from '../api/session.api';
import { useNotify } from '../components/common/SnackbarProvider';

export default function Dashboard() {
    const navigate = useNavigate();
    const notify = useNotify();
    const queryClient = useQueryClient();
    const [uploadOpen, setUploadOpen] = useState(false);

    const { documents, isLoading: docsLoading } = useDocuments();

    const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: async () => {
            const res = await sessionApi.getAll();
            return res.data || [];
        },
    });

    const { mutate: createSession } = useMutation({
        mutationFn: () => sessionApi.create({ title: 'New Chat' }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            navigate(`/chat/${res.data.id}`);
        },
        onError: () => notify('Failed to create session', 'error'),
    });

    const readyCount = useMemo(() => documents.filter((d) => d.status === 'READY').length, [documents]);
    const recentDocuments = useMemo(
        () => [...documents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
        [documents]
    );
    const recentSessions = useMemo(
        () => [...sessions].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5),
        [sessions]
    );
    const messageCount = useMemo(
        () => sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0),
        [sessions]
    );

    return (
        <Box sx={{ pb: 4 }}>
            <TopBar
                title="Dashboard"
                subtitle="A quick look at your documents and conversations"
                actions={
                    <>
                        <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setUploadOpen(true)}>
                            Upload
                        </Button>
                        <Button variant="contained" startIcon={<Add />} onClick={() => createSession()}>
                            New Chat
                        </Button>
                    </>
                }
            />

            <Box sx={{ px: { xs: 2, md: 4 } }}>
                <DashboardCards
                    documentCount={documents.length}
                    readyCount={readyCount}
                    sessionCount={sessions.length}
                    messageCount={messageCount}
                />

                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5} sx={{ mt: 3 }}>
                    {/* Recent documents */}
                    <Card variant="outlined" sx={{ flex: 1, borderRadius: 3, p: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Recent documents
                            </Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForward sx={{ fontSize: 15 }} />}
                                onClick={() => navigate('/documents')}
                            >
                                View all
                            </Button>
                        </Stack>

                        {docsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={52} sx={{ borderRadius: 2 }} />)
                        ) : recentDocuments.length === 0 ? (
                            <EmptyState
                                icon={<Description sx={{ fontSize: 24 }} />}
                                title="No documents yet"
                                description="Upload a PDF to start chatting with it."
                                actionLabel="Upload document"
                                onAction={() => setUploadOpen(true)}
                            />
                        ) : (
                            <List dense disablePadding>
                                {recentDocuments.map((doc) => (
                                    <ListItemButton key={doc.id} sx={{ borderRadius: 2, mb: 0.5 }} onClick={() => navigate('/documents')}>
                                        <ListItemIcon sx={{ minWidth: 34 }}>
                                            <Description sx={{ fontSize: 18, color: 'primary.main' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={doc.title || doc.originalName}
                                            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, noWrap: true }}
                                        />
                                        <StatusChip status={doc.status} />
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                    </Card>

                    {/* Recent chats */}
                    <Card variant="outlined" sx={{ flex: 1, borderRadius: 3, p: 2.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                Recent chats
                            </Typography>
                            <Button size="small" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={() => createSession()}>
                                New
                            </Button>
                        </Stack>

                        {sessionsLoading ? (
                            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={52} sx={{ borderRadius: 2 }} />)
                        ) : recentSessions.length === 0 ? (
                            <EmptyState
                                icon={<Chat sx={{ fontSize: 24 }} />}
                                title="No chats yet"
                                description="Start a conversation with your documents."
                                actionLabel="Start chatting"
                                onAction={() => createSession()}
                            />
                        ) : (
                            <List dense disablePadding>
                                {recentSessions.map((session) => (
                                    <ListItemButton
                                        key={session.id}
                                        sx={{ borderRadius: 2, mb: 0.5 }}
                                        onClick={() => navigate(`/chat/${session.id}`)}
                                    >
                                        <ListItemIcon sx={{ minWidth: 34 }}>
                                            <Chat sx={{ fontSize: 17, color: 'secondary.main' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={session.title || 'Untitled Chat'}
                                            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, noWrap: true }}
                                        />
                                        {session.messages?.length ? (
                                            <Chip label={session.messages.length} size="small" sx={{ height: 20, fontSize: '0.68rem' }} />
                                        ) : null}
                                    </ListItemButton>
                                ))}
                            </List>
                        )}
                    </Card>
                </Stack>
            </Box>

            <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
        </Box>
    );
}
