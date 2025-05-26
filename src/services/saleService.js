// src/services/saleService.js
import axios from 'axios';

const API_BASE = 'http://177.53.148.179:8080/api';
const api = axios.create({ baseURL: API_BASE });

export const fetchSales = () =>
  api.get('/vendas').then(res => res.data);

// Agora espera também dataPedido no objeto sale e o envia ao backend
export const createSale = ({ cliente, valorTotal, produtos, dataPedido }) => {
  const payload = { cliente, valorTotal, produtos, dataPedido };
  // === loga o JSON no console antes de enviar ===
  console.log('🔔 createSale payload:', JSON.stringify(payload, null, 2));
  return api
    .post('/vendas', payload)
    .then(res => ({ status: res.status, location: res.headers.location }));
};

export const deleteSale = id =>
  api.delete(`/vendas/${id}`).then(res => res.data);

export const fetchSaleById = id =>
  api.get(`/vendas/${id}`).then(res => res.data);

// Também inclui dataPedido no payload de atualização
export const updateSale = ({ id, cliente, valorTotal, produtos, dataPedido }) => {
  const payload = { cliente, valorTotal, produtos, dataPedido };
  // === loga o JSON no console antes de enviar ===
  console.log(`🔔 updateSale payload for id=${id}:`, JSON.stringify(payload, null, 2));
  return api
    .put(`/vendas/${id}`, payload)
    .then(res => res.data);
};
