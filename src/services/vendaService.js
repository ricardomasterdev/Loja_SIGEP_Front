import axios from 'axios';

const BASE_URL = 'http://177.53.148.179:8080/api/vendas';

export async function getTotalVendasDia() {
  try {
    const response = await axios.get(`${BASE_URL}/total-dia`);
    return response.data.total || 0;
  } catch (error) {
    console.error('Erro ao buscar total de vendas do dia:', error);
    return 0;
  }
}

export async function getTotalVendasMes() {
  try {
    const response = await axios.get(`${BASE_URL}/total-mes`);
    return response.data.total || 0;
  } catch (error) {
    console.error('Erro ao buscar total de vendas do mês:', error);
    return 0;
  }
}
