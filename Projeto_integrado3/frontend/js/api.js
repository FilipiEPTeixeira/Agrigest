const API_BASE = 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('agrigest_token');
}
function setToken(token) {
  localStorage.setItem('agrigest_token', token);
}
function clearToken() {
  localStorage.removeItem('agrigest_token');
  localStorage.removeItem('agrigest_usuario');
}
function getUsuarioLogado() {
  const raw = localStorage.getItem('agrigest_usuario');
  return raw ? JSON.parse(raw) : null;
}
function setUsuarioLogado(usuario) {
  localStorage.setItem('agrigest_usuario', JSON.stringify(usuario));
}

/**
 * Wrapper genérico de chamadas à API.
 * Lança um Error com `.erro` (mensagem amigável) em caso de falha.
 */
async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const erro = new Error('Não foi possível conectar à API. O servidor backend está rodando em http://localhost:3001?');
    throw erro;
  }

  if (response.status === 401) {
    clearToken();
    showPage('login');
    const erro = new Error('Sessão expirada. Faça login novamente.');
    throw erro;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const erro = new Error(data.erro || 'Ocorreu um erro inesperado.');
    throw erro;
  }

  return data;
}

const api = {
  login: (email, senha) => apiRequest('/auth/login', { method: 'POST', body: { email, senha } }),

  dashboard: () => apiRequest('/dashboard'),

  agricultores: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/agricultores${qs ? `?${qs}` : ''}`);
    },
    options: () => apiRequest('/agricultores/options'),
    get: (id) => apiRequest(`/agricultores/${id}`),
    create: (dados) => apiRequest('/agricultores', { method: 'POST', body: dados }),
    update: (id, dados) => apiRequest(`/agricultores/${id}`, { method: 'PUT', body: dados }),
    toggleStatus: (id) => apiRequest(`/agricultores/${id}/status`, { method: 'PATCH' }),
  },

  produtos: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/produtos${qs ? `?${qs}` : ''}`);
    },
    options: () => apiRequest('/produtos/options'),
    get: (id) => apiRequest(`/produtos/${id}`),
    create: (dados) => apiRequest('/produtos', { method: 'POST', body: dados }),
    update: (id, dados) => apiRequest(`/produtos/${id}`, { method: 'PUT', body: dados }),
    toggleStatus: (id) => apiRequest(`/produtos/${id}/status`, { method: 'PATCH' }),
  },

  vendas: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return apiRequest(`/vendas${qs ? `?${qs}` : ''}`);
    },
    get: (id) => apiRequest(`/vendas/${id}`),
    create: (dados) => apiRequest('/vendas', { method: 'POST', body: dados }),
    updateStatus: (id, status) => apiRequest(`/vendas/${id}/status`, { method: 'PATCH', body: { status } }),
  },
};
