// client/src/components/app/ClientScreen.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// MUI Imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/GridLegacy';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

// Icon Imports
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

const drawerWidth = 256;

// Styled components for Search Bar
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    minWidth: '200px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

interface Client {
  _id: string;
  name: string;
  address?: string;
  gstin?: string;
  contact?: string;
  createdAt: string;
}

export function ClientScreen() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    gstin: '',
    contact: '',
  });

  // Fetch clients
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients', searchQuery],
    queryFn: async () => {
      const { data } = await api.get(`/clients?search=${searchQuery}`);
      return data;
    },
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (clientData: any) => {
      const { data } = await api.post('/clients', clientData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowSuccess(true);
      handleCloseDialog();
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to create client');
      setShowError(true);
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, clientData }: { id: string; clientData: any }) => {
      const { data } = await api.put(`/clients/${id}`, clientData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowSuccess(true);
      handleCloseDialog();
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to update client');
      setShowError(true);
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowSuccess(true);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to delete client');
      setShowError(true);
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (item: any) => {
    if (item.action === 'logout') {
      navigate('/login');
    } else if (item.path) {
      navigate(item.path);
    }
    setMobileOpen(false);
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        address: client.address || '',
        gstin: client.gstin || '',
        contact: client.contact || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        address: '',
        gstin: '',
        contact: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
    setFormData({
      name: '',
      address: '',
      gstin: '',
      contact: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Client name is required');
      setShowError(true);
      return;
    }

    if (editingClient) {
      updateClientMutation.mutate({
        id: editingClient._id,
        clientData: formData,
      });
    } else {
      createClientMutation.mutate(formData);
    }
  };

  const handleDelete = (client: Client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      deleteClientMutation.mutate(client._id);
    }
  };

  const handleCreateInvoice = (client: Client) => {
    navigate('/invoices/new', { state: { selectedClient: client } });
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Invoices', icon: <ReceiptLongIcon />, path: '/invoices' },
    { text: 'Clients', icon: <PeopleIcon />, active: true, path: '/clients' },
  ];

  const drawerBottomItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/profile' },
    { text: 'Log Out', icon: <LogoutIcon />, action: 'logout' },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo/Title */}
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, px: [2] }}>
        <ReceiptLongIcon color="primary" sx={{ fontSize: 30 }}/>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          GST Invoice
        </Typography>
      </Toolbar>
      <List sx={{ flexGrow: 1 }}>
        {drawerItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={item.active}
              onClick={() => handleNavigation(item)}
            >
              <ListItemIcon sx={{ color: item.active ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: item.active ? 'primary.main' : 'inherit' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        {drawerBottomItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* --- Sidebar --- */}
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0, 0, 0, 0.12)' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* --- Main Content Area --- */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'grey.100', width: { lg: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* --- Header / AppBar --- */}
        <AppBar
          position="sticky"
          sx={{
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Toolbar>
            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Search Bar */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            {/* Right Side Icons/Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit">
                
              </IconButton>
              <Avatar
                alt={user?.fullName || user?.email || 'User'}
                src={user?.avatarUrl}
                sx={{ width: 40, height: 40, ml: 1 }}
              >
                {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', ml: 1, lineHeight: 1.2 }}>
                 <Typography variant="body2" fontWeight="medium">{user?.fullName || 'User'}</Typography>
                 <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- Page Content --- */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">Clients</Typography>
              <Typography color="text.secondary">Manage your business clients and create invoices.</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add New Client
            </Button>
          </Box>

          {/* Clients Table */}
          <Card>
            <CardContent sx={{ pb: 0 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                All Clients ({clientsData?.totalCount || 0})
              </Typography>
            </CardContent>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="clients table">
                <TableHead sx={{ backgroundColor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>GSTIN</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingClients ? (
                    // Skeleton rows for loading state
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    clientsData?.clients?.map((client: Client) => (
                      <TableRow
                        key={client._id}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {client.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight="medium">
                              {client.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{client.contact || 'N/A'}</TableCell>
                        <TableCell>
                          {client.gstin ? (
                            <Chip label={client.gstin} size="small" color="primary" variant="outlined" />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          {client.address || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleCreateInvoice(client)}
                              sx={{ minWidth: 'auto', px: 2 }}
                            >
                              Create Invoice
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(client)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(client)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )) ?? (
                       <TableRow>
                           <TableCell colSpan={5} align="center">No clients found.</TableCell>
                       </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>

      {/* Client Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClient ? 'Edit Client' : 'Add New Client'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Client Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Contact Number"
              fullWidth
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <TextField
              label="GSTIN"
              fullWidth
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createClientMutation.isPending || updateClientMutation.isPending}
          >
            {(createClientMutation.isPending || updateClientMutation.isPending) ? (
              <CircularProgress size={20} />
            ) : (
              editingClient ? 'Update' : 'Create'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success and Error Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {editingClient ? 'Client updated successfully!' : 'Client created successfully!'}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

