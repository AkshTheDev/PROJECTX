// client/src/components/app/InvoiceHistoryScreen.tsx
import React, { useState } from 'react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

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
import Grid from '@mui/material/Grid';
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
// Standard DatePicker import
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// REMOVED LocalizationProvider and AdapterDateFns imports from here

// Icon Imports
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
// CalendarTodayIcon might not be needed
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

// Define types for data (Adjust based on your actual API response)
interface InvoiceSummaryStats {
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
}

type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Draft'; // Match API

interface Invoice {
  id: string; // Unique ID for the row key
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string; // Should ideally be Date objects, format as needed
  dueDate: string;     // Should ideally be Date objects, format as needed
  amount: number;
  status: InvoiceStatus;
}

// API fetching functions (Example endpoints, adjust as needed)
const fetchInvoiceSummary = async (): Promise<InvoiceSummaryStats> => {
  // const { data } = await api.get('/invoices/summary');
  // Mock data for now:
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
  return { totalInvoiced: 125000, totalPaid: 100000, totalOutstanding: 25000 };
};

const fetchInvoices = async (/* page = 1, filters = {} */): Promise<{ invoices: Invoice[], totalCount: number }> => {
  // const { data } = await api.get('/invoices', { params: { page, ...filters } });
  // Mock data for now:
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
  const mockInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-00123', customerName: 'Acme Corporation', invoiceDate: '15 Jul 2024', dueDate: '30 Jul 2024', amount: 15000.00, status: 'Paid' },
    { id: '2', invoiceNumber: 'INV-00124', customerName: 'Innovate LLC', invoiceDate: '12 Jul 2024', dueDate: '27 Jul 2024', amount: 5000.00, status: 'Overdue' },
    { id: '3', invoiceNumber: 'INV-00125', customerName: 'Quantum Solutions', invoiceDate: '10 Jul 2024', dueDate: '25 Jul 2024', amount: 20000.00, status: 'Unpaid' },
    { id: '4', invoiceNumber: 'INV-00126', customerName: 'Apex Designs', invoiceDate: '05 Jul 2024', dueDate: '20 Jul 2024', amount: 8500.00, status: 'Draft' },
  ];
  return { invoices: mockInvoices, totalCount: 25 }; // Example total count
};

// Helper function for status chip colors
const getStatusChipStyle = (status: InvoiceStatus): { color: "success" | "warning" | "error" | "info" | "default", variant: "filled" | "outlined" } => {
  switch (status) {
    case 'Paid': return { color: 'success', variant: 'filled' };
    case 'Overdue': return { color: 'error', variant: 'filled' };
    case 'Unpaid': return { color: 'info', variant: 'filled' };
    case 'Draft': return { color: 'default', variant: 'outlined' };
    default: return { color: 'default', variant: 'outlined' };
  }
};

