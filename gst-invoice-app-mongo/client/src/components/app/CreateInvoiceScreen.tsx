// client/src/components/app/CreateInvoiceScreen.tsx
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

// MUI Imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/GridLegacy';
import TextField from '@mui/material/TextField';
// import TextareaAutosize from '@mui/material/TextareaAutosize'; // Or use TextField multiline
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Ensure LocalizationProvider wraps app in main.tsx

// Icon Imports (using MUI icons)
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Replaces Package
// import AssessmentIcon from '@mui/icons-material/Assessment'; // Replaces BarChart (removed Reports)
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Replaces HelpCircle (removed Help)
// import EmailIcon from '@mui/icons-material/Email'; // Replaces Mail
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Replaces PlusCircle
import DeleteIcon from '@mui/icons-material/Delete'; // For removing items
// import Avatar from '@mui/material/Avatar'; // No longer used in sidebar header
const drawerWidth = 256;

// Example type for Invoice Item - adjust as needed
interface InvoiceItem {
  id: number; // For mapping keys
  description: string;
  hsnSac: string;
  quantity: number;
  rate: number;
  gstRate: number; // Store as number (e.g., 18 for 18%)
  amount: number; // Calculated: quantity * rate * (1 + gstRate/100)
}

interface Client {
  _id: string;
  name: string;
  address?: string;
  gstin?: string;
  contact?: string;
}

