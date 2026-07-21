import { Box, Typography, Button } from '@mui/material';

export function EmptyState({ icon, title, description, actionLabel, onAction, sx = {} }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 8,
                px: 3,
                ...sx,
            }}
        >
            {icon && (
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        color: 'text.secondary',
                    }}
                >
                    {icon}
                </Box>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
                {title}
            </Typography>
            {description && (
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mb: actionLabel ? 3 : 0 }}>
                    {description}
                </Typography>
            )}
            {actionLabel && (
                <Button variant="contained" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}
