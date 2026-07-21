import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemText,
    ListItemIcon, Typography, IconButton, Divider, Skeleton,
    Tooltip, Avatar, Button, useMediaQuery, useTheme, TextField,
} from '@mui/material';
import {
    Add, Delete, Chat, Description, Logout, Edit, Check, Close,
    DarkMode, LightMode, AutoAwesome,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionApi } from '../../api/session.api';
import { useAuthStore } from '../../store/auth.store';
import { useNotify } from '../common/SnackbarProvider';

const SIDEBAR_WIDTH = 260;

export function Sidebar({ open, onClose, themeMode, toggleTheme }) {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const { user, logout } = useAuthStore();
    const notify = useNotify();
    const queryClient = useQueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const { data: sessions = [], isLoading } = useQuery({
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
            if (isMobile) onClose();
        },
        onError: () => notify('Failed to create session', 'error'),
    });

    const { mutate: deleteSession } = useMutation({
        mutationFn: (id) => sessionApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            if (String(sessionId) === String(id)) navigate('/dashboard');
        },
        onError: () => notify('Failed to delete session', 'error'),
    });

    const { mutate: renameSession } = useMutation({
        mutationFn: ({ id, title }) => sessionApi.rename(id, { title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            setEditingId(null);
        },
        onError: () => notify('Failed to rename chat', 'error'),
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const startEditing = (session, e) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title || 'Untitled Chat');
    };

    const commitEdit = (id, e) => {
        e?.stopPropagation();
        const title = editTitle.trim();
        if (!title) {
            setEditingId(null);
            return;
        }
        renameSession({ id, title });
    };

    const cancelEdit = (e) => {
        e.stopPropagation();
        setEditingId(null);
    };

    const drawerContent = (
        <Box
            sx={{
                width: SIDEBAR_WIDTH,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.sidebar',
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Logo */}
            <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 32, height: 32, borderRadius: 2,
                        background: 'linear-gradient(135deg, #5B6EF5 0%, #10B981 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <AutoAwesome sx={{ fontSize: 16, color: '#fff' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: '1rem' }}>
                    DocChat
                </Typography>
            </Box>

            <Divider />

            {/* New Chat */}
            <Box sx={{ px: 1.5, pt: 1.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => createSession()}
                    sx={{ justifyContent: 'flex-start', mb: 1, py: 1, fontSize: '0.85rem' }}
                >
                    New Chat
                </Button>
                <ListItemButton
                    onClick={() => { navigate('/documents'); if (isMobile) onClose(); }}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                    selected={window.location.pathname === '/documents'}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <Description fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Documents" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
                </ListItemButton>
            </Box>

            <Divider sx={{ mt: 1 }} />

            {/* Sessions */}
            <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, py: 1 }}>
                <Typography variant="caption" sx={{ px: 1, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Recent Chats
                </Typography>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} height={40} sx={{ borderRadius: 2, mb: 0.5 }} />
                    ))
                ) : sessions.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary', px: 1, py: 2, textAlign: 'center' }}>
                        No chats yet. Start one!
                    </Typography>
                ) : (
                    <List dense disablePadding sx={{ '& .row-actions': { opacity: 0 }, '& .MuiListItem-root:hover .row-actions': { opacity: 1 } }}>
                        {sessions.map((session) => (
                            <ListItem
                                key={session.id}
                                disablePadding
                                secondaryAction={
                                    editingId === session.id ? (
                                        <Box className="row-actions" sx={{ opacity: '1 !important', display: 'flex' }}>
                                            <IconButton size="small" onClick={(e) => commitEdit(session.id, e)}>
                                                <Check fontSize="small" color="success" />
                                            </IconButton>
                                            <IconButton size="small" onClick={cancelEdit}>
                                                <Close fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <Box className="row-actions" sx={{ display: 'flex', transition: '0.15s' }}>
                                            <Tooltip title="Rename">
                                                <IconButton size="small" onClick={(e) => startEditing(session, e)}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )
                                }
                            >
                                {editingId === session.id ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 8, py: 0.5, pl: 1.5 }}>
                                        <TextField
                                            autoFocus
                                            size="small"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') commitEdit(session.id, e);
                                                if (e.key === 'Escape') cancelEdit(e);
                                            }}
                                            fullWidth
                                            variant="standard"
                                        />
                                    </Box>
                                ) : (
                                    <ListItemButton
                                        selected={String(sessionId) === String(session.id)}
                                        onClick={() => { navigate(`/chat/${session.id}`); if (isMobile) onClose(); }}
                                        sx={{ borderRadius: 2, pr: 8 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <Chat sx={{ fontSize: 15, color: 'text.secondary' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={session.title || 'Untitled Chat'}
                                            primaryTypographyProps={{
                                                fontSize: '0.825rem',
                                                noWrap: true,
                                                fontWeight: String(sessionId) === String(session.id) ? 600 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                )}
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Divider />

            {/* Footer */}
            <Box sx={{ px: 1.5, py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 2 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 700 }}>
                        {user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.fullName || user?.username}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.email}
                        </Typography>
                    </Box>
                    <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
                        <IconButton size="small" onClick={toggleTheme}>
                            {themeMode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Sign out">
                        <IconButton size="small" onClick={handleLogout} color="error">
                            <Logout fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}>
                {drawerContent}
            </Drawer>
        );
    }

    return (
        <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
            {drawerContent}
        </Box>
    );
}

export { SIDEBAR_WIDTH };
