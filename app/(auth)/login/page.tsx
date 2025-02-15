'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Link as MuiLink
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Sign In
          </Typography>
          
          <form onSubmit={handleLogin}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <MuiLink component={Link} href="/auth/register" variant="body2">
                Don't have an account? Sign up
              </MuiLink>
              <MuiLink component={Link} href="/auth/reset-password" variant="body2">
                Forgot password?
              </MuiLink>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}