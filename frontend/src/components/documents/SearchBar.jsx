import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

export function SearchBar({ value, onChange, placeholder = 'Search documents…' }) {
    return (
        <TextField
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={{ minWidth: { xs: '100%', sm: 280 } }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search sx={{ fontSize: 19, color: 'text.secondary' }} />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={() => onChange('')}>
                            <Clear sx={{ fontSize: 16 }} />
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
        />
    );
}