export function CreateInvoiceScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // State for form fields
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)); // 15 days from now
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PENDING' | 'UNPAID'>('DRAFT');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State for invoice items
  const [items, setItems] = useState<InvoiceItem[]>([
    // Start with sane defaults (rate 1) so totals aren't stuck at 0 if user forgets to type immediately
    { id: 1, description: '', hsnSac: '', quantity: 1, rate: 1, gstRate: 18, amount: 1 * 1 * (1 + 18 / 100) },
  ]);

  // Fetch clients for dropdown
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data } = await api.get('/clients');
      return data;
    },
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      const { data } = await api.post('/invoices', invoiceData);
      return data;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/invoices');
      }, 2000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to create invoice');
      setShowError(true);
    },
  });

  // --- Calculation Logic --- (Implement based on your needs)
  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const calculateGst = () => {
      // This needs more complex logic if mixing CGST/SGST/IGST based on location
      // Simplified example assuming only CGST+SGST (e.g., within same state)
      const gstAmount = items.reduce((sum, item) => sum + (item.quantity * item.rate * (item.gstRate / 100)), 0);
      return { cgst: gstAmount / 2, sgst: gstAmount / 2, igst: 0 }; // Example split
  };
   const calculateTotal = () => items.reduce((sum, item) => sum + item.amount, 0);

  const subtotal = calculateSubtotal();
  const { cgst, sgst } = calculateGst(); // Add IGST if needed
  const grandTotal = calculateTotal();
  // --- End Calculation Logic ---

  // --- Handlers ---
  const handleAddItem = () => {
    setItems([
      ...items,
      // Add a new blank item object with better defaults
      { id: Date.now(), description: '', hsnSac: '', quantity: 1, rate: 1, gstRate: 18, amount: 1 * 1 * (1 + 18 / 100) },
    ]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map((item, i) => {
        if (i === index) {
            const newItem = { ...item, [field]: value };
            // Recalculate amount if quantity, rate, or gstRate changes
            if (field === 'quantity' || field === 'rate' || field === 'gstRate') {
                const rate = field === 'rate' ? parseFloat(value) || 0 : newItem.rate;
                const quantity = field === 'quantity' ? parseFloat(value) || 0 : newItem.quantity;
                const gstRate = field === 'gstRate' ? parseFloat(value) || 0 : newItem.gstRate;
                newItem.amount = quantity * rate * (1 + gstRate / 100);
            }
            return newItem;
        }
        return item;
    });
    setItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const selectedClient = clientsData?.clients?.find((client: Client) => client._id === clientId);
    if (selectedClient) {
      setCustomerName(selectedClient.name);
      setAddress(selectedClient.address || '');
      setGstin(selectedClient.gstin || '');
      setContactNo(selectedClient.contact || '');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedClientId) {
      setErrorMessage('Please select a client');
      setShowError(true);
      return;
    }

    if (items.length === 0 || items.some(item => !item.description || item.quantity <= 0 || item.rate <= 0)) {
      setErrorMessage('Please add at least one valid item');
      setShowError(true);
      return;
    }

    const invoiceData = {
      invoiceNumber,
      invoiceDate: invoiceDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
      status: status,
      notes,
      subtotal: calculateSubtotal(),
      cgstAmount: calculateGst().cgst,
      sgstAmount: calculateGst().sgst,
      igstAmount: calculateGst().igst,
      total: calculateTotal(),
      clientId: selectedClientId,
      items: items.map(item => ({
        description: item.description,
        hsnSac: item.hsnSac,
        quantity: item.quantity,
        rate: item.rate,
        gstRate: item.gstRate,
        amount: item.amount,
      })),
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  // Handle pre-selected client from navigation state
  useEffect(() => {
    const selectedClient = location.state?.selectedClient;
    if (selectedClient) {
      setSelectedClientId(selectedClient._id);
      setCustomerName(selectedClient.name);
      setAddress(selectedClient.address || '');
      setGstin(selectedClient.gstin || '');
      setContactNo(selectedClient.contact || '');
    }
  }, [location.state]);

  // Generate invoice number
  useEffect(() => {
    const generateInvoiceNumber = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `INV-${year}${month}${day}-${random}`;
    };
    
    if (!invoiceNumber) {
      setInvoiceNumber(generateInvoiceNumber());
    }
  }, [invoiceNumber]);
 // --- End Handlers ---


  // Sidebar Content (Simplified)
  const drawerContent = (
     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, pt: 0 }}>
       {/* Logo/Title */}
       <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 0 }}>
         <Box
           sx={{
             width: 40,
             height: 40,
             borderRadius: 1,
             bgcolor: 'primary.main',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
           }}
         >
           <ReceiptLongIcon sx={{ color: 'white', fontSize: 24 }} />
         </Box>
         <Box>
            <Typography variant="subtitle1" fontWeight="bold">InvoWiz</Typography>
         </Box>
       </Toolbar>
       {/* Nav Items */}
       <List sx={{ flexGrow: 1 }}>
         {['Dashboard', 'Invoices', 'Add Client'].map((text, index) => (
           <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
             <ListItemButton
               selected={text === 'Invoices'}
               sx={{ borderRadius: 1 }}
               onClick={() => {
                 if (text === 'Dashboard') navigate('/dashboard');
                 if (text === 'Invoices') navigate('/invoices');
                 if (text === 'Add Client') navigate('/clients');
               }}
             >
               <ListItemIcon sx={{ minWidth: 36, color: text === 'Invoices' ? 'primary.main' : 'inherit' }}>
                 {index === 0 && <DashboardIcon />}
                 {index === 1 && <ReceiptLongIcon />}
                 {index === 2 && <PeopleIcon />}
                 {index === 3 && <Inventory2Icon />}
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
       {/* Bottom Actions */}
       <Box sx={{ mt: 'auto' }}>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ borderRadius: 1 }}
                  onClick={() => navigate('/profile')}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ borderRadius: 1 }}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
       </Box>
     </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.100' }}> {/* Use theme background */}
      {/* --- Sidebar --- */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' }, // Hide on mobile
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* --- Main Content --- */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, lg: 4 }, overflowY: 'auto' }}>
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}> {/* Max width like original */}
          {/* Header Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="900">
              Create New Invoice
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined"
                onClick={() => handleSubmit()}
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? <CircularProgress size={20} /> : 'Save as Draft'}
              </Button>
              <Button 
                variant="contained"
                onClick={() => handleSubmit()}
                disabled={createInvoiceMutation.isPending}
              >
                {createInvoiceMutation.isPending ? <CircularProgress size={20} /> : 'Create Invoice'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Customer Info Card */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Customer Information</Typography>
                <Grid container spacing={2}>
                   <Grid item xs={12}>
                        <Select
                          value={selectedClientId}
                          onChange={(e) => handleClientChange(e.target.value)}
                          displayEmpty
                          fullWidth
                          disabled={isLoadingClients}
                        >
                          <MenuItem value="">
                            <em>Select a client</em>
                          </MenuItem>
                          {clientsData?.clients?.map((client: Client) => (
                            <MenuItem key={client._id} value={client._id}>
                              {client.name}
                            </MenuItem>
                          ))}
                        </Select>
                   </Grid>
                   <Grid item xs={12}>
                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer name"
                        />
                   </Grid>
                   <Grid item xs={12}>
                        <TextField
                            label="Address"
                            fullWidth
                            multiline
                            rows={3} // Adjust rows as needed
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter customer's address"
                        />
                   </Grid>
                   <Grid item xs={12} sm={6}>
                         <TextField
                            label="GSTIN"
                            fullWidth
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                        />
                   </Grid>
                   <Grid item xs={12} sm={6}>
                         <TextField
                            label="Contact No."
                            fullWidth
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                        />
                   </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Invoice Details Card */}
            <Grid item xs={12}>
               <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Invoice Details</Typography>
                   <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                          <TextField
                              label="Invoice Number"
                              fullWidth
                              value={invoiceNumber}
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                          />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <DatePicker
                              label="Invoice Date"
                              value={invoiceDate}
                              onChange={(newValue) => setInvoiceDate(newValue)}
                              slotProps={{ textField: { fullWidth: true } }} // Make input full width
                          />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <DatePicker
                              label="Due Date"
                              value={dueDate}
                              onChange={(newValue) => setDueDate(newValue)}
                              slotProps={{ textField: { fullWidth: true } }}
                              minDate={invoiceDate ?? undefined}
                          />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                          <TextField
                              label="Status"
                              fullWidth
                              select
                              value={status}
                              onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'PENDING' | 'UNPAID')}
                          >
                              <MenuItem value="DRAFT">Draft</MenuItem>
                              <MenuItem value="PENDING">Pending</MenuItem>
                              <MenuItem value="UNPAID">Unpaid</MenuItem>
                          </TextField>
                      </Grid>
                   </Grid>
               </Paper>
            </Grid>

            {/* Items Table Card */}
            <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                   <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Items</Typography>
                   <TableContainer>
                      <Table size="small">
                          <TableHead>
                              <TableRow>
                                  <TableCell sx={{ width: '35%' }}>Item Description</TableCell>
                                  <TableCell>HSN/SAC</TableCell>
                                  <TableCell>Qty</TableCell>
                                  <TableCell>Rate</TableCell>
                                  <TableCell>GST %</TableCell>
                                  <TableCell align="right">Amount</TableCell>
                                  <TableCell align="center">Action</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                {items.map((item, index) => {
                  const descError = !item.description || item.description.trim().length === 0;
                  const qtyError = !Number.isFinite(item.quantity) || item.quantity <= 0;
                  const rateError = !Number.isFinite(item.rate) || item.rate <= 0;
                  return (
                  <TableRow key={item.id}>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        variant="standard" // Less intrusive look in table
                        fullWidth
                        size="small"
                        required
                        error={descError}
                        helperText={descError ? 'Description is required' : ' '}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        placeholder="Describe the item or service"
                      />
                    </TableCell>
                                       <TableCell sx={{ py: 0.5 }}>
                                          <TextField
                                              variant="standard"
                                              fullWidth
                                              size="small"
                                              value={item.hsnSac}
                                              onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                                              InputProps={{ disableUnderline: true }}
                                          />
                                      </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <TextField
                        variant="standard"
                        fullWidth
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{ min: 1, step: 1 }}
                        error={qtyError}
                        helperText={qtyError ? 'Quantity must be > 0' : ' '}
                      />
                    </TableCell>
                                      <TableCell sx={{ py: 0.5 }}>
                       <TextField
                        variant="standard"
                        fullWidth
                        size="small"
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{ min: 0.01, step: 0.01 }}
                        error={rateError}
                        helperText={rateError ? 'Rate must be > 0' : ' '}
                      />
                                      </TableCell>
                                      <TableCell sx={{ py: 0.5 }}>
                                          <Select
                                            value={item.gstRate.toString()} // Value must be string for Select
                                            onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
                                            variant="standard"
                                            fullWidth
                                            disableUnderline
                                          >
                                            <MenuItem value="5">5%</MenuItem>
                                            <MenuItem value="12">12%</MenuItem>
                                            <MenuItem value="18">18%</MenuItem>
                                            <MenuItem value="28">28%</MenuItem>
                                          </Select>
                                      </TableCell>
                                      <TableCell align="right">₹{item.amount.toFixed(2)}</TableCell>
                                      <TableCell align="center" sx={{ py: 0 }}>
                                          <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                                              <DeleteIcon fontSize="small"/>
                                          </IconButton>
                                      </TableCell>
                                  </TableRow>
                              )})}
                          </TableBody>
                      </Table>
                   </TableContainer>
                   <Button
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddItem}
                        sx={{ mt: 2 }}
                    >
                        Add Item
                    </Button>
                </Paper>
            </Grid>

            {/* Notes & Summary */}
            <Grid item xs={12} md={6}> {/* Adjusted grid size */}
                 <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Notes</Typography>
                     <TextField
                        fullWidth
                        multiline
                        rows={5} // Adjust rows as needed
                        placeholder="Add any terms, conditions, or notes here."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                 </Paper>
            </Grid>
             <Grid item xs={12} md={6}> {/* Adjusted grid size */}
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                     <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Summary</Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography color="text.secondary">₹{subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">CGST (9%)</Typography> {/* Adjust label dynamically if needed */}
                            <Typography color="text.secondary">₹{cgst.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">SGST (9%)</Typography> {/* Adjust label dynamically if needed */}
                            <Typography color="text.secondary">₹{sgst.toFixed(2)}</Typography>
                        </Box>
                         {/* Add IGST row if applicable */}
                        <Divider sx={{ my: 1 }}/>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="bold" variant="h6">Grand Total</Typography>
                            <Typography fontWeight="bold" variant="h6">₹{grandTotal.toFixed(2)}</Typography>
                        </Box>
                     </Box>
                  </Paper>
             </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Success and Error Notifications */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Invoice created successfully! Redirecting to invoices...
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