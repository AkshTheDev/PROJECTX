// client/src/components/app/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

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
import Grid from '@mui/material/GridLegacy';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icon Imports
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Define types for profile data
interface UserProfile {
  id?: string;
  fullName: string;
  email: string; // Usually read-only
  phone: string;
  avatarUrl?: string; // URL for the avatar image
  notificationsOn: boolean;
}

interface BusinessProfile {
  id?: string;
  name: string;
  address: string;
  gstin: string;
  logoUrl?: string; // Add logoUrl field
}

// API functions - Using real API calls
const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await api.get('/profile');
  return {
    id: data.user._id,
    fullName: data.user.fullName || '',
    email: data.user.email || '',
    phone: data.user.phone || '',
    avatarUrl: data.user.avatarUrl || '',
    notificationsOn: data.user.notificationsOn ?? true,
  };
};

const fetchBusinessProfile = async (): Promise<BusinessProfile> => {
  const { data } = await api.get('/profile');
  return {
    id: data.business._id,
    name: data.business.name || '',
    address: data.business.address || '',
    gstin: data.business.gstin || '',
    logoUrl: data.business.logoUrl || '',
  };
};

// Define Update Functions
const updateUserProfileAPI = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    // Assuming API updates based on currently logged-in user
    const { data } = await api.put('/profile/user', profileData); // Send only updated fields
    return data;
}
const updateBusinessProfileAPI = async (profileData: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    // Assuming API updates based on currently logged-in user
    const { data } = await api.put('/profile/business', profileData); // Send only updated fields
    return data;
}

