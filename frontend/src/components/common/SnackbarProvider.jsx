import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
    const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });

    const notify = useCallback((message, severity = 'info') => {
        setSnack({ open: true, message, severity });
    }, []);

    const handleClose = () => setSnack((s) => ({ ...s, open: false }));

    return (
        <SnackbarContext.Provider value={notify}>
            {children}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snack.severity} onClose={handleClose} variant="filled" sx={{ borderRadius: 2 }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export const useNotify = () => useContext(SnackbarContext);
