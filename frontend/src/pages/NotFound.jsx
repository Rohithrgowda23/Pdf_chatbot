import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: 3,
                bgcolor: 'background.default',
            }}
        >
            <Typography sx={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #5B6EF5 0%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                404
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
                Page not found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 360 }}>
                The page you're looking for doesn't exist or may have been moved.
            </Typography>
            <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/dashboard')}>
                Back to Dashboard
            </Button>
        </Box>
    );
}
