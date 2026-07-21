import { createTheme } from '@mui/material/styles';

const baseTokens = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    monoFamily: '"JetBrains Mono", "Fira Code", monospace',
    radius: 10,
};

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#5B6EF5', light: '#7B8EFF', dark: '#3D52D5' },
        secondary: { main: '#10B981', light: '#34D399', dark: '#059669' },
        background: {
            default: '#F7F8FC',
            paper: '#FFFFFF',
            sidebar: '#EEEEF5',
        },
        text: { primary: '#1A1D23', secondary: '#6B7280' },
        divider: '#E5E7EB',
        error: { main: '#EF4444' },
        warning: { main: '#F59E0B' },
        success: { main: '#10B981' },
    },
    typography: {
        fontFamily: baseTokens.fontFamily,
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        body1: { lineHeight: 1.6 },
        body2: { lineHeight: 1.5 },
    },
    shape: { borderRadius: baseTokens.radius },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
            },
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'none' } },
        },
        MuiChip: {
            styleOverrides: { root: { borderRadius: 6 } },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7B8EFF', light: '#A5B4FF', dark: '#5B6EF5' },
        secondary: { main: '#34D399', light: '#6EE7B7', dark: '#10B981' },
        background: {
            default: '#0F1117',
            paper: '#1A1D2E',
            sidebar: '#13151F',
        },
        text: { primary: '#F0F1F5', secondary: '#9CA3AF' },
        divider: '#2A2D3E',
        error: { main: '#FC5C65' },
        warning: { main: '#F59E0B' },
        success: { main: '#34D399' },
    },
    typography: {
        fontFamily: baseTokens.fontFamily,
        h1: { fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, letterSpacing: '-0.01em' },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        body1: { lineHeight: 1.6 },
        body2: { lineHeight: 1.5 },
    },
    shape: { borderRadius: baseTokens.radius },
    components: {
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
            },
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'none' } },
        },
        MuiChip: {
            styleOverrides: { root: { borderRadius: 6 } },
        },
    },
});
