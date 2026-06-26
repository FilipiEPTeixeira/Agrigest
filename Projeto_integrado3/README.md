# AgriGest — MVP Web

Sistema de Gestão de Feiras Agroecológicas. Projeto desenvolvido para a disciplina
de Projeto Integrado III (ADS / CEAD UFCA).

**Equipe:** Danilo Barros de Novaes, Filipi Emanuel Pinto Teixeira, Eduardo Magalhães,
Eyshila Serena Ferreira Mota.

Este repositório contém a evolução do protótipo estático (EP1) para um MVP funcional,
com backend real (API REST + banco de dados) conectado a um frontend que consome essa API.

## Estrutura do projeto

```
agrigest-mvp/
├── backend/      API REST em Node.js + Express
└── frontend/     Interface web (HTML + CSS + JS puro, sem build step)
```

## Pré-requisitos

- **Node.js 22.5 ou superior** (necessário porque o backend usa o módulo nativo
  `node:sqlite`, ainda experimental — você verá um aviso `ExperimentalWarning` no
  console ao iniciar o servidor; isso é esperado e não afeta o funcionamento).
  Verifique sua versão com `node -v`. Se estiver em uma versão mais antiga, atualize
  com [nvm](https://github.com/nvm-sh/nvm) (`nvm install 22 && nvm use 22`) ou baixe
  em [nodejs.org](https://nodejs.org).
- Um navegador moderno (Chrome, Firefox, Edge) para abrir o frontend.

## Como executar

### 1. Backend (API)

```bash
cd backend
npm install
npm run seed     # cria o banco de dados e popula com dados iniciais
npm start         # inicia a API em http://localhost:3001
```

Login de demonstração criado pelo seed:

- **Email:** admin@agrigest.com
- **Senha:** agrigest123

O comando `npm run seed` é idempotente — pode ser executado novamente sem duplicar
registros (ele verifica o que já existe antes de inserir).

### 2. Frontend

Com o backend rodando, basta abrir o arquivo `frontend/index.html` diretamente no
navegador (duplo clique, ou `Arquivo > Abrir`). Não há build, nem dependências —
é HTML/CSS/JS puro.

Se preferir servir por HTTP em vez de abrir como `file://` (opcional, mas evita
restrições do navegador em alguns sistemas), qualquer servidor estático funciona, por exemplo:

```bash
cd frontend
npx serve .
# ou: python3 -m http.server 5500
```

O frontend está configurado para chamar a API em `http://localhost:3001/api`
(veja `frontend/js/api.js`, constante `API_BASE`, caso queira mudar a porta).

## Sobre a escolha do banco de dados

O [documento de arquitetura do EP2](../EP2_AgriGest_Modelo_Arquitetural.docx) descreve
o uso de PostgreSQL com o ORM Prisma como solução de banco de dados planejada para
produção. Para a execução local deste MVP, optamos pelo módulo nativo `node:sqlite`
(SQLite embutido no próprio Node.js, sem instalação ou dependências externas), pois é
o suficiente para demonstração e desenvolvimento, e mantém zero passos de configuração
para quem for rodar o projeto.

O schema SQL (`backend/src/db/schema.sql`) foi desenhado para ser facilmente portado
para PostgreSQL — os tipos, chaves estrangeiras e índices não usam nenhum recurso
exclusivo do SQLite. A migração para PostgreSQL + Prisma, conforme planejado na
arquitetura, é um próximo passo natural e não exigiria redesenhar o modelo de dados.

## Funcionalidades implementadas

- **Autenticação** com JWT (login / logout, sessão expira em 8h).
- **Agricultores**: listagem com busca, cadastro, edição, ativar/desativar,
  total de vendas calculado automaticamente.
- **Produtos**: listagem com busca, cadastro, edição, indicador visual de estoque
  (ok / baixo / esgotado), vínculo com o agricultor responsável.
- **Vendas**: registro de venda com cálculo automático de valores (unitário, total,
  desconto, final), baixa automática de estoque do produto vendido, validação de
  estoque insuficiente, fluxo de status (pendente → concluída / cancelada) com
  devolução automática de estoque ao cancelar.
- **Dashboard**: indicadores agregados em tempo real (agricultores ativos, produtos
  com estoque baixo, vendas do dia, faturamento do mês) e lista das últimas vendas.

## Próximos passos sugeridos

- Migrar de `node:sqlite` para PostgreSQL + Prisma em um ambiente de produção,
  conforme a arquitetura documentada no EP2.
- Adicionar testes automatizados (unitários nos controllers, end-to-end no fluxo
  do frontend).
- Adicionar paginação nas listagens para volumes maiores de dados.
- Adicionar página de relatórios (o item "Relatórios" do menu hoje aponta para o
  Dashboard como placeholder).
