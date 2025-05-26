// src/services/authService.js

const API_URL = 'http://177.53.148.179:8080/api/auth/login';

/**
 * Faz login na API e retorna o JSON com token e demais informações.
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<any>}
 */
async function login(credentials) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    // tenta extrair mensagem de erro do corpo
    let errMsg = 'Usuário ou Senha Incorreto!!!';
    try {
      const errBody = await response.json();
      errMsg = errBody.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return response.json();
}

export default { login };
