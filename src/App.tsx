import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import './gsap-init'; // Ensure GSAP is initialized first
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { currentConfig } from './config';
import { getToken } from './api';

// ===== CONFIGURATION =====
// Configuration is now managed in src/config.ts
// To switch environments, change ENVIRONMENT in config.ts
const { showLoginPage } = currentConfig;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  // Check authentication status on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (showLoginPage) {
          // Local development mode - check for existing token
          setLoadingMessage('Checking authentication...');
          const token = localStorage.getItem('token');
          if (token) {
            setIsAuthenticated(true);
          }
        } else {
          // Production mode - automatically get token from VMS system
          setLoadingMessage('Initializing dashboard...');
          console.log('Production mode: Fetching token from VMS...');
          
          try {
            const tokenData = await getToken();
            console.log('getToken response:', tokenData); // Debug log
            
            if (tokenData && tokenData.token) {
              setLoadingMessage('Setting up dashboard...');
              localStorage.setItem('token', tokenData.token);
              console.log('Token received and stored successfully:', tokenData.token);
              setIsAuthenticated(true);
            } else {
              console.error('getToken returned invalid data:', tokenData);
              // Try to get token from localStorage as fallback
              const existingToken = localStorage.getItem('token');
              if (existingToken) {
                console.log('Using existing token from localStorage');
                setIsAuthenticated(true);
              } else {
                console.error('No token available - API calls will fail');
                setIsAuthenticated(true); // Still show dashboard but warn user
              }
            }
          } catch (tokenError) {
            console.error('getToken API call failed:', tokenError);
            // Try to get token from localStorage as fallback
            const existingToken = localStorage.getItem('token');
            if (existingToken) {
              console.log('Using existing token from localStorage after API failure');
              setIsAuthenticated(true);
            } else {
              console.error('No token available - API calls will fail');
              setIsAuthenticated(true); // Still show dashboard but warn user
            }
          }
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        if (!showLoginPage) {
          // In production, show dashboard even if token fetch fails
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [showLoginPage]);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {loadingMessage}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {showLoginPage ? 'Please wait while we check your credentials...' : 'Please wait while we prepare your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Login Route - Only show in local development */}
        {showLoginPage && (
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
        )}
        
        {/* Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard /> : 
              (showLoginPage ? <Navigate to="/login" replace /> : <Dashboard />)
          } 
        />
        
        {/* Default Route - Redirect to login or dashboard */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              (showLoginPage ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />)
          } 
        />
        
        {/* Catch all other routes */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              (showLoginPage ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />)
          } 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;