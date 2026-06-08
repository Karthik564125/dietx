import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import AuthPage from './pages/AuthPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import AboutUs from './pages/AboutUs.tsx';
import HealthOnboarding from './pages/HealthOnboarding.tsx';
import Sessions from './pages/Sessions.tsx';
import HealthDetail from './pages/HealthDetail.tsx';
import NutritionDetail from './pages/NutritionDetail.tsx';
import Profile from './pages/Profile.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PcodConsultancy from './pages/PcodConsultancy.tsx';


import { useState } from 'react';

import { Toaster } from 'react-hot-toast';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
  });

  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/about" element={<AboutUs setIsAuthenticated={setIsAuthenticated} />} />

        <Route
          path="/auth"
          element={<AuthPage setAuth={setIsAuthenticated} />}
        />
        <Route
          path="/onboarding"
          element={isAuthenticated ? <HealthOnboarding /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/sessions"
          element={isAuthenticated ? <Sessions setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/health"
          element={isAuthenticated ? <HealthDetail setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/nutrition"
          element={isAuthenticated ? <NutritionDetail setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
          <Route
            path="/pcod-consultancy"
            element={isAuthenticated ? <PcodConsultancy setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminDashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
          />
      </Routes>

    </Router>
  );
}

export default App;
