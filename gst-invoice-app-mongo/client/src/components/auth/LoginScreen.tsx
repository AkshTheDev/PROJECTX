// client/src/components/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

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

// Icon Imports
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// Google auth removed

// Define styles (reusing from SignUpScreen where applicable)
const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: { xs: 'column', lg: 'row' },
  },
  formSide: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: { xs: 2, lg: 8 },
    backgroundColor: 'background.paper',
  },
  illustrationSide: {
    flex: '1 1 0%',
    display: { xs: 'none', lg: 'flex' },
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'primary.lightest', // Example fallback
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
    maxWidth: '450px',
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
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    margin: '16px 0',
  },
  illustrationImageContainer: {
     maxWidth: '320px',
     margin: '0 auto 32px auto',
  },
   illustrationImage: {
    width: '100%',
    height: 'auto',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
};

export function LoginScreen() {
  const [tabValue, setTabValue] = useState('login'); // Default to login tab
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const mutation = useMutation({
    mutationFn: (credentials: any) => {
      return api.post('/auth/login', credentials);
    },
    onSuccess: (data) => {
      setToken(data.data.token);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Login failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === 'signup') {
      navigate('/signup'); // Navigate if Sign Up tab is clicked
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={styles.root}>
      {/* Form Side */}
      <Box sx={styles.formSide}>
        <Box sx={styles.formContainer}>
          {/* Logo */}
          <Box sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
            <Link href="#" sx={styles.logoLink}>
              <ReceiptLongIcon sx={{ fontSize: '32px', color: 'primary.main' }} />
              <Typography variant="h5" component="span" fontWeight="bold">
                InvoWiz
              </Typography>
            </Link>
          </Box>

          <Box sx={{ mt: 4 }}>
            {/* Titles */}
            <Typography variant="h4" component="p" fontWeight="900" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Login to your account to manage your invoices.
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
                <Typography variant="body1" sx={styles.inputLabel}>Email Address</Typography>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="Enter your email address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="medium"
                />
              </Box>
              <Box>
                 <Typography variant="body1" sx={styles.inputLabel}>Password</Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
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

              <Link
                href="#"
                variant="body2"
                underline="hover"
                sx={{ alignSelf: 'flex-start', mt: 1 }} // Align link to the left
              >
                Forgot Password?
              </Link>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={mutation.isPending}
                sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
              >
                {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>

              { /* Google auth button removed */ }
            </Box>
          </Box>
           <Box sx={{ mt: 8, textAlign: 'center' }}>
             <Typography variant="body2" color="text.secondary">
               <Link href="#" underline="hover">Terms of Service</Link> •{' '}
               <Link href="#" underline="hover">Privacy Policy</Link>
             </Typography>
           </Box>
        </Box>
      </Box>

      {/* Illustration Side */}
      <Box sx={styles.illustrationSide}>
         <Box sx={{ maxWidth: '450px' }}>
             <Box sx={styles.illustrationImageContainer}>
                 <Box
                     component="img"
                     // Use the illustration URL from the original HTML
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp4AAA5KVlYeRUWU9KudBlXo91gftaDf0pdQ&s"
                     alt="Illustration of a person analyzing financial charts"
                     sx={styles.illustrationImage}
                 />
            </Box>
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            Simplify Your GST Invoicing
          </Typography>
          <Typography color="text.secondary">
            Create, send, and track GST-compliant invoices in minutes. Join
            thousands of businesses who trust us to streamline their finances.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}