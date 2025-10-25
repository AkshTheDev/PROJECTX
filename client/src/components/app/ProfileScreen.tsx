// client/src/components/app/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import api from '@/lib/api'; // Assuming you'll fetch/save profile data later
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient

// MUI Imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import InputAdornment from '@mui/material/InputAdornment'; // Import InputAdornment
import Divider from '@mui/material/Divider'; // Import Divider
import Skeleton from '@mui/material/Skeleton'; // Import Skeleton

// Icon Imports
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Define types for profile data
interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  notificationsOn: boolean;
}

interface BusinessProfile {
  id?: string;
  name: string;
  address: string;
  gstin: string;
}

// Example API functions
const fetchUserProfile = async (): Promise<UserProfile> => {
  // const { data } = await api.get('/profile/user');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
  return {
      fullName: 'Rakesh Sharma',
      email: 'rakesh.sharma@example.com',
      phone: '+91 98765 43210',
      avatarUrl: 'https://via.placeholder.com/96',
      notificationsOn: true,
  };
};

const fetchBusinessProfile = async (): Promise<BusinessProfile> => {
  // const { data } = await api.get('/profile/business');
   await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate loading
  return {
      name: 'Sharma Enterprises',
      address: '123, Business Avenue, Commerce City, Mumbai, 400001',
      gstin: '27ABCDE1234F1Z5',
  };
};

// Define Update Functions
const updateUserProfileAPI = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.put('/profile/user', profileData);
    return data;
}
const updateBusinessProfileAPI = async (profileData: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    const { data } = await api.put('/profile/business', profileData);
    return data;
}

