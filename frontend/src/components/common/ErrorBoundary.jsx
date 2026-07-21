import { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // eslint-disable-next-line no-console
        console.error('ErrorBoundary caught an error:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        p: 3,
                        bgcolor: 'background.default',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            maxWidth: 420,
                            textAlign: 'center',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 3,
                        }}
                    >
                        <ErrorOutline sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                        </Typography>
                        <Button variant="contained" startIcon={<Refresh />} onClick={this.handleReset}>
                            Back to Dashboard
                        </Button>
                    </Paper>
                </Box>
            );
        }
        return this.props.children;
    }
}
