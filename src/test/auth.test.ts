import axios from 'axios';

const API_URL = 'http://localhost:8000';
const ALUGUEL_SOCIAL_URL = 'http://localhost:3000';

async function testAuthIntegration() {
  try {
    // 1. Teste de login no controle-users-dev
    console.log('1. Testando login no controle-users-dev...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      login: 'seu_email@exemplo.com',
      password: 'sua_senha'
    });
    console.log('Login bem sucedido:', loginResponse.data);

    const token = loginResponse.data.access_token;

    // 2. Teste de validação de token
    console.log('\n2. Testando validação de token...');
    const validateResponse = await axios.post(`${API_URL}/auth/validate`, { token });
    console.log('Token válido:', validateResponse.data);

    // 3. Teste de verificação de token
    console.log('\n3. Testando verificação de token...');
    const checkResponse = await axios.post(`${API_URL}/auth/check`, { token });
    console.log('Informações do token:', checkResponse.data);

    // 4. Teste de rota protegida no aluguel-social
    console.log('\n4. Testando rota protegida no aluguel-social...');
    const protectedResponse = await axios.get(`${ALUGUEL_SOCIAL_URL}/api/protected-route`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Rota protegida acessada com sucesso:', protectedResponse.data);

  } catch (error) {
    console.error('Erro no teste:', error.response?.data || error.message);
  }
}

testAuthIntegration(); 