export function InvoiceHistoryScreen() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ type: string, value: string }[]>([]);

  // Fetch Summary Stats
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['invoiceSummary'],
    queryFn: fetchInvoiceSummary,
  });

  // Fetch Invoices
  const { data: invoiceData, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'], // Add page, filters here later
    queryFn: () => fetchInvoices(),
  });

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    // TODO: Update activeFilters state and refetch invoices
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Add debounce and refetch invoices
  };

  const handleClearFilters = () => {
      setStatusFilter('all');
      setSearchQuery('');
      setStartDate(null);
      setEndDate(null);
      setActiveFilters([]);
      // TODO: Refetch invoices
  }

  // TODO: Add functions to add/remove filter chips

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
      {/* --- Header --- */}
      <AppBar
        position="sticky"
        sx={{
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptLongIcon color="primary" sx={{ fontSize: 30 }}/>
              <Typography variant="h6" noWrap component="div" fontWeight="bold">
                GST Invoicing
              </Typography>
            </Box>
            {/* Navigation Links (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              <Link href="#" color="inherit" underline="none" sx={{ fontSize: '0.875rem' }}>Dashboard</Link>
              <Link href="#" color="primary" underline="none" sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Invoice History</Link>
              <Link href="#" color="inherit" underline="none" sx={{ fontSize: '0.875rem' }}>Create Invoice</Link>
            </Box>
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" sx={{ bgcolor: 'action.hover' }}>
              <PersonIcon />
            </IconButton>
            <Avatar
              alt="User Avatar"
              src="https://via.placeholder.com/40" // Replace with actual avatar URL
              sx={{ width: 40, height: 40 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Main Content --- */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h4" component="h1" fontWeight="900" sx={{ mb: 4 }}>
            Invoice History
          </Typography>

          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid >
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Invoiced</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalInvoiced.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
             <Grid >
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Paid</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalPaid.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
             <Grid >
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Outstanding</Typography>
                  <Typography variant="h5" component="div" fontWeight="bold" color="warning.main">
                     {isLoadingSummary ? <Skeleton width="80%"/> : `₹${summary?.totalOutstanding.toLocaleString()}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters & Table Card */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            {/* Filter Controls */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid > {/* Adjusted grid size */}
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
              {/* --- Date Pickers --- */}
              <Grid > {/* Adjusted grid size */}
                 {/* REMOVED LocalizationProvider wrapper */}
                 <DatePicker
                   label="Start Date"
                   value={startDate}
                   onChange={(newValue) => setStartDate(newValue)}
                   slotProps={{ textField: { size: 'small', fullWidth: true } }}
                 />
              </Grid>
              <Grid > {/* Adjusted grid size */}
                 {/* REMOVED LocalizationProvider wrapper */}
                 <DatePicker
                   label="End Date"
                   value={endDate}
                   onChange={(newValue) => setEndDate(newValue)}
                   slotProps={{ textField: { size: 'small', fullWidth: true } }}
                   minDate={startDate ?? undefined}
                 />
              </Grid>
              {/* --- End Date Pickers --- */}
              <Grid > {/* Adjusted grid size */}
                <Select
                  fullWidth
                  value={statusFilter}
                  onChange={handleStatusChange}
                  displayEmpty
                  size="small"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Unpaid">Unpaid</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
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
                    invoiceData?.invoices.map((row) => {
                      const statusStyle = getStatusChipStyle(row.status);
                      return (
                        <TableRow
                          key={row.id}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">{row.invoiceNumber}</TableCell>
                          <TableCell>{row.customerName}</TableCell>
                          <TableCell>{row.invoiceDate}</TableCell>
                          <TableCell>{row.dueDate}</TableCell>
                          <TableCell align="right">{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell>
                            <Chip label={row.status} color={statusStyle.color} variant={statusStyle.variant} size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                              <IconButton size="small" aria-label="edit"><EditIcon fontSize="small" /></IconButton>
                              <IconButton size="small" aria-label="download"><DownloadIcon fontSize="small" /></IconButton>
                              <IconButton size="small" aria-label="delete" color="error"><DeleteIcon fontSize="small" /></IconButton>
                            </Box>
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
                Showing 1 to {invoiceData?.invoices.length ?? 0} of {invoiceData?.totalCount ?? 0} invoices
              </Typography>
              <Pagination
                count={Math.ceil((invoiceData?.totalCount ?? 0) / (invoiceData?.invoices.length || 1))}
                color="primary"
                size="small"
                hidePrevButton={Math.ceil((invoiceData?.totalCount ?? 0) / (invoiceData?.invoices.length || 1)) <= 1}
                hideNextButton={Math.ceil((invoiceData?.totalCount ?? 0) / (invoiceData?.invoices.length || 1)) <= 1}
              />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* --- Footer --- */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', mt: 'auto', py: 2, px: { xs: 2, sm: 3 } }}>
         <Typography variant="body2" color="text.secondary" align="center">
          © 2024 GST Invoicing Inc. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
           <Link href="#" variant="body2" color="text.secondary" underline="hover">Terms of Service</Link>
           <Link href="#" variant="body2" color="text.secondary" underline="hover">Privacy Policy</Link>
           <Link href="#" variant="body2" color="text.secondary" underline="hover">Support</Link>
        </Box>
      </Box>
    </Box>
  );
}