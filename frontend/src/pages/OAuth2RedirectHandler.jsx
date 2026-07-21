import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '../store/auth.store';

export default function OAuth2RedirectHandler() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setAuth({ email: '' }, token);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">Signing you in…</Typography>
        </Box>
    );
}