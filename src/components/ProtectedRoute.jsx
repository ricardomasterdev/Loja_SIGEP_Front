// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ requiredRole = 'ROLE_ADMIN' }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { roles } = jwtDecode(token);
    if (!Array.isArray(roles) || !roles.includes(requiredRole)) {
      // sem permissão → login
      return <Navigate to="/login" replace />;
    }
  } catch {
    // token inválido ou expirado
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // tudo OK → renderiza Outlet (AppLayout e, depois, Home/Produtos/Vendas)
  return <Outlet />;
}
