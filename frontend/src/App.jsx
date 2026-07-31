import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminTrainers from './pages/admin/Trainers';
import AdminPlans from './pages/admin/Plans';
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import MemberAttendance from './pages/member/Attendance';
import MemberPayments from './pages/member/Payments';
import MemberWorkoutPlan from './pages/member/WorkoutPlan';
import MemberDietPlan from './pages/member/DietPlan';
import MemberProgress from './pages/member/Progress';
import TrainerLayout from './layouts/TrainerLayout';
import TrainerDashboard from './pages/trainer/Dashboard';
import TrainerMembers from './pages/trainer/Members';
import TrainerAttendance from './pages/trainer/Attendance';
import TrainerWorkoutPlans from './pages/trainer/WorkoutPlans';
import TrainerDietPlans from './pages/trainer/DietPlans';
import TrainerProfile from './pages/trainer/Profile';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#1A1A1A' } },
          error: { iconTheme: { primary: '#DC2626', secondary: '#1A1A1A' } },
        }}
      />

      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth flows */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected admin section */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="plans" element={<AdminPlans />} />
        </Route>

        {/* Protected trainer section */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRoles={['trainer']}>
              <TrainerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="members" element={<TrainerMembers />} />
          <Route path="attendance" element={<TrainerAttendance />} />
          <Route path="workout-plans" element={<TrainerWorkoutPlans />} />
          <Route path="diet-plans" element={<TrainerDietPlans />} />
          <Route path="profile" element={<TrainerProfile />} />
        </Route>
        {/* Protected member section */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <MemberLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="attendance" element={<MemberAttendance />} />
          <Route path="payments" element={<MemberPayments />} />
          <Route path="workout-plan" element={<MemberWorkoutPlan />} />
          <Route path="diet-plan" element={<MemberDietPlan />} />
          <Route path="progress" element={<MemberProgress />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
