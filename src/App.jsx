import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from "./components/chat";
import Login from "./components/signin";
import Signup from "./components/signup";
import { CssBaseline, Container, Paper } from '@mui/material';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <div style={{ height: "100vh", width: "100vw", backgroundColor: 'whitesmoke' }}>
        <Container maxWidth="md">
          <Paper elevation={3} style={{ padding: '1rem', marginTop: '2rem' }}>
            <Routes>
              {/* <Route path="/" element={<div>Landing Page (to be designed)</div>} /> */}
              <Route path="/chat" element={<Chat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Paper>
        </Container>
      </div>
    </Router>
  );
};

export default App;