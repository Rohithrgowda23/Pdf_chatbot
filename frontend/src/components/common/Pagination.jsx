import { Box, Pagination as MuiPagination } from '@mui/material';

export function Pagination({ page, count, onChange, sx = {} }) {
    if (!count || count <= 1) return null;
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3, ...sx }}>
            <MuiPagination
                page={page + 1}
                count={count}
                onChange={(_, value) => onChange(value - 1)}
                color="primary"
                shape="rounded"
            />
        </Box>
    );
}
