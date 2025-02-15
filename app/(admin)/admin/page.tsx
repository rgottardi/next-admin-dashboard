import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default async function AdminLanding() {
  await requireAdmin();
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get total users count
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Control Center
        </Typography>
        
        <Grid container spacing={3}>
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Total Users</Typography>
                      <Typography variant="h4">{usersCount || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Active Sessions</Typography>
                      <Typography variant="h4">--</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">System Status</Typography>
                      <Typography variant="h4" color="success.main">OK</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Last Backup</Typography>
                      <Typography variant="h4">--</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Admin Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Administrative Actions
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <PeopleIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h6">User Management</Typography>
                        <Button
                          component={Link}
                          href="/admin/users"
                          variant="contained"
                          fullWidth
                        >
                          Manage Users
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <SettingsIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Settings</Typography>
                        <Button
                          component={Link}
                          href="/admin/settings"
                          variant="contained"
                          fullWidth
                        >
                          System Settings
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <SecurityIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Security</Typography>
                        <Button
                          component={Link}
                          href="/admin/security"
                          variant="contained"
                          fullWidth
                        >
                          Security Settings
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <AnalyticsIcon sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Analytics</Typography>
                        <Button
                          component={Link}
                          href="/admin/analytics"
                          variant="contained"
                          fullWidth
                        >
                          View Analytics
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent System Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}