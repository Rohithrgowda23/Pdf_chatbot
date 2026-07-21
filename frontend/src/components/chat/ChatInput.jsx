import { useState, useRef } from 'react';
import {
    Box, TextField, IconButton, Chip, Stack, Menu, MenuItem,
    Checkbox, ListItemText, Tooltip, Typography,
} from '@mui/material';
import { Send, AttachFile, Description } from '@mui/icons-material';

export function ChatInput({ onSend, disabled, documents = [], selectedDocIds, onChangeSelectedDocIds }) {
    const [value, setValue] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const inputRef = useRef(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed, selectedDocIds);
        setValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleDoc = (id) => {
        if (selectedDocIds.includes(id)) {
            onChangeSelectedDocIds(selectedDocIds.filter((d) => d !== id));
        } else {
            onChangeSelectedDocIds([...selectedDocIds, id]);
        }
    };

    return (
        <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 2, md: 3 }, pt: 1 }}>
            {selectedDocIds.length > 0 && (
                <Stack direction="row" spacing={0.75} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.75 }}>
                    {selectedDocIds.map((id) => {
                        const doc = documents.find((d) => d.id === id);
                        if (!doc) return null;
                        return (
                            <Chip
                                key={id}
                                size="small"
                                icon={<Description sx={{ fontSize: 14 }} />}
                                label={doc.title || doc.originalName}
                                onDelete={() => toggleDoc(id)}
                                sx={{ fontSize: '0.72rem' }}
                            />
                        );
                    })}
                </Stack>
            )}

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                    p: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
            >
                <Tooltip title="Attach documents">
                    <span>
                        <IconButton
                            size="small"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            disabled={documents.length === 0}
                        >
                            <AttachFile sx={{ fontSize: 19 }} />
                        </IconButton>
                    </span>
                </Tooltip>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    {documents.length === 0 ? (
                        <MenuItem disabled>No documents ready</MenuItem>
                    ) : (
                        documents.map((doc) => (
                            <MenuItem key={doc.id} onClick={() => toggleDoc(doc.id)} dense>
                                <Checkbox size="small" checked={selectedDocIds.includes(doc.id)} sx={{ p: 0, mr: 1 }} />
                                <ListItemText
                                    primary={doc.title || doc.originalName}
                                    primaryTypographyProps={{ fontSize: '0.82rem' }}
                                />
                            </MenuItem>
                        ))
                    )}
                </Menu>

                <TextField
                    inputRef={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask something about your documents…"
                    multiline
                    maxRows={6}
                    fullWidth
                    variant="standard"
                    disabled={disabled}
                    InputProps={{ disableUnderline: true }}
                    sx={{ px: 1, py: 0.5 }}
                />

                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={disabled || !value.trim()}
                    sx={{
                        bgcolor: value.trim() ? 'primary.main' : 'transparent',
                        color: value.trim() ? '#fff' : 'text.disabled',
                        '&:hover': { bgcolor: value.trim() ? 'primary.dark' : 'action.hover' },
                        '&.Mui-disabled': { color: 'text.disabled' },
                    }}
                >
                    <Send sx={{ fontSize: 19 }} />
                </IconButton>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.75, ml: 0.5 }}>
                Enter to send · Shift+Enter for a new line
            </Typography>
        </Box>
    );
}
