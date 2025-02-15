'use client';

import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      const res = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
} 