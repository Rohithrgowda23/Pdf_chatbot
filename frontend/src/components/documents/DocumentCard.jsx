import { Box, Card, Typography, IconButton, Tooltip, LinearProgress, Checkbox } from '@mui/material';
import { PictureAsPdf, Delete, InsertDriveFile } from '@mui/icons-material';
import { StatusChip } from './StatusChip';

function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DocumentCard({ document, onDelete, selectable = false, selected = false, onToggleSelect }) {
    const isProcessing = document.status === 'UPLOADING' || document.status === 'PROCESSING';

    return (
        <Card
            variant="outlined"
            sx={{
                p: 2,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                height: '100%',
                position: 'relative',
                transition: 'box-shadow 0.15s, border-color 0.15s',
                borderColor: selected ? 'primary.main' : 'divider',
                '&:hover': { boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                {selectable && (
                    <Checkbox
                        size="small"
                        checked={selected}
                        onChange={() => onToggleSelect?.(document.id)}
                        disabled={document.status !== 'READY'}
                        sx={{ p: 0, mt: 0.25 }}
                    />
                )}
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'error.main',
                        opacity: 0.9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    {document.originalName?.toLowerCase().endsWith('.pdf') ? (
                        <PictureAsPdf sx={{ color: '#fff', fontSize: 20 }} />
                    ) : (
                        <InsertDriveFile sx={{ color: '#fff', fontSize: 20 }} />
                    )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Tooltip title={document.title || document.originalName}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                            {document.title || document.originalName}
                        </Typography>
                    </Tooltip>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {formatBytes(document.fileSize)} {document.pageCount ? `· ${document.pageCount} pages` : ''}
                    </Typography>
                </Box>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete?.(document.id)}>
                        <Delete sx={{ fontSize: 17 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {isProcessing && <LinearProgress sx={{ borderRadius: 2, height: 4 }} />}

            {document.status === 'FAILED' && document.errorMessage && (
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                    {document.errorMessage}
                </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                <StatusChip status={document.status} />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatDate(document.createdAt)}
                </Typography>
            </Box>
        </Card>
    );
}
