// client/src/components/app/DashboardScreen.tsx
import React, { useState } from 'react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

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
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid'; // Using Grid v2 syntax
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton'; // For loading states
import { styled, alpha } from '@mui/material/styles';

// Icon Imports
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Using this instead of all_inbox
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MenuIcon from '@mui/icons-material/Menu'; // For mobile drawer toggle

const drawerWidth = 256; // Width of the sidebar

// Styled components for Search Bar (optional, can use sx prop too)
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05), // Light background
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.08),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
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
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Define types for the data (same as before)
interface DashboardStats {
  totalInvoices: number;
  pendingPayments: number;
  gstCollected: number;
  gstPaid: number;
}

interface RecentInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  date: string; // Formatted date string
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE'; // Match your backend enum/status
}

// API fetching functions (same as before)
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats'); // Adjust endpoint if needed
  return data;
};

const fetchRecentInvoices = async (): Promise<RecentInvoice[]> => {
  const { data } = await api.get('/dashboard/recent-invoices'); // Adjust endpoint if needed
  return data;
};

// --- Helper Components ---
const StatCard = ({ title, value, icon, isLoading }: { title: string, value: string, icon: React.ReactNode, isLoading: boolean }) => (
  <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h5" component="div" fontWeight="bold">
        {isLoading ? <Skeleton variant="text" width={100} /> : value}
      </Typography>
    </CardContent>
  </Card>
);

const getStatusChipColor = (status: RecentInvoice['status']): "success" | "warning" | "error" | "default" => {
  switch (status) {
    case 'PAID': return 'success';
    case 'PENDING': return 'warning';
    case 'OVERDUE': return 'error';
    default: return 'default';
  }
};

export function DashboardScreen() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  const { data: recentInvoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['recentInvoices'],
    queryFn: fetchRecentInvoices,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, active: true },
    { text: 'Invoices', icon: <ReceiptLongIcon /> },
    { text: 'Clients', icon: <PeopleIcon /> },
    { text: 'Reports', icon: <BarChartIcon /> },
  ];

  const drawerBottomItems = [
    { text: 'Settings', icon: <SettingsIcon /> },
    { text: 'Log Out', icon: <LogoutIcon /> },
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
            <ListItemButton selected={item.active}>
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
            <ListItemButton>
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
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
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
        sx={{ flexGrow: 1, bgcolor: 'grey.100', // background-light equivalent
               width: { lg: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* --- Header / AppBar --- */}
        <AppBar
          position="sticky" // Keeps header visible on scroll
          sx={{
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'background.paper', // White background
            color: 'text.primary', // Black text
            // width: { lg: `calc(100% - ${drawerWidth}px)` }, // Makes AppBar align with content
            // ml: { lg: `${drawerWidth}px` }, // Offset for drawer
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
            <Search sx={{ display: { xs: 'none', sm: 'block' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search invoices…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

            {/* Right Side Icons/Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="error"> {/* Example badge */}
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Avatar
                alt="Tarun Acme Inc."
                src="https://via.placeholder.com/40" // Replace with actual image URL or leave blank for initials
                sx={{ width: 40, height: 40, ml: 1 }}
              />
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', ml: 1, lineHeight: 1.2 }}>
                 <Typography variant="body2" fontWeight="medium">Tarun</Typography>
                 <Typography variant="caption" color="text.secondary">Acme Inc.</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* --- Page Content --- */}
        <Box sx={{ p: { xs: 2, sm: 3 } }}> {/* Padding for content */}
          {/* Header Section */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">Dashboard</Typography>
              <Typography color="text.secondary">Here's a summary of your business.</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Button variant="contained" startIcon={<AddCircleIcon />}>Create New Invoice</Button>
              <Button variant="outlined" startIcon={<PersonAddIcon />}>Add New Client</Button>
              <Button variant="outlined" startIcon={<AssessmentIcon />}>Generate GST Report</Button>
            </Box>
          </Box>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid >
              <StatCard
                title="Total Invoices"
                value={stats?.totalInvoices.toLocaleString() ?? '...'}
                icon={<TrendingUpIcon color="success" />}
                isLoading={isLoadingStats}
              />
            </Grid>
            <Grid >
              <StatCard
                title="Pending Payments"
                value={`₹${stats?.pendingPayments.toLocaleString() ?? '...'}`}
                icon={<HourglassTopIcon color="warning" />}
                isLoading={isLoadingStats}
              />
            </Grid>
            <Grid >
              <StatCard
                title="GST Collected/Paid"
                value={`₹${stats?.gstCollected.toLocaleString() ?? '...'}k / ₹${stats?.gstPaid.toLocaleString() ?? '...'}k`}
                icon={<AccountBalanceIcon color="primary" />}
                isLoading={isLoadingStats}
              />
            </Grid>
          </Grid>

          {/* Invoice Summary Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" fontWeight="bold">
                Invoice Summary - Last 30 Days
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h4" component="p" fontWeight="bold">
                   {isLoadingStats ? <Skeleton width={150} /> : '₹1,20,000'} {/* Example static data */}
                </Typography>
                <Typography color="success.main" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                  <ArrowUpwardIcon sx={{ fontSize: '1rem', mr: 0.5 }}/> 10% {/* Example static data */}
                </Typography>
              </Box>
               {/* TODO: Add Chart component here */}
              <Box sx={{ height: 240, mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', border: '1px dashed grey' }}>
                Chart Placeholder
              </Box>
            </CardContent>
          </Card>

          {/* Recent Invoices Table */}
          <Card>
             <CardContent sx={{ pb: 0 }}>
               <Typography variant="h6" component="div" fontWeight="bold">
                 Recent Invoices
               </Typography>
            </CardContent>
            <TableContainer component={Paper} elevation={0} square>
              <Table sx={{ minWidth: 650 }} aria-label="recent invoices table">
                <TableHead sx={{ backgroundColor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingInvoices ? (
                    // Skeleton rows for loading state
                    [...Array(4)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    recentInvoices?.map((invoice) => (
                      <TableRow
                        key={invoice.invoiceNumber}
                        hover
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row" sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{invoice.date}</TableCell>
                        <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip label={invoice.status} color={getStatusChipColor(invoice.status)} size="small" />
                        </TableCell>
                      </TableRow>
                    )) ?? ( // Handle case where data is undefined/null after loading
                       <TableRow>
                           <TableCell colSpan={5} align="center">No recent invoices found.</TableCell>
                       </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}