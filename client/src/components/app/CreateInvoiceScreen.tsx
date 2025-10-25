// client/src/components/app/CreateInvoiceScreen.tsx
import React, { useState } from 'react';
// Keep state management for items, form data etc.

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
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize'; // Or use TextField multiline
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// Ensure LocalizationProvider wraps app in main.tsx

// Icon Imports (using MUI icons)
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2'; // Replaces Package
import AssessmentIcon from '@mui/icons-material/Assessment'; // Replaces BarChart
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // Replaces HelpCircle
import EmailIcon from '@mui/icons-material/Email'; // Replaces Mail
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Replaces PlusCircle
import DeleteIcon from '@mui/icons-material/Delete'; // For removing items
import Avatar from '@mui/material/Avatar'; // <-- ADD THIS LINE
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

export function CreateInvoiceScreen() {
  // State for form fields - Add state for all relevant fields
  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [address, setAddress] = useState('123, Maple Street, Bengaluru, Karnataka, 560001');
  const [gstin, setGstin] = useState('29ABCDE1234F1Z5');
  const [contactNo, setContactNo] = useState('+91 98765 43210');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2024-00123');
  const [invoiceDate, setInvoiceDate] = useState<Date | null>(new Date('2024-07-26'));
  const [dueDate, setDueDate] = useState<Date | null>(new Date('2024-08-10'));
  const [notes, setNotes] = useState('Payment is due within 15 days. Thank you for your business!');

  // State for invoice items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: 'Web Design Services', hsnSac: '998314', quantity: 1, rate: 50000, gstRate: 18, amount: 59000.00 },
    { id: 2, description: 'Domain & Hosting', hsnSac: '998315', quantity: 1, rate: 8000, gstRate: 18, amount: 9440.00 },
  ]);

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
      // Add a new blank item object
      { id: Date.now(), description: '', hsnSac: '', quantity: 1, rate: 0, gstRate: 18, amount: 0 },
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
 // --- End Handlers ---


  // Sidebar Content (Simplified)
  const drawerContent = (
     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2, pt: 0 }}>
       {/* Logo/Title */}
       <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 0 }}>
         <Avatar
           alt="Modern Invoicer Logo"
           src="https://storage.googleapis.com/stitch-assets/static/assets/images/stitch_login_signup/invoice_creation/logo.png"
           sx={{ width: 40, height: 40 }}
         />
         <Box>
            <Typography variant="subtitle1" fontWeight="medium">Modern Invoicer</Typography>
            <Typography variant="caption" color="text.secondary">GST Invoicing</Typography>
         </Box>
       </Toolbar>
       {/* Nav Items */}
       <List sx={{ flexGrow: 1 }}>
         {['Dashboard', 'Invoices', 'Customers', 'Products', 'Reports'].map((text, index) => (
           <ListItem key={text} disablePadding sx={{ mb: 0.5 }}>
             <ListItemButton selected={text === 'Invoices'} sx={{ borderRadius: 1 }}>
               <ListItemIcon sx={{ minWidth: 36, color: text === 'Invoices' ? 'primary.main' : 'inherit' }}>
                 {index === 0 && <DashboardIcon />}
                 {index === 1 && <ReceiptLongIcon />}
                 {index === 2 && <PeopleIcon />}
                 {index === 3 && <Inventory2Icon />}
                 {index === 4 && <AssessmentIcon />}
               </ListItemIcon>
               <ListItemText primary={text} />
             </ListItemButton>
           </ListItem>
         ))}
       </List>
       {/* Bottom Actions */}
       <Box sx={{ mt: 'auto' }}>
            <Button variant="contained" fullWidth sx={{ mb: 2 }}>New Invoice</Button>
            <List dense>
                 {['Settings', 'Help'].map((text, index) => (
                   <ListItem key={text} disablePadding>
                     <ListItemButton sx={{ borderRadius: 1 }}>
                       <ListItemIcon sx={{ minWidth: 36 }}>
                         {index === 0 && <SettingsIcon />}
                         {index === 1 && <HelpOutlineIcon />}
                       </ListItemIcon>
                       <ListItemText primary={text} />
                     </ListItemButton>
                   </ListItem>
                 ))}
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
              <Button variant="outlined">Save as Draft</Button>
              <Button variant="contained">Generate PDF</Button>
              <Button variant="contained" startIcon={<EmailIcon />}>Send</Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Customer Info Card */}
            <Grid >
              <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Customer Information</Typography>
                <Grid container spacing={2}>
                   <Grid >
                        <TextField
                            label="Customer Name"
                            fullWidth
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Search or add new customer"
                        />
                   </Grid>
                   <Grid >
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
                   <Grid>
                         <TextField
                            label="GSTIN"
                            fullWidth
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                        />
                   </Grid>
                   <Grid>
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
            <Grid >
               <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Invoice Details</Typography>
                   <Grid container spacing={2}>
                      <Grid >
                          <TextField
                              label="Invoice Number"
                              fullWidth
                              value={invoiceNumber}
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                          />
                      </Grid>
                      <Grid>
                          <DatePicker
                              label="Invoice Date"
                              value={invoiceDate}
                              onChange={(newValue) => setInvoiceDate(newValue)}
                              slotProps={{ textField: { fullWidth: true } }} // Make input full width
                          />
                      </Grid>
                      <Grid>
                          <DatePicker
                              label="Due Date"
                              value={dueDate}
                              onChange={(newValue) => setDueDate(newValue)}
                              slotProps={{ textField: { fullWidth: true } }}
                              minDate={invoiceDate ?? undefined}
                          />
                      </Grid>
                   </Grid>
               </Paper>
            </Grid>

            {/* Items Table Card */}
            <Grid >
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
                              {items.map((item, index) => (
                                  <TableRow key={item.id}>
                                      <TableCell sx={{ py: 0.5 }}>
                                          <TextField
                                              variant="standard" // Less intrusive look in table
                                              fullWidth
                                              size="small"
                                              value={item.description}
                                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                              InputProps={{ disableUnderline: true }}
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
                                              InputProps={{ disableUnderline: true, inputProps: { min: 0 } }}
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
                                              InputProps={{ disableUnderline: true, inputProps: { min: 0 } }}
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
                              ))}
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
            <Grid > {/* Adjusted grid size */}
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
             <Grid > {/* Adjusted grid size */}
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
    </Box>
  );
}