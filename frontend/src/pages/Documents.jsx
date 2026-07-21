import { useMemo, useState } from 'react';
import { Box, Button, Grid, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CloudUpload, Description } from '@mui/icons-material';
import { TopBar } from '../components/layout/TopBar';
import { SearchBar } from '../components/documents/SearchBar';
import { DocumentCard } from '../components/documents/DocumentCard';
import { UploadDialog } from '../components/documents/UploadDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import { useDocuments } from '../hooks/useDocuments';

const PAGE_SIZE = 9;

export default function Documents() {
    const { documents, isLoading, deleteDocument } = useDocuments();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return documents;
        return documents.filter((d) =>
            (d.title || d.originalName || '').toLowerCase().includes(q)
        );
    }, [documents, search]);

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    const handleSearchChange = (val) => {
        setSearch(val);
        setPage(0);
    };

    const confirmDelete = () => {
        if (pendingDeleteId) deleteDocument(pendingDeleteId);
        setPendingDeleteId(null);
    };

    return (
        <Box sx={{ pb: 4 }}>
            <TopBar
                title="Documents"
                subtitle={`${documents.length} document${documents.length === 1 ? '' : 's'} in your library`}
                actions={
                    <>
                        <SearchBar value={search} onChange={handleSearchChange} />
                        <Button variant="contained" startIcon={<CloudUpload />} onClick={() => setUploadOpen(true)}>
                            Upload
                        </Button>
                    </>
                }
            />

            <Box sx={{ px: { xs: 2, md: 4 } }}>
                {isLoading ? (
                    <Grid container spacing={2}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Skeleton variant="rounded" height={150} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon={<Description sx={{ fontSize: 26 }} />}
                        title={search ? 'No matching documents' : 'No documents yet'}
                        description={
                            search
                                ? 'Try a different search term.'
                                : 'Upload a PDF to start chatting with it using AI-powered search.'
                        }
                        actionLabel={search ? undefined : 'Upload document'}
                        onAction={() => setUploadOpen(true)}
                    />
                ) : (
                    <>
                        <Grid container spacing={2}>
                            {paged.map((doc) => (
                                <Grid item xs={12} sm={6} md={4} key={doc.id}>
                                    <DocumentCard document={doc} onDelete={setPendingDeleteId} />
                                </Grid>
                            ))}
                        </Grid>
                        <Pagination page={page} count={pageCount} onChange={setPage} />
                    </>
                )}
            </Box>

            <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />

            <Dialog open={Boolean(pendingDeleteId)} onClose={() => setPendingDeleteId(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete document?</DialogTitle>
                <DialogContent>
                    This will permanently remove the document and its indexed chunks. This action can't be undone.
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={() => setPendingDeleteId(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
