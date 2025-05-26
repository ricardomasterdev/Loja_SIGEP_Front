// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Nav, Button, Image } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaShoppingCart,
  FaDollarSign,
  FaSignOutAlt
} from 'react-icons/fa';
import Logo from '../assets/images/logo.png';
import './Sidebar.css';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 576);

  const handleLogout = () => {
    // Limpar dados de sessão se necessário
    navigate('/');
  };

  return (
    <div
      className={`sidebar bg-light vh-100 ${
        collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}
    >
      <div className="d-flex align-items-center justify-content-between p-2 border-bottom">
        {!collapsed && (
          <Image src={Logo} width={195} height={58} alt="Logo" fluid />
        )}
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
        </Button>
      </div>

      <Nav className="flex-column p-2">
        <Nav.Item>
          <Nav.Link as={Link} to="/home" active={pathname === '/home'}>
            <FaHome size={18} /> {!collapsed && 'Home'}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/produtos" active={pathname === '/produtos'}>
            <FaShoppingCart size={18} /> {!collapsed && 'Produtos'}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as={Link} to="/vendas" active={pathname === '/vendas'}>
            <FaDollarSign size={18} /> {!collapsed && 'Vendas'}
          </Nav.Link>
        </Nav.Item>

        {/* Item de Sair no final */}
        <Nav.Item className="mt-auto pt-3">
          <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <FaSignOutAlt size={18} /> {!collapsed && 'Sair'}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
