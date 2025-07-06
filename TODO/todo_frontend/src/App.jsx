import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoApp from './components/TodoApp';
import SharedTask from './components/SharedTask';
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Replace with your actual Google Client ID
  const GOOGLE_CLIENT_ID = "792939813993-sqkfg66c57aidn506fof74gshuad3ldp.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/todos" /> : <Login setUser={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to="/todos" /> : <Signup setUser={setUser} />} />
          <Route path="/todos" element={user ? <TodoApp user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/shared-task" element={<SharedTask />}/>

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;