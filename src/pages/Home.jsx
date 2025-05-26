// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualiza data e hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Decodifica token para obter usuário e perfil
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { sub, roles } = jwtDecode(token);
      setUsername(sub);
      const rawRole = Array.isArray(roles) && roles.length > 0 ? roles[0] : '';
      setProfile(
        rawRole === 'ROLE_ADMIN' ? 'Administrador' :
        rawRole === 'ROLE_USER'  ? 'Usuário Padrão' :
        rawRole
      );
    } catch (err) {
      console.error('Erro ao decodificar token:', err);
    }
  }, []);

  return (
    <div>
      {/* Data e hora atual */}
      <div className="current-time mb-3" style={{ fontSize: '0.9rem', color: '#555' }}>
        {currentTime.toLocaleString('pt-BR', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })}
      </div>

      {/* Exibição de usuário e perfil */}
      <h4>
        Usuário: <strong>{username}</strong>
      </h4>
      {profile && (
        <h5>
          Perfil: {profile}
        </h5>
      )}
    </div>
  );
}
