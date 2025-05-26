// ===== src/services/productService.js =====
import axios from 'axios';

const API_BASE = 'http://177.53.148.179:8080/api';

export const fetchProducts = () =>
  axios.get(`${API_BASE}/produtos`).then(res => res.data);

export const createProduct = product =>
  axios.post(`${API_BASE}/produtos`, product).then(res => res.data);

// Função para excluir um produto
export const deleteProduct = id =>
  axios.delete(`${API_BASE}/produtos/${id}`);

export const checkHasVendas = id =>
  axios
    .get(`${API_BASE}/produtos/${id}/hasVendas`)
    .then(res => res.data);

export const updateProduct  = p => axios.put(`${API_BASE}/produtos/${p.id}`, p).then(res => res.data);    