// client/src/components/app/InvoiceHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// MUI Imports
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/GridLegacy';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Standard DatePicker import
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Icon Imports
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

// Define types for data
interface InvoiceSummaryStats {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
}

type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'UNPAID';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
  client: {
    _id: string;
    name: string;
    address?: string;
    gstin?: string;
    contact?: string;
  };
  items: Array<{
    description: string;
    hsnSac?: string;
    quantity: number;
    rate: number;
    gstRate: number;
    amount: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// API fetching functions
const fetchInvoiceSummary = async (): Promise<InvoiceSummaryStats> => {
  const { data } = await api.get('/invoices/summary');
  return data;
};

const fetchInvoices = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ invoices: Invoice[], totalCount: number, currentPage: number, totalPages: number }> => {
  const { data } = await api.get('/invoices', { params });
  return data;
};

// Helper function for status chip colors
const getStatusChipStyle = (status: InvoiceStatus): { color: "success" | "warning" | "error" | "info" | "default", variant: "filled" | "outlined" } => {
  switch (status) {
    case 'PAID': return { color: 'success', variant: 'filled' };
    case 'OVERDUE': return { color: 'error', variant: 'filled' };
    case 'UNPAID': return { color: 'warning', variant: 'filled' };
    case 'PENDING': return { color: 'info', variant: 'filled' };
    case 'DRAFT': return { color: 'default', variant: 'outlined' };
    default: return { color: 'default', variant: 'outlined' };
  }
};

