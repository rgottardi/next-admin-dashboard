import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import SignOutButton from '../components/SignOutButton';

export default async function UserLanding() {
  await requireUser();
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {profile?.full_name || user.email}
        </Typography>
        
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card>
                    <CardActionArea component={Link} href="/user/profile">
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AccountCircleIcon sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h6">View Profile</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Update your personal information and preferences
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardActionArea component={Link} href="/user/dashboard">
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DashboardIcon sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h6">My Dashboard</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Access your personalized dashboard
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardActionArea component={Link} href="/user/settings">
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SettingsIcon sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="h6">Settings</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Manage your account settings
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <SignOutButton />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No recent activity to display
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* System Status */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Account Status</Typography>
                      <Typography variant="body2" color="success.main">
                        Active
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Last Login</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date().toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Role</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {profile?.role || 'User'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}