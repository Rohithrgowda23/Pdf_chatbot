import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
    Box, Paper, TextField, Button, Typography, InputAdornment,
    IconButton, Link, CircularProgress, Alert, Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, Badge, AutoAwesome } from '@mui/icons-material';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';

function validate({ fullName, username, email, password, confirmPassword }) {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!username.trim()) errors.username = 'Username is required';
    else if (username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
    return errors;
}

export default function Register() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const { mutate: registerAndLogin, isPending } = useMutation({
        mutationFn: async () => {
            await authApi.register({
                fullName: form.fullName.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            // Auto login after successful registration
            return authApi.login({
                email: form.email.trim(),
                username: form.username.trim(),
                password: form.password,
            });
        },
        onSuccess: (res) => {
            const data = res.data || {};
            const token = data.token || data.accessToken || data.jwt;
            const user = data.user || { fullName: form.fullName, username: form.username, email: form.email };
            if (!token) {
                setServerError('Account created — please sign in.');
                navigate('/login');
                return;
            }
            setAuth(user, token);
            navigate('/dashboard');
        },
        onError: (err) => {
            setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError('');
        const validationErrors = validate(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        registerAndLogin();
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
                py: 4,
            }}
        >
            <Paper
                elevation={0}
                sx={{ width: '100%', maxWidth: 460, p: { xs: 3, sm: 4.5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
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
                    Create your account
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Start chatting with your PDF documents in seconds
                </Typography>

                {serverError && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {serverError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full name"
                                value={form.fullName}
                                onChange={update('fullName')}
                                error={Boolean(errors.fullName)}
                                helperText={errors.fullName}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Badge sx={{ fontSize: 19, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={form.username}
                                onChange={update('username')}
                                error={Boolean(errors.username)}
                                helperText={errors.username}
                                margin="normal"
                                autoComplete="username"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ fontSize: 19, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={form.email}
                                onChange={update('email')}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                margin="normal"
                                autoComplete="email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ fontSize: 19, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={update('password')}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                margin="normal"
                                autoComplete="new-password"
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={update('confirmPassword')}
                                error={Boolean(errors.confirmPassword)}
                                helperText={errors.confirmPassword}
                                margin="normal"
                                autoComplete="new-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ fontSize: 19, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isPending}
                        sx={{ mt: 3, py: 1.25 }}
                    >
                        {isPending ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
                        Sign in
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
