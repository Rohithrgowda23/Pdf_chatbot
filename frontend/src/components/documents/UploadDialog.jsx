import { useCallback, useRef, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography,
    IconButton, Button, LinearProgress, Stack, Chip,
} from '@mui/material';
import { CloudUpload, Close, PictureAsPdf, CheckCircle, ErrorOutline } from '@mui/icons-material';
import { useDocuments } from '../../hooks/useDocuments';
import { useNotify } from '../common/SnackbarProvider';

const ACCEPTED_TYPES = ['application/pdf'];

export function UploadDialog({ open, onClose }) {
    const [isDragging, setIsDragging] = useState(false);
    const [queue, setQueue] = useState([]); // [{file, progress, status, error}]
    const inputRef = useRef(null);
    const { uploadDocument } = useDocuments();
    const notify = useNotify();

    const resetAndClose = () => {
        setQueue([]);
        setIsDragging(false);
        onClose();
    };

    const startUpload = async (item) => {
        const formData = new FormData();
        formData.append('file', item.file);

        setQueue((prev) => prev.map((q) => (q.file === item.file ? { ...q, status: 'uploading' } : q)));

        try {
            await uploadDocument({
                formData,
                onProgress: (evt) => {
                    const pct = evt.total ? Math.round((evt.loaded / evt.total) * 100) : 0;
                    setQueue((prev) => prev.map((q) => (q.file === item.file ? { ...q, progress: pct } : q)));
                },
            });
            setQueue((prev) => prev.map((q) => (q.file === item.file ? { ...q, status: 'done', progress: 100 } : q)));
        } catch (err) {
            setQueue((prev) =>
                prev.map((q) =>
                    q.file === item.file
                        ? { ...q, status: 'error', error: err.response?.data?.message || 'Upload failed' }
                        : q
                )
            );
        }
    };

    const addFiles = useCallback((fileList) => {
        const files = Array.from(fileList).filter((f) => ACCEPTED_TYPES.includes(f.type));
        if (files.length !== fileList.length) {
            notify('Only PDF files are supported', 'warning');
        }
        const items = files.map((file) => ({ file, progress: 0, status: 'pending', error: null }));
        setQueue((prev) => [...prev, ...items]);
        items.forEach((item) => startUpload(item));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    const allDone = queue.length > 0 && queue.every((q) => q.status === 'done' || q.status === 'error');

    return (
        <Dialog open={open} onClose={resetAndClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}>
                Upload documents
                <IconButton size="small" onClick={resetAndClose}>
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        border: '2px dashed',
                        borderColor: isDragging ? 'primary.main' : 'divider',
                        bgcolor: isDragging ? 'action.hover' : 'transparent',
                        borderRadius: 3,
                        py: 5,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: '0.15s',
                    }}
                >
                    <CloudUpload sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Drag & drop PDF files here
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        or click to browse · up to 50MB per file
                    </Typography>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf"
                        multiple
                        hidden
                        onChange={(e) => e.target.files?.length && addFiles(e.target.files)}
                    />
                </Box>

                {queue.length > 0 && (
                    <Stack spacing={1.25} sx={{ mt: 2.5 }}>
                        {queue.map((item, i) => (
                            <Box
                                key={i}
                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5 }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <PictureAsPdf sx={{ fontSize: 18, color: 'error.main' }} />
                                    <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.file.name}
                                    </Typography>
                                    {item.status === 'done' && <CheckCircle sx={{ fontSize: 18, color: 'success.main' }} />}
                                    {item.status === 'error' && <ErrorOutline sx={{ fontSize: 18, color: 'error.main' }} />}
                                    {(item.status === 'uploading' || item.status === 'pending') && (
                                        <Chip label={`${item.progress}%`} size="small" sx={{ height: 20, fontSize: '0.68rem' }} />
                                    )}
                                </Stack>
                                {(item.status === 'uploading' || item.status === 'pending') && (
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.progress}
                                        sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                    />
                                )}
                                {item.status === 'error' && (
                                    <Typography variant="caption" sx={{ color: 'error.main' }}>
                                        {item.error}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={resetAndClose} variant={allDone ? 'contained' : 'text'}>
                    {allDone ? 'Done' : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
