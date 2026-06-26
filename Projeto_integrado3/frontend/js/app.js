/* ===================== Navegação ===================== */
const pages = {
  login: 'page-login', dashboard: 'page-dashboard', agricultores: 'page-agricultores',
  'cad-agri': 'page-cad-agri', produtos: 'page-produtos', 'cad-prod': 'page-cad-prod',
  vendas: 'page-vendas', 'reg-venda': 'page-reg-venda',
};
const topnavIds = {
  dashboard: 'tn-dash', agricultores: 'tn-agri', 'cad-agri': 'tn-cadagri',
  produtos: 'tn-prod', 'cad-prod': 'tn-cadprod', vendas: 'tn-vend', 'reg-venda': 'tn-regv',
};
const sidebarIds = {
  dashboard: 'sb-dash', agricultores: 'sb-agri', 'cad-agri': 'sb-agri',
  produtos: 'sb-prod', 'cad-prod': 'sb-prod', vendas: 'sb-vend', 'reg-venda': 'sb-vend',
};

let current = 'login';
let editingAgricultorId = null;
let editingProdutoId = null;
const searchTimers = {};

function showPage(name) {
  // páginas protegidas exigem login
  const protegidas = ['dashboard', 'agricultores', 'cad-agri', 'produtos', 'cad-prod', 'vendas', 'reg-venda'];
  if (protegidas.includes(name) && !getToken()) {
    name = 'login';
  }

  document.getElementById(pages[current]).classList.remove('active');
  document.getElementById(pages[current]).style.display = 'none';
  const tnOld = document.getElementById(topnavIds[current]);
  if (tnOld) tnOld.classList.remove('active');
  const sbOld = document.getElementById(sidebarIds[current]);
  if (sbOld) sbOld.classList.remove('active');

  const sidebar = document.getElementById('sidebar');
  const topnav = document.getElementById('topnav');
  const userArea = document.getElementById('user-area');
  if (name === 'login') {
    sidebar.style.display = 'none';
    topnav.style.display = 'none';
    userArea.style.display = 'none';
  } else {
    sidebar.style.display = 'block';
    topnav.style.display = 'flex';
    userArea.style.display = 'flex';
  }

  current = name;
  document.getElementById(pages[current]).classList.add('active');
  document.getElementById(pages[current]).style.display = 'block';
  const tnNew = document.getElementById(topnavIds[current]);
  if (tnNew) tnNew.classList.add('active');
  const sbNew = document.getElementById(sidebarIds[current]);
  if (sbNew) sbNew.classList.add('active');

  carregarConteudoDaPagina(name);
}

function carregarConteudoDaPagina(name) {
  if (name === 'dashboard') carregarDashboard();
  else if (name === 'agricultores') carregarAgricultores();
  else if (name === 'produtos') carregarProdutos();
  else if (name === 'vendas') carregarVendas();
  else if (name === 'cad-prod') popularSelectAgricultores();
  else if (name === 'reg-venda') popularSelectProdutos();
}

