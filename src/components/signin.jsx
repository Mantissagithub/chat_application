import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Link, Avatar, Checkbox, FormControlLabel, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a default theme
const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/login', { email, password });
//       console.log(response.data.message);
//       const { token } = response.data;
//       localStorage.setItem('token', token);
//       setToken(token);
//       navigate('/chat');
//     } catch (error) {
//       console.error(error);
//     }
//   };
const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Attempting to log in with:", email, password); // Log email and password
    try {
        const response = await axios.post('http://localhost:3000/login', { email, password });
        console.log("Login response:", response.data); // Log the response
        const { token } = response.data; // Ensure this matches your server response structure
        if (token) {
            localStorage.setItem('token', token); // Store the token
            setToken(token);
            navigate('/chat');
        } else {
            console.error("Token is not present in the response.");
        }
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
    }
};

  return (
    <ThemeProvider theme={defaultTheme}>
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: 'whitesmoke' }}>
        <Grid container component="main" sx={{ height: '100vh', width: '100%' }}>
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1720032304972-1f1142e73253?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
              backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'left',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ height: '100vh' }}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%', // Ensure the box takes full height
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default Login;