export function ProfileScreen() {
  const [activeSection, setActiveSection] = useState('personal');
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  // State for change password dialog
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // State for form fields - Initialized empty
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(false); // Default to false until fetched
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessLogoUrl, setBusinessLogoUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // State for avatar upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Fetch User Profile Data
  const { data: userProfile, isLoading: isLoadingUser, isError: isErrorUser } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch Business Profile Data
  const { data: businessProfile, isLoading: isLoadingBusiness, isError: isErrorBusiness } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: fetchBusinessProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
  }, [userProfile]); // Re-run if userProfile data changes

  useEffect(() => {
    if (businessProfile) {
      setBusinessName(businessProfile.name || '');
      setBusinessAddress(businessProfile.address || '');
      setGstin(businessProfile.gstin || '');
      setBusinessLogoUrl(businessProfile.logoUrl || '');
    }
  }, [businessProfile]); // Re-run if businessProfile data changes

  // Mutation for saving changes
  const mutation = useMutation({
    mutationFn: async () => {
        setSaveStatus('idle');
        const userUpdateData: Partial<UserProfile> = { fullName, phone, notificationsOn, avatarUrl };
        const businessUpdateData: Partial<BusinessProfile> = { name: businessName, address: businessAddress, gstin, logoUrl: businessLogoUrl };
        // Use Promise.allSettled to handle potential individual failures if needed
        await Promise.all([
            updateUserProfileAPI(userUpdateData),
            updateBusinessProfileAPI(businessUpdateData)
        ]);
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data after save
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3 seconds
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      setSaveStatus('error');
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue);
    const element = document.getElementById(newValue);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveChanges = () => {
      mutation.mutate(); // Trigger the mutation function
  }

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      setPasswordError('');
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      await api.put('/profile/change-password', {
        currentPassword,
        newPassword,
      });
    },
    onSuccess: () => {
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setOpenPasswordDialog(false);
        setPasswordSuccess(false);
      }, 2000);
    },
    onError: (error: any) => {
      setPasswordError(error.response?.data?.message || error.message || 'Failed to change password');
    },
  });

  const handleChangePassword = () => {
    changePasswordMutation.mutate();
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess(false);
  };

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Auto-upload the file
      handleAvatarUpload(file);
    }
  };

  // Handle avatar upload to server
  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/profile/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update avatar URL with the uploaded image URL
      setAvatarUrl(response.data.avatarUrl);
      
      // Invalidate query to refetch profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      // Refresh AuthContext user to update header avatars
      await refreshUser();
      
      alert('Profile photo updated successfully!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload avatar');
      // Reset preview on error
      setPreviewUrl('');
      setSelectedFile(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Combined loading/error states
  const isLoading = isLoadingUser || isLoadingBusiness;
  const isError = isErrorUser || isErrorBusiness;

  // Sidebar navigation items configuration
  const navItems = [
    { id: 'personal', text: 'Personal Information', icon: <PersonIcon /> },
    { id: 'business', text: 'Business Information', icon: <BusinessCenterIcon /> },
    { id: 'security', text: 'Security', icon: <LockIcon /> },
  ];

  // Display error message if fetching fails
  if (isError) {
      return <Alert severity="error" sx={{ m: 3 }}>Failed to load profile data. Please try again later.</Alert>;
  }

  // --- JSX Structure ---
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3, lg: 4 }, bgcolor: 'grey.100', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container spacing={4} sx={{ maxWidth: '900px', width: '100%' }}>

        {/* --- Desktop Sidebar --- */}
        {/* <Grid item xs={12} lg={3}>
          <Paper elevation={0} sx={{ p: 1, borderRadius: 2, position: 'sticky', top: '24px' }}>
            <List component="nav">
              {navItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={activeSection === item.id}
                  onClick={() => handleSectionClick(item.id)}
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
        </Grid> */}

        {/* --- Main Content --- */}
        <Grid item xs={12}>
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

            {/* --- Sections --- */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* --- Personal Information --- */}
              <Paper id="personal" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                 <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isLoading ? (
                            <Skeleton variant="circular" width={96} height={96} />
                        ) : (
                            <Box sx={{ position: 'relative' }}>
                              <Avatar 
                                src={previewUrl || avatarUrl} 
                                sx={{ width: 96, height: 96 }}
                              >
                                {fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </Avatar>
                              {uploadingAvatar && (
                                <CircularProgress
                                  size={96}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 1,
                                  }}
                                />
                              )}
                            </Box>
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
                     <Button 
                       component="label" 
                       variant="outlined" 
                       startIcon={<CloudUploadIcon />} 
                       size="small"
                       disabled={uploadingAvatar}
                     >
                        {uploadingAvatar ? 'Uploading...' : 'Upload Picture'}
                        <input 
                          type="file" 
                          hidden 
                          accept="image/*" 
                          onChange={handleAvatarChange}
                          disabled={uploadingAvatar}
                        />
                     </Button>
                 </Box>
                 <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading || mutation.isPending} // Disable while loading or saving
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                         <TextField
                            label="Email Address"
                            fullWidth
                            value={email}
                            disabled // Email usually not editable
                            InputProps={{ readOnly: true }}
                            sx={{ bgcolor: 'action.disabledBackground' }} // Visual cue for read-only
                        />
                    </Grid>
                     <Grid item xs={12} md={6}>
                         <TextField
                            label="Phone Number"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isLoading || mutation.isPending}
                        />
                    </Grid>
                 </Grid>
              </Paper>

               {/* --- Business Information --- */}
              <Paper id="business" elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" fontWeight="bold" sx={{ mb: 2 }}>Business Information</Typography>
                 <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Business Name"
                            fullWidth
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            disabled={isLoading || mutation.isPending}
                        />
                    </Grid>
                     <Grid item xs={12}>
                        <TextField
                            label="Business Address"
                            fullWidth
                            multiline
                            rows={3}
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            disabled={isLoading || mutation.isPending}
                        />
                    </Grid>
                     <Grid item xs={12}>
                         <TextField
                            label="GSTIN"
                            fullWidth
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            disabled={isLoading || mutation.isPending}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="The Goods and Services Tax Identification Number (GSTIN) is a 15-digit PAN-based unique identification number.">
                                            <IconButton edge="end" size="small" tabIndex={-1}> {/* Prevent tabbing to icon */}
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
                                <Typography variant="body2" color="text.secondary">Change your password</Typography>
                            </Box>
                           <Button variant="text" size="small" onClick={() => setOpenPasswordDialog(true)}>Change Password</Button>
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
                                disabled={isLoading || mutation.isPending}
                                inputProps={{ 'aria-label': 'Enable email notifications' }}
                            />
                       </Box>
                   </Box>
               </Paper>

                {/* --- Action Buttons & Status --- */}
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
                  {/* Status Alerts moved to the left */}
                  {saveStatus === 'success' && <Alert severity="success" sx={{ py: 0.5, mr: 'auto' }}>Changes saved!</Alert>}
                  {saveStatus === 'error' && <Alert severity="error" sx={{ py: 0.5, mr: 'auto' }}>Failed to save changes.</Alert>}

                  <Button variant="outlined" disabled={mutation.isPending}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveChanges}
                    disabled={mutation.isPending || isLoading} // Disable button while loading or saving
                  >
                     {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                  </Button>
               </Box>
            </Box>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully!
            </Alert>
          )}
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              disabled={changePasswordMutation.isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              disabled={changePasswordMutation.isPending}
              helperText="Password must be at least 6 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              disabled={changePasswordMutation.isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} disabled={changePasswordMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
          >
            {changePasswordMutation.isPending ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}