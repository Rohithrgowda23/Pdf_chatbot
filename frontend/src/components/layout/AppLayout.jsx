import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar';

export function AppLayout({ themeMode, toggleTheme }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                themeMode={themeMode}
                toggleTheme={toggleTheme}
            />

            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                    transition: 'margin 0.2s',
                }}
            >
                {isMobile && (
                    <AppBar
                        position="sticky"
                        elevation={0}
                        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}
                    >
                        <Toolbar variant="dense">
                            <IconButton edge="start" onClick={() => setSidebarOpen(true)} sx={{ mr: 1 }}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                DocChat
                            </Typography>
                        </Toolbar>
                    </AppBar>
                )}
                <Outlet />
            </Box>
        </Box>
    );
}
