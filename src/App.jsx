// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1) Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* 2) Qualquer outra rota fica SOB o guard */}
        <Route element={<ProtectedRoute />}>
          {/* AppLayout monta o Sidebar e o Outlet */}
          <Route element={<AppLayout />}>
            {/* "/" (índice) redireciona para "/home" */}
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="vendas" element={<Vendas />} />
          </Route>
        </Route>

        {/* 3) Qualquer rota desconhecida leva ao login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
