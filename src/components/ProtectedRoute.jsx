// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ requiredRole = 'ROLE_ADMIN' }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  let payload;
  try {
    payload = jwtDecode(token);
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(payload.roles) ? payload.roles : [];
  if (!roles.includes(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
