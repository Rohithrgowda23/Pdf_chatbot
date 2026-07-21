import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
    Box, Paper, TextField, Button, Typography, InputAdornment,
    IconButton, Link, CircularProgress, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, AutoAwesome } from '@mui/icons-material';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

function validate({ email, password }) {
    const errors = {};
    if (!email.trim()) errors.email = 'Email or username is required';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    return errors;
}

export default function Login() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const { mutate: login, isPending } = useMutation({
        mutationFn: (data) => authApi.login(data),
        onSuccess: (res) => {
            const data = res.data || {};
            const token = data.token || data.accessToken || data.jwt;
            const user = data.user || { email: form.email, username: form.email };
            if (!token) {
                setServerError('Login succeeded but no token was returned by the server.');
                return;
            }
            setAuth(user, token);
            navigate('/dashboard');
        },
        onError: (err) => {
            setServerError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        login({ email: form.email.trim(), username: form.email.trim(), password: form.password });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Box
                        sx={{
                            width: 40, height: 40, borderRadius: 2.5,
                            background: 'linear-gradient(135deg, #5B6EF5 0%, #10B981 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                        DocChat
                    </Typography>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Welcome back
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Sign in to continue chatting with your documents
                </Typography>

                {serverError && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {serverError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Email or username"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        margin="normal"
                        autoComplete="username"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ fontSize: 19, color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
                        margin="normal"
                        autoComplete="current-password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ fontSize: 19, color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                                        {showPassword ? <VisibilityOff sx={{ fontSize: 19 }} /> : <Visibility sx={{ fontSize: 19 }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        sx={{ mt: 1.5 }}
                        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                    >
                        Continue with Google
                    </Button>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isPending}
                        sx={{ mt: 3, py: 1.25 }}
                    >
                        {isPending ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
                        Create one
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
