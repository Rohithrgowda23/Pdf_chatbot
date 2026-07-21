import { useState } from 'react';
import {
    Box, Typography, Accordion, AccordionSummary, AccordionDetails,
    Chip, Stack, Tooltip, LinearProgress,
} from '@mui/material';
import { ExpandMore, Article, Tag } from '@mui/icons-material';

function ScoreBar({ score }) {
    const pct = Math.round((score || 0) * 100);
    return (
        <Tooltip title={`Similarity: ${pct}%`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 90 }}>
                <LinearProgress
                    variant="determinate"
                    value={pct}
                    sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
                    color={pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'error'}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', minWidth: 30 }}>
                    {pct}%
                </Typography>
            </Box>
        </Tooltip>
    );
}

export function SourcesPanel({ sources = [] }) {
    const [expanded, setExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <Box sx={{ mt: 1.5 }}>
            <Accordion
                expanded={expanded}
                onChange={() => setExpanded(!expanded)}
                disableGutters
                elevation={0}
                sx={{
                    bgcolor: 'action.hover',
                    borderRadius: '10px !important',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                }}
            >
                <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18 }} />} sx={{ minHeight: 40, py: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Article sx={{ fontSize: 15, color: 'primary.main' }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {sources.length} source{sources.length > 1 ? 's' : ''} used
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 1.5 }}>
                    <Stack spacing={1}>
                        {sources.map((src, i) => (
                            <Box
                                key={i}
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    p: 1.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1} mb={0.75}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main', flex: 1 }}>
                                        {src.documentTitle || src.document?.title || 'Document'}
                                    </Typography>
                                    <Stack direction="row" spacing={0.75} alignItems="center">
                                        {src.pageNumber && (
                                            <Chip
                                                icon={<Tag sx={{ fontSize: 11, ml: '4px !important' }} />}
                                                label={`p.${src.pageNumber}`}
                                                size="small"
                                                sx={{ height: 20, fontSize: '0.68rem' }}
                                            />
                                        )}
                                        <ScoreBar score={src.score} />
                                    </Stack>
                                </Stack>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    {src.chunkText}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
