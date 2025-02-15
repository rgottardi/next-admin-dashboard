'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { logger } from '@/lib/error';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client-side errors
    logger.error({
      msg: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong!
        </Typography>
        {process.env.NODE_ENV === 'development' && (
          <Typography variant="body1" color="error" sx={{ mb: 2 }}>
            {error.message}
          </Typography>
        )}
        <Button variant="contained" onClick={reset}>
          Try again
        </Button>
      </Box>
    </Container>
  );
} 