export function InvoiceHistoryScreen() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check for overdue invoices on mount
  useEffect(() => {
    const checkOverdue = async () => {
      try {
        await api.post('/invoices/check-overdue');
        // Refetch invoices and summary after updating overdue status
        queryClient.invalidateQueries({ queryKey: ['invoices'] });
        queryClient.invalidateQueries({ queryKey: ['invoiceSummary'] });
      } catch (error) {
        console.error('Error checking overdue invoices:', error);
      }
    };
    checkOverdue();
  }, [queryClient]);

  // Fetch Summary Stats
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['invoiceSummary'],
    queryFn: fetchInvoiceSummary,
  });

  // Fetch Invoices with filters
  const { data: invoiceData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices', currentPage, statusFilter, searchQuery, startDate, endDate],
    queryFn: () => fetchInvoices({
      page: currentPage,
      limit: 10,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    }),
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoiceSummary'] });
      setShowSuccess(true);
      setShowDeleteDialog(false);
      setSelectedInvoice(null);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to delete invoice');
      setShowError(true);
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/invoices/${id}`, { status: 'PAID' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoiceSummary'] });
      setShowSuccess(true);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to mark invoice as paid');
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

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
    setActiveFilters([]);
    setCurrentPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, invoice: Invoice) => {
    setAnchorEl(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedInvoice(null);
  };

  const handleViewInvoice = () => {
    if (selectedInvoice) {
      // Navigate to invoice view page or open in dialog
      console.log('View invoice:', selectedInvoice._id);
    }
    handleActionClose();
  };

  const handleEditInvoice = () => {
    if (selectedInvoice) {
      navigate(`/invoices/edit/${selectedInvoice._id}`);
    }
    handleActionClose();
  };

  const handleDuplicateInvoice = () => {
    if (selectedInvoice) {
      navigate('/invoices/new', { state: { duplicateInvoice: selectedInvoice } });
    }
    handleActionClose();
  };

  const handleDeleteInvoice = () => {
    setShowDeleteDialog(true);
    handleActionClose();
  };

  const handleConfirmDelete = () => {
    if (selectedInvoice) {
      deleteInvoiceMutation.mutate(selectedInvoice._id);
    }
  };

  const handleDownloadInvoice = () => {
    if (selectedInvoice) {
      // Implement PDF download
      console.log('Download invoice:', selectedInvoice._id);
    }
    handleActionClose();
  };

  const handleSendInvoice = () => {
    if (selectedInvoice) {
      // Implement email sending
      console.log('Send invoice:', selectedInvoice._id);
    }
    handleActionClose();
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Invoices', icon: <ReceiptLongIcon />, active: true, path: '/invoices' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
   
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
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={handleSearchChange}
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
              <Typography variant="h4" component="h1" fontWeight="bold">Invoice History</Typography>
              <Typography color="text.secondary">View and manage all your invoices.</Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/invoices/new')}
            >
              Create New Invoice
            </Button>
          </Box>

          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Invoiced</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalInvoiced?.toLocaleString() || '0'}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Paid</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalPaid?.toLocaleString() || '0'}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Outstanding</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold" color="warning.main">
                     {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalOutstanding?.toLocaleString() || '0'}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters & Table Card */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            {/* Filter Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search by Invoice # or Customer"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                 <DatePicker
                   label="Start Date"
                   value={startDate}
                   onChange={(newValue) => setStartDate(newValue)}
                   slotProps={{ textField: { size: 'small', fullWidth: true } }}
                 />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                 <DatePicker
                   label="End Date"
                   value={endDate}
                   onChange={(newValue) => setEndDate(newValue)}
                   slotProps={{ textField: { size: 'small', fullWidth: true } }}
                   minDate={startDate ?? undefined}
                 />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Select
                  fullWidth
                  value={statusFilter}
                  onChange={handleStatusChange}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="UNPAID">Unpaid</MenuItem>
                  <MenuItem value="OVERDUE">Overdue</MenuItem>
                </Select>
              </Grid>
            </Grid>

             {/* Active Filters Display */}
             {activeFilters.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, alignItems: 'center' }}>
                    {activeFilters.map((filter, index) => (
                    <Chip
                        key={index}
                        label={`${filter.type} : ${filter.value}`}
                        onDelete={() => {/* TODO: Handle filter removal */}}
                        size="small"
                    />
                    ))}
                    <Button
                        size="small"
                        onClick={handleClearFilters}
                        sx={{ textTransform: 'none', ml: 1 }}
                        color="primary"
                    >
                        Clear All
                    </Button>
                </Box>
            )}

            {/* Invoice Table */}
            <TableContainer>
              <Table stickyHeader aria-label="invoice history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Invoice Date</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingInvoices ? (
                     [...Array(4)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton width="60%"/></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell align="center"><Skeleton variant="circular" width={24} height={24}/></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    invoiceData?.invoices?.map((invoice) => {
                      const statusStyle = getStatusChipStyle(invoice.status);
                      return (
                        <TableRow
                          key={invoice._id}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.client?.name || 'Deleted Client'}</TableCell>
                          <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell align="right">{invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Chip label={invoice.status} color={statusStyle.color} variant={statusStyle.variant} size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleActionClick(e, invoice)}
                              aria-label="actions"
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }) ?? (
                       <TableRow>
                           <TableCell colSpan={7} align="center">No invoices found.</TableCell>
                       </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, mt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, invoiceData?.totalCount ?? 0)} of {invoiceData?.totalCount ?? 0} invoices
              </Typography>
              <Pagination
                count={invoiceData?.totalPages ?? 1}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewInvoice}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEditInvoice}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateInvoice}>
          <ListItemIcon>
            <FileCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <Divider />
        {selectedInvoice && selectedInvoice.status !== 'PAID' && (
          <>
            <MenuItem onClick={() => {
              if (selectedInvoice) {
                markAsPaidMutation.mutate(selectedInvoice._id);
                handleActionClose();
              }
            }} sx={{ color: 'success.main' }}>
              <ListItemIcon>
                <CheckCircleIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Mark as Paid</ListItemText>
            </MenuItem>
            <Divider />
          </>
        )}
        <MenuItem onClick={handleDownloadInvoice}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSendInvoice}>
          <ListItemIcon>
            <SendIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteInvoice} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Invoice</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete invoice <strong>{selectedInvoice?.invoiceNumber}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteInvoiceMutation.isPending}
          >
            {deleteInvoiceMutation.isPending ? <CircularProgress size={20} /> : 'Delete'}
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
          Invoice deleted successfully!
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