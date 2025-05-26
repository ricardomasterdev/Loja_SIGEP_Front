// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Header() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { sub, roles } = jwtDecode(token);
      setUsername(sub);

      // Pega o primeiro role do array (se existir)
      const role = Array.isArray(roles) && roles.length > 0
        ? roles[0]
        : '';

      // Mapeia para rótulos amigáveis
      const displayRole =
        role === 'ROLE_ADMIN' ? 'Administrador' :
        role === 'ROLE_USER'  ? 'Usuário Padrão' :
        role;

      setProfile(displayRole);
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }
  }, []);

  return (
    <header className="app-header">
      <div className="header-username">
        Bem-vindo, {username}
      </div>
      {profile && (
        <div className="header-profile">
          Perfil: {profile}
        </div>
      )}
    </header>
  );
}
