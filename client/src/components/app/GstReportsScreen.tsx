// client/src/components/app/GstReportsScreen.tsx
import React, { useState } from 'react';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

// MUI Imports
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Ensure LocalizationProvider is wrapping the app in main.tsx

// Icon Imports
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description'; // For Excel
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
// Keep other icons as needed for header if reusing logic

// Define types for data (Adjust based on your actual API response)
interface GstSummaryStats {
  totalSales: number;
  totalGstCollected: number;
  totalInputTaxCredit: number;
  netGstPayable: number;
}

interface ReportDetail {
  id: string; // Unique key for table row
  invoiceNumber: string;
  date: string; // Format as needed
  customer: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

// API fetching functions (Example endpoints, adjust as needed)
const fetchGstSummary = async (start?: Date | null, end?: Date | null): Promise<GstSummaryStats> => {
  const params: any = {};
  if (start) params.startDate = start.toISOString();
  if (end) params.endDate = end.toISOString();
  const { data } = await api.get('/gst-reports/summary', { params });
  const totalGstCollected = (data.totalGST ?? 0) as number;
  const totalInputTaxCredit = 0; // No purchase data available; adjust when purchases are added
  const netGstPayable = totalGstCollected - totalInputTaxCredit;
  return {
    totalSales: data.totalSales ?? 0,
    totalGstCollected,
    totalInputTaxCredit,
    netGstPayable,
  };
};

const fetchGstDetails = async (start?: Date | null, end?: Date | null, search?: string): Promise<ReportDetail[]> => {
  const params: any = {};
  if (start) params.startDate = start.toISOString();
  if (end) params.endDate = end.toISOString();
  if (search && search.trim().length > 0) params.search = search.trim();
  const { data } = await api.get('/gst-reports/details', { params });
  return (data || []).map((row: any) => ({
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    date: new Date(row.date).toLocaleDateString(),
    customer: row.customer,
    taxableAmount: row.taxableAmount,
    cgst: row.cgst,
    sgst: row.sgst,
    igst: row.igst,
    total: row.total,
  }));
};

// Helper component for Summary Cards - Enhanced for specific styling
const SummaryCard = ({ title, value, bgColor, textColor, valueColor, isLoading }: any) => (
  <Card sx={{ backgroundColor: bgColor, height: '100%' }}>
    <CardContent>
      <Typography sx={{ fontSize: 14, color: textColor }} gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: valueColor }}>
        {isLoading ? <Skeleton width="70%" /> : value}
      </Typography>
    </CardContent>
  </Card>
);

export function GstReportsScreen() {
  // State for date pickers and search
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // State for mobile header menu (if needed)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch profile for real avatar/logo
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await api.get('/profile');
      return data as { user: { fullName?: string; email: string; avatarUrl?: string }, business: { name: string; logoUrl?: string } };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch Summary
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['gstSummary', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => fetchGstSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  // Fetch Details
  const { data: details, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['gstDetails', startDate?.toISOString(), endDate?.toISOString(), searchQuery],
    queryFn: () => fetchGstDetails(startDate, endDate, searchQuery),
    enabled: !!startDate && !!endDate,
  });

   const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
   };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Add debounce and refetch details
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
      {/* --- Header (Simplified, adjust if using shared layout) --- */}
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
             {/* Simple Logo Placeholder */}
            <Typography variant="h6" noWrap component="div" fontWeight="bold" color="primary">
              GST Invoice
            </Typography>
            {/* Navigation Links (Desktop) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              <Link href="#" color="inherit" underline="none" sx={{ fontSize: '0.875rem' }}>Dashboard</Link>
              <Link href="#" color="inherit" underline="none" sx={{ fontSize: '0.875rem' }}>Invoices</Link>
              <Link href="#" color="primary" underline="none" sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Reports</Link>
              <Link href="#" color="inherit" underline="none" sx={{ fontSize: '0.875rem' }}>Clients</Link>
            </Box>
          </Box>

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }} // Show only on mobile
            >
              <MenuIcon />
            </IconButton>
             {/* <Button variant="contained" size="medium">New Invoice</Button> */}
            <Avatar
              alt={profile?.business?.name || profile?.user?.fullName || profile?.user?.email || 'User'}
              src={profile?.business?.logoUrl || profile?.user?.avatarUrl || undefined}
              sx={{ width: 40, height: 40 }}
            >
              {(profile?.business?.name?.charAt(0) || profile?.user?.fullName?.charAt(0) || profile?.user?.email?.charAt(0) || 'U')}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- Main Content --- */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {/* Breadcrumbs */}
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="#">Home</Link>
            <Link underline="hover" color="inherit" href="#">Reports</Link>
            <Typography color="text.primary">GST Reports</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="900">
              GST Reports
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<PictureAsPdfIcon />}>Download PDF</Button>
              <Button variant="outlined" startIcon={<DescriptionIcon />}>Download Excel</Button>
            </Box>
          </Box>

          {/* Date Range Selector Card */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              Select Date Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
                minDate={startDate ?? undefined}
              />
            </Box>
          </Paper>

          {/* GST Summary Card */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
              GST Summary for Selected Period
            </Typography>
             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2 }}>
               <SummaryCard
                 title="Total Sales"
                 value={formatCurrency(summary?.totalSales ?? 0)}
                 bgColor="info.lightest"
                 textColor="info.dark"
                 valueColor="info.darker"
                 isLoading={isLoadingSummary}
               />
               <SummaryCard
                 title="Total GST Collected"
                 value={formatCurrency(summary?.totalGstCollected ?? 0)}
                 bgColor="success.lightest"
                 textColor="success.dark"
                 valueColor="success.darker"
                 isLoading={isLoadingSummary}
               />
               <SummaryCard
                 title="Total Input Tax Credit"
                 value={formatCurrency(summary?.totalInputTaxCredit ?? 0)}
                 bgColor="warning.lightest"
                 textColor="warning.dark"
                 valueColor="warning.darker"
                 isLoading={isLoadingSummary}
               />
               <SummaryCard
                 title="Net GST Payable"
                 value={formatCurrency(summary?.netGstPayable ?? 0)}
                 bgColor="error.lightest"
                 textColor="error.dark"
                 valueColor="error.darker"
                 isLoading={isLoadingSummary}
               />
             </Box>
          </Paper>

          {/* Detailed Report Card */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
             <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                 Detailed Report
                </Typography>
                <TextField
                  placeholder="Search invoices..."
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
                  sx={{ width: { xs: '100%', sm: '250px' } }}
                />
            </Box>

            {/* Detailed Report Table */}
            <TableContainer>
              <Table stickyHeader size="small">
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Taxable Amount</TableCell>
                    <TableCell align="right">CGST</TableCell>
                    <TableCell align="right">SGST</TableCell>
                    <TableCell align="right">IGST</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingDetails ? (
                     [...Array(4)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton width="60%"/></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                        <TableCell align="right"><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    details?.map((row) => (
                      <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{row.invoiceNumber}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.customer}</TableCell>
                        <TableCell align="right">{formatCurrency(row.taxableAmount)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.cgst)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.sgst)}</TableCell>
                        <TableCell align="right">{formatCurrency(row.igst)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>{formatCurrency(row.total)}</TableCell>
                      </TableRow>
                    )) ?? (
                       <TableRow>
                           <TableCell colSpan={8} align="center">No details found for the selected period.</TableCell>
                       </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Add Pagination if needed for the details table */}
          </Paper>
        </Box>
      </Box>
       {/* Consider adding a shared Footer component */}
    </Box>
  );
}