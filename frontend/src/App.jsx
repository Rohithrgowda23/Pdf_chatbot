import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { SnackbarProvider } from './components/common/SnackbarProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute, PublicRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import ChatPage from './pages/ChatPage';
import NotFound from './pages/NotFound';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

export default function App() {
    const [themeMode, setThemeMode] = useState(
        () => localStorage.getItem('theme_mode') || 'light'
    );

    useEffect(() => {
        localStorage.setItem('theme_mode', themeMode);
    }, [themeMode]);

    const toggleTheme = () => setThemeMode((m) => (m === 'light' ? 'dark' : 'light'));
    const theme = useMemo(() => (themeMode === 'dark' ? darkTheme : lightTheme), [themeMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <ErrorBoundary>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Route>

                            <Route element={<ProtectedRoute />}>
                                <Route element={<AppLayout themeMode={themeMode} toggleTheme={toggleTheme} />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/documents" element={<Documents />} />
                                    <Route path="/chat/:sessionId" element={<ChatPage />} />
                                </Route>
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </ErrorBoundary>
            </SnackbarProvider>
        </ThemeProvider>
    );
}