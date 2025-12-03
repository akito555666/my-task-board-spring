import React, { useState, useEffect } from 'react';
import { TaskBoard } from './TaskBoard';
import { Login } from './components/Login';
import { Register } from './components/Register';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('boardId');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <TaskBoard onLogout={handleLogout} />;
  }

  if (isRegistering) {
    return (
      <Register
        onRegisterSuccess={() => setIsRegistering(false)}
        onLoginClick={() => setIsRegistering(false)}
      />
    );
  }

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onRegisterClick={() => setIsRegistering(true)}
    />
  );
};
