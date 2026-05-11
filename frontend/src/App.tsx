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
import WhoAreWe from './pages/WhoAreWe.tsx';

import { useEffect, useState } from 'react';

import { Toaster } from 'react-hot-toast';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/who-are-we" element={<WhoAreWe setIsAuthenticated={setIsAuthenticated} />} />
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
          path="/admin"
          element={isAuthenticated ? <AdminDashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/auth" />}
        />
      </Routes>

    </Router>
  );
}

export default App;
