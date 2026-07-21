import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Box } from '@mui/material';

export function MarkdownRenderer({ content, sx = {} }) {
    return (
        <Box
            sx={{
                '& p': { mt: 0, mb: 1, lineHeight: 1.7 },
                '& p:last-child': { mb: 0 },
                '& h1, & h2, & h3, & h4': { mt: 2, mb: 1, fontWeight: 600 },
                '& ul, & ol': { pl: 2.5, mb: 1 },
                '& li': { mb: 0.5, lineHeight: 1.6 },
                '& code': {
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.82rem',
                    bgcolor: 'action.hover',
                    px: 0.7,
                    py: 0.2,
                    borderRadius: 1,
                },
                '& pre': {
                    bgcolor: '#0d1117',
                    borderRadius: 2,
                    p: 2,
                    overflow: 'auto',
                    mb: 2,
                    '& code': { bgcolor: 'transparent', p: 0, fontSize: '0.8rem' },
                },
                '& blockquote': {
                    borderLeft: '3px solid',
                    borderColor: 'primary.main',
                    pl: 2,
                    ml: 0,
                    color: 'text.secondary',
                    fontStyle: 'italic',
                },
                '& table': {
                    borderCollapse: 'collapse',
                    width: '100%',
                    mb: 2,
                    '& th, & td': {
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1,
                        textAlign: 'left',
                    },
                    '& th': { bgcolor: 'action.hover', fontWeight: 600 },
                },
                '& a': { color: 'primary.main' },
                '& strong': { fontWeight: 600 },
                ...sx,
            }}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {content}
            </ReactMarkdown>
        </Box>
    );
}
