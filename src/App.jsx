// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
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

        {/* 1) rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* 2) todas as demais ficam SOB o ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          {/* aqui montamos o layout (Sidebar + Outlet) */}
          <Route element={<AppLayout />}>
            {/* redireciona "/" para "/home" */}
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="vendas" element={<Vendas />} />
          </Route>
        </Route>

        {/* 3) qualquer outro caminho vai para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}
