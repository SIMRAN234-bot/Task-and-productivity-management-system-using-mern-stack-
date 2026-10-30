import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import AddTask from './pages/AddTask';
import EditTask from './pages/EditTask';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import CalendarPage from './pages/CalendarPage';
import BoardPage from './pages/BoardPage';
import { GradientWave } from './components/ui/GradientWave';

const WAVE_COLORS = ['#050505', '#ffffff', '#394150', '#f8fafc', '#111827', '#ffffff'];
const WAVE_NOISE_FREQUENCY = [0.0001, 0.0009];
const WAVE_DEFORM = { incline: 0.5, noiseAmp: 250, noiseFlow: 5 };
const WorkspaceBackground = () => (
  <div className="workspace-background" aria-hidden="true">
    <GradientWave
      colors={WAVE_COLORS}
      noiseFrequency={WAVE_NOISE_FREQUENCY}
      deform={WAVE_DEFORM}
      noiseSpeed={0.00001}
      shadowPower={8}
      darkenTop
    />
    <div className="workspace-background-shade" />
  </div>
);

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage || !isAuthenticated) {
    return <><WorkspaceBackground /><main className="app-shell">{children}</main></>;
  }

  return (
    <><WorkspaceBackground /><div className="app-container app-shell">
      <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => { if (window.innerWidth < 1024) setSidebarOpen((prev) => !prev); else setSidebarCollapsed((prev) => !prev); }} />
        <main>{children}</main>
      </div>
    </div></>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AllTasks />
            </ProtectedRoute>
          }
        />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/board" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id/edit"
          element={
            <ProtectedRoute>
              <EditTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
