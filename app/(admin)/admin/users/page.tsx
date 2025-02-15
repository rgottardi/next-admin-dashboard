'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

type User = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedValues, setEditedValues] = useState({
    full_name: '',
    role: '',
  });
  
  const supabase = createClientComponentClient();

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'full_name', headerName: 'Full Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.created_at).toLocaleDateString(),
    },
    {
      field: 'last_sign_in_at',
      headerName: 'Last Sign In',
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.last_sign_in_at
          ? new Date(params.row.last_sign_in_at).toLocaleDateString()
          : 'Never',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      const combinedUsers = authUsers.map(user => {
        const profile = profiles?.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: profile?.full_name || '',
          role: profile?.role || 'user',
        };
      });

      setUsers(combinedUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditedValues({
      full_name: user.full_name,
      role: user.role,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (user: User) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;
      
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error:', err);
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedValues.full_name,
          role: editedValues.role,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === selectedUser.id
          ? { ...user, ...editedValues }
          : user
      ));

      setOpenDialog(false);
    } catch (err) {
      setError('Failed to update user');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          autoHeight
          disableRowSelectionOnClick
        />

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Full Name"
              value={editedValues.full_name}
              onChange={(e) => setEditedValues({ ...editedValues, full_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Role"
              value={editedValues.role}
              onChange={(e) => setEditedValues({ ...editedValues, role: e.target.value })}
              fullWidth
              margin="normal"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}