export function ProfileScreen() {
  const [activeSection, setActiveSection] = useState('personal');
  const queryClient = useQueryClient();

  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch User Profile Data
  const { data: userProfile, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // onSuccess removed
  });

  // Fetch Business Profile Data
  const { data: businessProfile, isLoading: isLoadingBusiness, isError: isErrorBusiness } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: fetchBusinessProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    // onSuccess removed
  });

  // Use useEffect to update state when data loads
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
      setAvatarUrl(userProfile.avatarUrl || '');
      setNotificationsOn(userProfile.notificationsOn);
    }
  }, [userProfile]);

  useEffect(() => {
    if (businessProfile) {
      setBusinessName(businessProfile.name || '');
      setBusinessAddress(businessProfile.address || '');
      setGstin(businessProfile.gstin || '');
    }
  }, [businessProfile]);

  // Mutation for saving changes
  const mutation = useMutation({
    mutationFn: async () => {
        setSaveStatus('idle');
        const userUpdateData: Partial<UserProfile> = { fullName, phone, notificationsOn };
        const businessUpdateData: Partial<BusinessProfile> = { name: businessName, address: businessAddress, gstin };
        const userUpdatePromise = updateUserProfileAPI(userUpdateData);
        const businessUpdatePromise = updateBusinessProfileAPI(businessUpdateData);
        await Promise.all([userUpdatePromise, businessUpdatePromise]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
       setSaveStatus('success');
       setTimeout(() => setSaveStatus('idle'), 3000);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      setSaveStatus('error');
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue);
    const element = document.getElementById(newValue);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveChanges = () => {
      mutation.mutate();
  }

  const isLoading = isLoadingUser || isLoadingBusiness;
  const isError = isErrorUser || isErrorBusiness;

  const navItems = [
    { id: 'personal', text: 'Personal Information', icon: <PersonIcon /> },
    { id: 'business', text: 'Business Information', icon: <BusinessCenterIcon /> },
    { id: 'security', text: 'Security', icon: <LockIcon /> },
  ];

  if (isError) {
      return <Alert severity="error">Failed to load profile data.</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, lg: 4 }, bgcolor: 'grey.100' }}>
      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>

        {/* --- Desktop Sidebar --- */}
        <Grid >
          <Paper elevation={0} sx={{ p: 1, borderRadius: 2, position: 'sticky', top: '24px' }}>
            <List component="nav">
              {navItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: activeSection === item.id ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* --- Main Content --- */}
        <Grid >
           <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="900">
                    My Profile
                </Typography>
           </Box>

            {/* --- Mobile Tabs --- */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeSection} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="profile sections tabs">
                    {navItems.map((item) => (
                        <Tab key={item.id} label={item.text} value={item.id} sx={{textTransform: 'none'}}/>
                    ))}
                </Tabs>
            </Box>

            {/* Sections */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* --- Personal Information --- */}
              <Paper id="personal" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLoading ? (
                            <Skeleton variant="circular" width={96} height={96} />
                        ) : (
                            <Avatar src={avatarUrl} sx={{ width: 96, height: 96 }}>RS</Avatar>
                        )}
                        <Box>
                            <Typography variant="h5" component="div" fontWeight="bold">
                                {isLoading ? <Skeleton width={150} /> : fullName}
                            </Typography>
                            <Typography color="text.secondary">
                                {isLoading ? <Skeleton width={200} /> : email}
                            </Typography>
                        </Box>
                     </Box>
                     <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                        Upload Picture
                        <input type="file" hidden accept="image/*" /* onChange={handleAvatarUpload} */ />
                     </Button>
                 </Box>
                 <Grid container spacing={2}>
                    <Grid >
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid >
                         <TextField
                            label="Email Address"
                            fullWidth
                            value={email}
                            disabled
                            InputProps={{ readOnly: true }}
                            sx={{ bgcolor: 'action.disabledBackground' }}
                        />
                    </Grid>
                     <Grid >
                         <TextField
                            label="Phone Number"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading}
                        />
                    </Grid>
                 </Grid>
              </Paper>

               {/* --- Business Information --- */}
              <Paper id="business" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Business Information</Typography>
                 <Grid container spacing={2}>
                    <Grid >
                        <TextField
                            label="Business Name"
                            fullWidth
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            disabled={isLoading}
                        />
                    </Grid>
                     <Grid >
                        <TextField
                            label="Business Address"
                            fullWidth
                            multiline
                            rows={3}
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            disabled={isLoading}
                        />
                    </Grid>
                     <Grid >
                         <TextField
                            label="GSTIN"
                            fullWidth
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="The Goods and Services Tax Identification Number (GSTIN) is a 15-digit PAN-based unique identification number.">
                                            <IconButton edge="end" size="small">
                                                <InfoIcon fontSize="small" color="action"/>
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                 </Grid>
              </Paper>

               {/* --- Security --- */}
               <Paper id="security" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                   <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Security</Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography fontWeight="medium">Password</Typography>
                                <Typography variant="body2" color="text.secondary">Last changed on 12 Jan 2024</Typography>
                            </Box>
                           <Button variant="text" size="small">Change Password</Button>
                       </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography fontWeight="medium">Notifications</Typography>
                                <Typography variant="body2" color="text.secondary">Enable email notifications for invoices.</Typography>
                            </Box>
                           <Switch
                                checked={notificationsOn}
                                onChange={(e) => setNotificationsOn(e.target.checked)}
                                disabled={isLoading}
                                inputProps={{ 'aria-label': 'Enable email notifications' }}
                            />
                       </Box>
                   </Box>
               </Paper>

                {/* --- Action Buttons & Status --- */}
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
                  {saveStatus === 'success' && <Alert severity="success" sx={{ py: 0.5, mr: 'auto' }}>Changes saved!</Alert>}
                  {saveStatus === 'error' && <Alert severity="error" sx={{ py: 0.5, mr: 'auto' }}>Failed to save changes.</Alert>}
                  <Button variant="outlined" disabled={mutation.isPending}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveChanges}
                    disabled={mutation.isPending || isLoading}
                  >
                     {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                  </Button>
               </Box>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
}