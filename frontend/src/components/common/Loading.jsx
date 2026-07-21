import { Box, CircularProgress, Typography } from '@mui/material';

export function Loading({ fullScreen = false, label = 'Loading…' }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                width: '100%',
                height: fullScreen ? '100vh' : '100%',
                minHeight: fullScreen ? '100vh' : 240,
                py: fullScreen ? 0 : 6,
            }}
        >
            <CircularProgress size={32} thickness={4} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {label}
            </Typography>
        </Box>
    );
}
