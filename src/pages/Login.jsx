// src/pages/Login.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import authService from '../services/authService';
import './Login.css';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({
        username: login,
        password: senha
      });
      // Armazena token e outras informações no localStorage
      localStorage.setItem('token', data.token);
      // se vierem outras infos, ex: usuário completo
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <Card.Body>
          <div className="text-center mb-4">
            <Image src={Logo} width={250} height={72} alt="Logo" rounded />
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formLogin">
              <Form.Label>Login</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite seu login"
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSenha">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    /> Carregando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </div>

            <div className="mt-3 text-center">
              <a href="#!">Esqueceu a senha?</a>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="developer-credit">
        Desenvolvido por Ricardo Ribeiro Gonçalves
      </div>
    </div>
  );
}
