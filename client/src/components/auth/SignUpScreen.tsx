// client/src/components/auth/SignUpScreen.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api'; // Keep your api client

// MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

// Icon Imports
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhoneIcon from '@mui/icons-material/Phone';

// Define styles using MUI's sx prop or objects for better organization
const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
  },
  formSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: { xs: 2, lg: 8 }, // Use theme spacing
    backgroundColor: 'background.paper', // MUI theme background
  },
  illustrationSide: {
    flex: 1,
    display: { xs: 'none', lg: 'flex' }, // Hide on small screens
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'primary.lightest', // Example custom color (needs theme setup) or adjust
    textAlign: 'center',
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    textDecoration: 'none',
    color: 'text.primary',
    marginBottom: 4,
  },
  formContainer: {
    width: '100%',
    maxWidth: '450px', // Max width for the form
  },
  tabs: {
    borderBottom: 1,
    borderColor: 'divider',
    marginBottom: 3,
  },
  tab: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  inputLabel: {
    fontWeight: 500,
    marginBottom: 1,
  },
  termsText: {
    fontSize: '0.875rem',
    color: 'text.secondary',
    marginTop: 2,
    marginBottom: 2,
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    margin: '16px 0',
  },
  badgeImage: {
    height: '40px',
  },
  illustrationImageContainer: {
     maxWidth: '320px', // max-w-xs equivalent
     margin: '0 auto 32px auto', // mx-auto mb-8
  },
   illustrationImage: {
    width: '100%',
    height: 'auto', // Adjust based on actual image aspect ratio if needed
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
};

export function SignUpScreen() {
  const [tabValue, setTabValue] = useState('signup');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newAccount: any) => {
      return api.post('/auth/register', newAccount);
    },
    onSuccess: () => {
      navigate('/login'); // Redirect to login on success
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Registration failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, companyName, password });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === 'login') {
      navigate('/login'); // Navigate if Login tab is clicked
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Grid container sx={styles.root}>
      {/* Form Side */}
      <Grid item xs={12} lg={6} sx={styles.formSide}>
        <Box sx={styles.formContainer}>
          {/* Logo */}
          <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
            <Link href="#" sx={styles.logoLink}>
              <ReceiptLongIcon sx={{ fontSize: '32px', color: 'primary.main' }} />
              <Typography variant="h5" component="span" fontWeight="bold">
                Biz-Invoice
              </Typography>
            </Link>
          </Box>

          <Box sx={{ mt: 4 }}>
            {/* Titles */}
            <Typography variant="h4" component="p" fontWeight="900" gutterBottom>
              Create Your Business Account
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Join thousands of businesses streamlining their invoicing process securely.
            </Typography>

            {/* Tabs */}
            <Box sx={styles.tabs}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Login" value="login" sx={styles.tab} />
                <Tab label="Sign Up" value="signup" sx={styles.tab} />
              </Tabs>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body1" sx={styles.inputLabel}>Business Email</Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="Enter your business email address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="medium" // Adjust size as needed
                />
              </Box>
              <Box>
                 <Typography variant="body1" sx={styles.inputLabel}>Company Name</Typography>
                <TextField
                  required
                  fullWidth
                  id="companyName"
                  placeholder="Your company name"
                  name="companyName"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  size="medium"
                />
              </Box>
              <Box>
                 <Typography variant="body1" sx={styles.inputLabel}>Password</Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="Create your password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="medium"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Typography sx={styles.termsText}>
                By signing up, you agree to our{' '}
                <Link href="#" underline="hover">Terms of Service</Link> and confirm
                that you have read our{' '}
                <Link href="#" underline="hover">Privacy Policy</Link>.
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={mutation.isPending}
                sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }} // py for padding-y
              >
                {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box sx={styles.dividerContainer}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary">or</Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                startIcon={<PhoneIcon />}
                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 500 }}
              >
                Sign Up with Google
              </Button>

              {/* Security Badges */}
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Illustration Side */}
      <Grid item xs={12} lg={6} sx={styles.illustrationSide}>
         <Box sx={{ maxWidth: '450px' }}>
             <Box sx={styles.illustrationImageContainer}>
                 <Box
                     component="img"
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp4AAA5KVlYeRUWU9KudBlXo91gftaDf0pdQ&s" // Use actual image URL
                     alt="Illustration of secure data management"
                     sx={styles.illustrationImage}
                 />
            </Box>
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            Secure & Compliant Business Invoicing
          </Typography>
          <Typography color="text.secondary">
            Our platform ensures enterprise-grade security and full compliance with industry regulations, safeguarding your financial data.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}