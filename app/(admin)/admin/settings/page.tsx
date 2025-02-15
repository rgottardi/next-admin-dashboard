'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('Admin Dashboard');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, you would save these settings to your database
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  General Settings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Site Name"
                    variant="outlined"
                    fullWidth
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    margin="normal"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                    }
                    label="Dark Mode"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notification Settings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 2 }}
                  >
                    Reset API Keys
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                  >
                    Clear All Cache
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}