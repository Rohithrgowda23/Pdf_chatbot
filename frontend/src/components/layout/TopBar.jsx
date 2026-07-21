import { Box, Typography, Stack } from '@mui/material';

export function TopBar({ title, subtitle, actions }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                px: { xs: 2, md: 4 },
                pt: { xs: 3, md: 4 },
                pb: 2,
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
            {actions && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                    {actions}
                </Stack>
            )}
        </Box>
    );
}
