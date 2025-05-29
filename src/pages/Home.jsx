import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getTotalVendasDia, getTotalVendasMes } from '../services/vendaService';

export default function Home() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalVendasDia, setTotalVendasDia] = useState(0);
  const [totalVendasMes, setTotalVendasMes] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    async function fetchTotais() {
      try {
        const [dia, mes] = await Promise.all([
          getTotalVendasDia(),
          getTotalVendasMes()
        ]);
        setTotalVendasDia(dia);
        setTotalVendasMes(mes);
      } catch (error) {
        console.error('Erro ao buscar totais:', error);
      }
    }
    fetchTotais();
  }, []);

  const formatarValor = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="container mt-4">
      {/* Data e hora atual */}
      <div className="current-time mb-3" style={{ fontSize: '0.9rem', color: '#555' }}>
        {currentTime.toLocaleString('pt-BR', {
          dateStyle: 'full',
          timeStyle: 'medium'
        })}
      </div>

      {/* Exibição de usuário e perfil */}
      <h>Usuário: <strong>{username}</strong></h><br />
      {profile && <h>Perfil: <strong>{profile}</strong></h>}

      <div className="row mt-4">
        {/* Card Total do Dia */}
        <div className="col-12 col-md-6 mb-4">
          <div
            className="p-4 rounded text-center"
            style={{
              backgroundColor: '#f8f9fa',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h5>Total de Vendas do Dia</h5>
            <p className="fs-3 text-primary">{formatarValor(totalVendasDia)}</p>
          </div>
        </div>

        {/* Card Total do Mês */}
        <div className="col-12 col-md-6 mb-4">
          <div
            className="p-4 rounded text-center"
            style={{
              backgroundColor: '#f8f9fa',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h5>Total de Vendas do Mês</h5>
            <p className="fs-3 text-success">{formatarValor(totalVendasMes)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