/* ===================== Utilitários ===================== */
function formatBRL(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}
function formatDataHora(isoStr) {
  if (!isoStr) return '—';
  const [data, hora] = isoStr.split(' ');
  const [ano, mes, dia] = data.split('-');
  const horaCurta = hora ? hora.slice(0, 5) : '';
  return `${dia}/${mes} ${horaCurta}`;
}
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function debouncedSearch(chave, fn, delay = 300) {
  clearTimeout(searchTimers[chave]);
  searchTimers[chave] = setTimeout(fn, delay);
}
function mostrarToast(mensagem, tipo = 'ok') {
  const toast = document.getElementById('toast');
  toast.textContent = mensagem;
  toast.className = 'toast show' + (tipo === 'erro' ? ' error' : '');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
function alternarToggle(id) {
  const el = document.getElementById(id);
  const ativo = el.dataset.ativo === 'true';
  el.dataset.ativo = (!ativo).toString();
  el.classList.toggle('off', ativo);
}

/* ===================== Autenticação ===================== */
async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const erroEl = document.getElementById('login-erro');
  const btn = document.getElementById('login-btn');

  erroEl.style.display = 'none';
  if (!email || !senha) {
    erroEl.textContent = 'Informe email e senha.';
    erroEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Entrando...';
  try {
    const resp = await api.login(email, senha);
    setToken(resp.token);
    setUsuarioLogado(resp.usuario);
    atualizarAreaUsuario();
    showPage('dashboard');
  } catch (err) {
    erroEl.textContent = err.message;
    erroEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar no sistema';
  }
}

function fazerLogout() {
  clearToken();
  atualizarAreaUsuario();
  showPage('login');
}

function atualizarAreaUsuario() {
  const usuario = getUsuarioLogado();
  const nomeEl = document.getElementById('user-nome');
  if (usuario) nomeEl.textContent = `${usuario.nome} (${usuario.papel})`;
}

/* ===================== Dashboard ===================== */
async function carregarDashboard() {
  try {
    const d = await api.dashboard();
    document.getElementById('kpi-agricultores').textContent = d.agricultoresAtivos;
    document.getElementById('kpi-agricultores-sub').innerHTML =
      `<i class="ti ti-trending-up" style="font-size:11px"></i> ${d.novosEsteMes} novos este mês`;

    document.getElementById('kpi-produtos').textContent = d.produtosAtivos;
    document.getElementById('kpi-produtos-sub').textContent =
      d.produtosEstoqueBaixo > 0 ? `${d.produtosEstoqueBaixo} com estoque baixo` : 'Estoque saudável';

    document.getElementById('kpi-vendas').textContent = d.vendasHoje;
    document.getElementById('kpi-vendas-sub').textContent =
      d.vendasPendentes > 0 ? `${d.vendasPendentes} pendentes` : 'Nenhuma pendência';

    document.getElementById('kpi-faturamento').textContent = formatBRL(d.faturamentoMes);
    document.getElementById('kpi-faturamento-sub').innerHTML = `<i class="ti ti-calendar" style="font-size:11px"></i> mês atual`;

    const alertEl = document.getElementById('dashboard-alert');
    if (d.produtosEstoqueBaixo > 0) {
      document.getElementById('dashboard-alert-texto').textContent =
        `Atenção: ${d.produtosEstoqueBaixo} produto(s) com estoque abaixo do mínimo. Reposição necessária.`;
      alertEl.style.display = 'flex';
    } else {
      alertEl.style.display = 'none';
    }

    const tbody = document.getElementById('tbody-ultimas-vendas');
    tbody.innerHTML = d.ultimasVendas.length
      ? d.ultimasVendas.map(v => `
        <tr>
          <td>#${String(v.id).padStart(4, '0')}</td>
          <td>${escapeHtml(v.produtoNome)}</td>
          <td>${escapeHtml(v.clienteNome)}</td>
          <td>${v.quantidade}</td>
          <td>${formatBRL(v.valorFinal)}</td>
          <td>${escapeHtml(v.formaPagamento)}</td>
          <td><span class="badge ${v.status}">${rotuloStatus(v.status)}</span></td>
          <td>${formatDataHora(v.createdAt)}</td>
        </tr>`).join('')
      : `<tr><td colspan="8" class="empty-state">Nenhuma venda registrada ainda.</td></tr>`;

    document.getElementById('dashboard-count').textContent =
      `Mostrando ${d.ultimasVendas.length} de ${d.totalVendas} registros`;
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}
function rotuloStatus(status) {
  return { concluida: 'Concluída', pendente: 'Pendente', cancelada: 'Cancelada', ativo: 'Ativo', inativo: 'Inativo' }[status] || status;
}

/* ===================== Agricultores ===================== */
async function carregarAgricultores() {
  const busca = document.getElementById('busca-agricultores').value.trim();
  try {
    const resp = await api.agricultores.list(busca ? { busca } : {});
    const tbody = document.getElementById('tbody-agricultores');
    tbody.innerHTML = resp.dados.length
      ? resp.dados.map(a => `
        <tr>
          <td>${String(a.id).padStart(2, '0')}</td>
          <td>${escapeHtml(a.nome)}</td>
          <td>${escapeHtml(a.cpf)}</td>
          <td>${escapeHtml(a.cidade || '—')} ${escapeHtml(a.estado || '')}</td>
          <td>${escapeHtml(a.telefone)}</td>
          <td>${formatBRL(a.totalVendas)}</td>
          <td><span class="badge ${a.ativo ? 'ativo' : 'inativo'}">${a.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td><div class="action-btns">
            <button class="btn-sm" onclick="verAgricultor(${a.id})">Ver</button>
            <button class="btn-sm" onclick="editarAgricultor(${a.id})">Editar</button>
            <button class="btn-sm ${a.ativo ? 'danger' : 'success'}" onclick="alternarStatusAgricultor(${a.id})">${a.ativo ? 'Desativar' : 'Reativar'}</button>
          </div></td>
        </tr>`).join('')
      : `<tr><td colspan="8" class="empty-state">Nenhum agricultor encontrado.</td></tr>`;
    document.getElementById('agricultores-count').textContent = `Mostrando ${resp.total} de ${resp.total} registros`;
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

function novoAgricultor() {
  editingAgricultorId = null;
  ['agri-nome', 'agri-cpf', 'agri-email', 'agri-telefone', 'agri-endereco', 'agri-cidade', 'agri-cep'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('agri-estado').value = 'CE';
  const toggle = document.getElementById('agri-ativo-toggle');
  toggle.dataset.ativo = 'true';
  toggle.classList.remove('off');
  document.getElementById('cad-agri-titulo').textContent = 'Cadastrar Agricultor';
  document.getElementById('agri-save-btn').innerHTML = '<i class="ti ti-check"></i> Salvar agricultor';
  showPage('cad-agri');
}

async function editarAgricultor(id) {
  try {
    const a = await api.agricultores.get(id);
    editingAgricultorId = id;
    document.getElementById('agri-nome').value = a.nome || '';
    document.getElementById('agri-cpf').value = a.cpf || '';
    document.getElementById('agri-email').value = a.email || '';
    document.getElementById('agri-telefone').value = a.telefone || '';
    document.getElementById('agri-endereco').value = a.endereco || '';
    document.getElementById('agri-cidade').value = a.cidade || '';
    document.getElementById('agri-estado').value = a.estado || '';
    document.getElementById('agri-cep').value = a.cep || '';
    const toggle = document.getElementById('agri-ativo-toggle');
    toggle.dataset.ativo = a.ativo.toString();
    toggle.classList.toggle('off', !a.ativo);
    document.getElementById('cad-agri-titulo').textContent = 'Editar Agricultor';
    document.getElementById('agri-save-btn').innerHTML = '<i class="ti ti-check"></i> Atualizar agricultor';
    showPage('cad-agri');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function verAgricultor(id) {
  try {
    const a = await api.agricultores.get(id);
    alert(
      `Agricultor #${a.id}\n\nNome: ${a.nome}\nCPF: ${a.cpf}\nEmail: ${a.email || '—'}\nTelefone: ${a.telefone}\n` +
      `Endereço: ${a.endereco || '—'}\nCidade/UF: ${a.cidade || '—'}/${a.estado || '—'}\nCEP: ${a.cep || '—'}\n` +
      `Status: ${a.ativo ? 'Ativo' : 'Inativo'}\nTotal em vendas: ${formatBRL(a.totalVendas)}\nCadastrado em: ${formatDataHora(a.createdAt)}`
    );
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function alternarStatusAgricultor(id) {
  if (!confirm('Deseja realmente alterar o status deste agricultor?')) return;
  try {
    const a = await api.agricultores.toggleStatus(id);
    mostrarToast(`Agricultor ${a.ativo ? 'reativado' : 'desativado'} com sucesso.`);
    carregarAgricultores();
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function salvarAgricultor() {
  const dados = {
    nome: document.getElementById('agri-nome').value.trim(),
    cpf: document.getElementById('agri-cpf').value.trim(),
    email: document.getElementById('agri-email').value.trim(),
    telefone: document.getElementById('agri-telefone').value.trim(),
    endereco: document.getElementById('agri-endereco').value.trim(),
    cidade: document.getElementById('agri-cidade').value.trim(),
    estado: document.getElementById('agri-estado').value,
    cep: document.getElementById('agri-cep').value.trim(),
    ativo: document.getElementById('agri-ativo-toggle').dataset.ativo === 'true',
  };

  if (!dados.nome || !dados.cpf || !dados.telefone) {
    mostrarToast('Nome, CPF e telefone são obrigatórios.', 'erro');
    return;
  }

  const btn = document.getElementById('agri-save-btn');
  btn.disabled = true;
  try {
    if (editingAgricultorId) {
      await api.agricultores.update(editingAgricultorId, dados);
      mostrarToast('Agricultor atualizado com sucesso.');
    } else {
      await api.agricultores.create(dados);
      mostrarToast('Agricultor cadastrado com sucesso.');
    }
    showPage('agricultores');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  } finally {
    btn.disabled = false;
  }
}

async function popularSelectAgricultores() {
  try {
    const lista = await api.agricultores.options();
    const select = document.getElementById('prod-agricultor');
    const valorAtual = select.value;
    select.innerHTML = '<option value="">Selecione o agricultor...</option>' +
      lista.map(a => `<option value="${a.id}">${escapeHtml(a.nome)}</option>`).join('');
    if (valorAtual) select.value = valorAtual;
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

/* ===================== Produtos ===================== */
function statusEstoqueClasse(stockStatus) {
  return { ok: 'stock-ok', low: 'stock-low', out: 'stock-out' }[stockStatus] || 'stock-ok';
}

async function carregarProdutos() {
  const busca = document.getElementById('busca-produtos').value.trim();
  try {
    const resp = await api.produtos.list(busca ? { busca } : {});
    const tbody = document.getElementById('tbody-produtos');
    tbody.innerHTML = resp.dados.length
      ? resp.dados.map(p => `
        <tr>
          <td>${String(p.id).padStart(2, '0')}</td>
          <td>${escapeHtml(p.nome)}</td>
          <td>${escapeHtml(p.agricultorNome)}</td>
          <td>${escapeHtml(p.categoria)}</td>
          <td>${formatBRL(p.precoUnitario)}</td>
          <td>${escapeHtml(p.tipoVenda)}</td>
          <td><span class="stock-dot ${statusEstoqueClasse(p.stockStatus)}"></span>${p.estoque} ${escapeHtml(p.tipoVenda)}${p.stockStatus === 'low' ? ' ⚠' : ''}${p.stockStatus === 'out' ? ' ⛔' : ''}</td>
          <td><span class="badge ${p.ativo ? 'ativo' : 'inativo'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></td>
          <td><div class="action-btns">
            <button class="btn-sm" onclick="verProduto(${p.id})">Ver</button>
            <button class="btn-sm" onclick="editarProduto(${p.id})">Editar</button>
          </div></td>
        </tr>`).join('')
      : `<tr><td colspan="9" class="empty-state">Nenhum produto encontrado.</td></tr>`;

    const baixoEstoque = resp.dados.filter(p => p.ativo && p.stockStatus !== 'ok').length;
    const alertEl = document.getElementById('produtos-alert');
    if (baixoEstoque > 0) {
      document.getElementById('produtos-alert-texto').textContent =
        `${baixoEstoque} produto(s) com estoque abaixo do mínimo. Reposição necessária.`;
      alertEl.style.display = 'flex';
    } else {
      alertEl.style.display = 'none';
    }
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

function novoProduto() {
  editingProdutoId = null;
  ['prod-nome', 'prod-descricao'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('prod-agricultor').value = '';
  document.getElementById('prod-categoria').value = '';
  document.getElementById('prod-tipo').value = '';
  document.getElementById('prod-preco').value = '0';
  document.getElementById('prod-estoque').value = '0';
  document.getElementById('prod-estoque-min').value = '10';
  const toggle = document.getElementById('prod-ativo-toggle');
  toggle.dataset.ativo = 'true';
  toggle.classList.remove('off');
  document.getElementById('cad-prod-titulo').textContent = 'Cadastrar Produto';
  document.getElementById('prod-save-btn').innerHTML = '<i class="ti ti-check"></i> Salvar produto';
  showPage('cad-prod');
}

async function editarProduto(id) {
  try {
    const p = await api.produtos.get(id);
    await popularSelectAgricultores();
    editingProdutoId = id;
    document.getElementById('prod-agricultor').value = p.agricultorId;
    document.getElementById('prod-nome').value = p.nome || '';
    document.getElementById('prod-categoria').value = p.categoria || '';
    document.getElementById('prod-descricao').value = p.descricao || '';
    document.getElementById('prod-tipo').value = p.tipoVenda || '';
    document.getElementById('prod-preco').value = p.precoUnitario;
    document.getElementById('prod-estoque').value = p.estoque;
    document.getElementById('prod-estoque-min').value = p.estoqueMinimo;
    const toggle = document.getElementById('prod-ativo-toggle');
    toggle.dataset.ativo = p.ativo.toString();
    toggle.classList.toggle('off', !p.ativo);
    document.getElementById('cad-prod-titulo').textContent = 'Editar Produto';
    document.getElementById('prod-save-btn').innerHTML = '<i class="ti ti-check"></i> Atualizar produto';
    showPage('cad-prod');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function verProduto(id) {
  try {
    const p = await api.produtos.get(id);
    alert(
      `Produto #${p.id}\n\nNome: ${p.nome}\nAgricultor: ${p.agricultorNome}\nCategoria: ${p.categoria}\n` +
      `Descrição: ${p.descricao || '—'}\nPreço: ${formatBRL(p.precoUnitario)} / ${p.tipoVenda}\n` +
      `Estoque atual: ${p.estoque} ${p.tipoVenda}\nEstoque mínimo: ${p.estoqueMinimo}\nStatus: ${p.ativo ? 'Ativo' : 'Inativo'}`
    );
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function salvarProduto() {
  const dados = {
    agricultorId: Number(document.getElementById('prod-agricultor').value) || null,
    nome: document.getElementById('prod-nome').value.trim(),
    categoria: document.getElementById('prod-categoria').value,
    descricao: document.getElementById('prod-descricao').value.trim(),
    tipoVenda: document.getElementById('prod-tipo').value,
    precoUnitario: Number(document.getElementById('prod-preco').value),
    estoque: Number(document.getElementById('prod-estoque').value),
    estoqueMinimo: Number(document.getElementById('prod-estoque-min').value),
    ativo: document.getElementById('prod-ativo-toggle').dataset.ativo === 'true',
  };

  if (!dados.agricultorId || !dados.nome || !dados.categoria || !dados.tipoVenda) {
    mostrarToast('Agricultor, nome, categoria e tipo de venda são obrigatórios.', 'erro');
    return;
  }

  const btn = document.getElementById('prod-save-btn');
  btn.disabled = true;
  try {
    if (editingProdutoId) {
      await api.produtos.update(editingProdutoId, dados);
      mostrarToast('Produto atualizado com sucesso.');
    } else {
      await api.produtos.create(dados);
      mostrarToast('Produto cadastrado com sucesso.');
    }
    showPage('produtos');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  } finally {
    btn.disabled = false;
  }
}

/* ===================== Vendas ===================== */
let produtosCache = [];

async function popularSelectProdutos() {
  try {
    produtosCache = await api.produtos.options();
    const select = document.getElementById('venda-produto');
    select.innerHTML = '<option value="">Selecione o produto...</option>' +
      produtosCache.map(p => `<option value="${p.id}">${escapeHtml(p.nome)} — ${formatBRL(p.precoUnitario)}/${escapeHtml(p.tipoVenda)}</option>`).join('');
    document.getElementById('venda-qtd').value = '0';
    document.getElementById('venda-desconto').value = '0';
    document.getElementById('venda-valor-unit').value = '';
    document.getElementById('venda-valor-total').value = '';
    document.getElementById('venda-valor-final').value = '';
    document.getElementById('venda-cliente-nome').value = '';
    document.getElementById('venda-cliente-cpf').value = '';
    document.getElementById('venda-cliente-tel').value = '';
    document.getElementById('venda-pagamento').value = '';
    document.getElementById('venda-status').value = 'concluida';
    document.getElementById('venda-obs').value = '';
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

function calcularVenda() {
  const produtoId = Number(document.getElementById('venda-produto').value);
  const produto = produtosCache.find(p => p.id === produtoId);
  const qtd = Number(document.getElementById('venda-qtd').value) || 0;
  const desconto = Number(document.getElementById('venda-desconto').value) || 0;

  const valorUnit = produto ? produto.precoUnitario : 0;
  const valorTotal = valorUnit * qtd;
  const valorFinal = Math.max(valorTotal - desconto, 0);

  document.getElementById('venda-valor-unit').value = produto ? formatBRL(valorUnit) : '';
  document.getElementById('venda-valor-total').value = produto ? formatBRL(valorTotal) : '';
  document.getElementById('venda-valor-final').value = produto ? formatBRL(valorFinal) : '';
}

async function cadastrarVenda() {
  const dados = {
    produtoId: Number(document.getElementById('venda-produto').value) || null,
    quantidade: Number(document.getElementById('venda-qtd').value),
    desconto: Number(document.getElementById('venda-desconto').value) || 0,
    clienteNome: document.getElementById('venda-cliente-nome').value.trim(),
    clienteCpf: document.getElementById('venda-cliente-cpf').value.trim(),
    clienteTelefone: document.getElementById('venda-cliente-tel').value.trim(),
    formaPagamento: document.getElementById('venda-pagamento').value,
    status: document.getElementById('venda-status').value,
    observacoes: document.getElementById('venda-obs').value.trim(),
  };

  if (!dados.produtoId || !dados.quantidade || !dados.clienteNome || !dados.formaPagamento) {
    mostrarToast('Produto, quantidade, cliente e forma de pagamento são obrigatórios.', 'erro');
    return;
  }

  const btn = document.getElementById('venda-save-btn');
  btn.disabled = true;
  try {
    await api.vendas.create(dados);
    mostrarToast('Venda registrada com sucesso.');
    showPage('vendas');
  } catch (err) {
    mostrarToast(err.message, 'erro');
  } finally {
    btn.disabled = false;
  }
}

async function carregarVendas() {
  const busca = document.getElementById('busca-vendas').value.trim();
  try {
    const resp = await api.vendas.list(busca ? { busca } : {});
    const tbody = document.getElementById('tbody-vendas');
    tbody.innerHTML = resp.dados.length
      ? resp.dados.map(v => `
        <tr>
          <td>${String(v.id).padStart(2, '0')}</td>
          <td>${escapeHtml(v.produtoNome)}</td>
          <td>${escapeHtml(v.clienteNome)}</td>
          <td>${v.quantidade}</td>
          <td>${formatBRL(v.valorUnitario)}</td>
          <td>${v.desconto > 0 ? formatBRL(v.desconto) : '—'}</td>
          <td>${formatBRL(v.valorFinal)}</td>
          <td>${escapeHtml(v.formaPagamento)}</td>
          <td><span class="badge ${v.status}">${rotuloStatus(v.status)}</span></td>
          <td>${formatDataHora(v.createdAt)}</td>
          <td><div class="action-btns">
            <button class="btn-sm" onclick="verVenda(${v.id})">Ver</button>
            ${v.status === 'pendente' ? `<button class="btn-sm success" onclick="concluirVenda(${v.id})">Concluir</button>
            <button class="btn-sm danger" onclick="cancelarVenda(${v.id})">Cancelar</button>` : ''}
          </div></td>
        </tr>`).join('')
      : `<tr><td colspan="11" class="empty-state">Nenhuma venda encontrada.</td></tr>`;
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function verVenda(id) {
  try {
    const v = await api.vendas.get(id);
    alert(
      `Venda #${v.id}\n\nProduto: ${v.produtoNome}\nQuantidade: ${v.quantidade}\nValor unitário: ${formatBRL(v.valorUnitario)}\n` +
      `Desconto: ${formatBRL(v.desconto)}\nValor final: ${formatBRL(v.valorFinal)}\n\n` +
      `Cliente: ${v.clienteNome}\nCPF: ${v.clienteCpf || '—'}\nTelefone: ${v.clienteTelefone || '—'}\n\n` +
      `Pagamento: ${v.formaPagamento}\nStatus: ${rotuloStatus(v.status)}\nObservações: ${v.observacoes || '—'}\n` +
      `Data: ${formatDataHora(v.createdAt)}`
    );
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function concluirVenda(id) {
  if (!confirm('Confirmar conclusão desta venda?')) return;
  try {
    await api.vendas.updateStatus(id, 'concluida');
    mostrarToast('Venda concluída com sucesso.');
    carregarVendas();
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

async function cancelarVenda(id) {
  if (!confirm('Confirmar cancelamento desta venda? O estoque será devolvido.')) return;
  try {
    await api.vendas.updateStatus(id, 'cancelada');
    mostrarToast('Venda cancelada.');
    carregarVendas();
  } catch (err) {
    mostrarToast(err.message, 'erro');
  }
}

/* ===================== Inicialização ===================== */
(function init() {
  atualizarAreaUsuario();
  if (getToken()) {
    showPage('dashboard');
  } else {
    showPage('login');
  }
})();
