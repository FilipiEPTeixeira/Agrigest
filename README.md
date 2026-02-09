# Agrigest
📚Estrutura Detalhada 
# AgriGest: Sistema de Gerenciamento para Agricultura Familiar
Sistema simples, modular e robusto focado no cadastro e gerenciamento de Agricultores e seus Produtos, com ênfase na rastreabilidade e organização de dados para apoio a feiras agroecológicas. Desenvolvido em Python, utilizando os princípios da Programação Orientada a Objetos (POO).
________________________________________
🚀 Visão Geral e Requisitos Atendidos
O AgriGest (Agri + Gestão) foi concebido para resolver o problema de organização de dados em cadeias de suprimentos curtas, especificamente no contexto de Feiras Agroecológicas.
Requisito
Cadastro de Agricultores - Implementado na Classe Agricultor. O objeto armazena dados essenciais (nome, endereço) e gerencia uma lista interna de Produtos.
Cadastro de Produtos - Implementado na Classe Produto. O objeto armazena dados (nome, preço, unidade de venda) e mantém uma referência ao objeto Agricultor responsável.
Relacionamento Bidirecional -  Essencial para rastreabilidade. O vínculo é estabelecido pelo método adicionar_produto na classe Agricultor, garantindo que um Agricultor tenha N Produtos e que cada Produto saiba a quem pertence.
Gerenciamento Centralizado - A Classe Adm atua como controlador central, utilizando dicionários para armazenar e acessar rapidamente objetos de Agricultor e Produto.
Interface de Usuário Simples - Os métodos da Classe Adm (ex: cadastrar_produto) lidam com a entrada de dados (input), tornando o sistema funcional em um ambiente de terminal.
________________________________________
🛠️ Estrutura do Projeto e Processos Adotados
Metodologia de Desenvolvimento
Adotamos os Processos Ágeis, utilizando o framework Scrum para guiar o desenvolvimento.
•	Cerimônias: Realização de reuniões virtuais (vide evidências) para:
•	Leitura aprofundada dos requisitos (Sprint 1).
•	Definição de Classes, Atributos e Métodos.
•	Delegação de papéis e Sincronização de Código (GitHub Commits).
•	Pesquisa de Campo: O projeto nasceu de uma escuta ativa com feirantes da Feira Agroecológica de Itapipoca e observações em campo, o que permitiu uma Abstração mais precisa do problema (ex: a simplicidade necessária na interface devido ao perfil semi-letrado de alguns agricultores).
Classes Principais (POO)
O sistema é construído sobre três classes essenciais: Produto, Agricultor e Adm.
Classes:
1)	Produto: Representa um item comercializado (ex: banana, feijão).
- Exemplo de Método/Atributo: self.preco = float(preco)
- Código-Fonte (Visão Geral) : Implementa Encapsulamento de dados do produto. O Construtor (__init__) garante que o preço seja tratado como float. O atributo self.agricultor = None é o ponto de partida para o relacionamento.

2)  Agricultor: Representa o produtor individual.
- Exemplo de Método/Atributo: self.produtos = []
- Código-Fonte (Visão Geral) : Implementa a Agregação: contém uma lista de objetos Produto. O método adicionar_produto é crucial para estabelecer o vínculo bidirecional e o controle da lista de produtos.

3)	Adm : Controlador central, a abstração do sistema de gestão.
- Exemplo de Método/Atributo: cadastrar_agricultor()
- Código-Fonte (Visão Geral):  Responsável por toda a lógica de gerenciamento. Usa dicionários (self.agricultores, self.produtos) para acesso rápido aos objetos. Orquestra a criação de objetos e o método relacionar_produto_a_agricultor para delegar o vínculo ao objeto Agricultor.

🧱 Princípios de POO Aplicados
O projeto demonstrou a aplicação robusta dos pilares da Programação Orientada a Objetos:

•	Encapsulamento: A classe Agricultor é a única que manipula sua lista interna de self.produtos. A complexidade de gerenciamento está oculta e protegida dentro da classe. Dados (atributos) e lógica (métodos) são agrupados nas classes.

•	Abstração: Para a classe Adm, interagir com Agricultor é simples: chama-se o método adicionar_produto() e o sistema sabe como fazer o vínculo, sem expor a lista de produtos diretamente. Foco na informação relevante (o que faz), ignorando a complexidade (como faz).

•	Associação/Relacionamento: Agricultor $\to$ Produto (Agregação via lista self.produtos). Produto $\to$ Agricultor (Associação via referência self.agricultor). Este é o cerne do requisito de rastreabilidade. Implementação de uma relação bidirecional (1 para N).

•	Construtores (__init__): Garante que todo objeto, ao ser criado, esteja em um estado válido (ex: o Produto tem um preço válido em float, o Agricultor tem o nome e endereço definidos). Utilização em todas as classes principais.
________________________________________
🎯 Possíveis Usos da Nossa Solução
Esta seção atende ao componente extensionista do trabalho, conforme item 1 do seu pedido.
O AgriGest, embora simples, resolve um problema fundamental de rastreabilidade e organização de dados em cadeias de suprimentos curtas (do produtor ao consumidor final).
1.	Apoio a Feiras e Associações: Em vez de gerenciar listas de papel ou planilhas desconectadas, a solução permite saber rapidamente: "Quem vende o quê?". Se um cliente procura "manga", o sistema aponta diretamente qual Agricultor (José, Maria, etc.) possui o Produto "manga" listado.
2.	Organização Interna do Produtor: A base do sistema permite que o agricultor tenha um inventário digitalizado, facilitando a verificação de preços e a listagem de produtos antes de sair de casa para a feira.
3.	Base para Evolução (MVP): Este sistema é um Mínimo Produto Viável (MVP) que pode evoluir para incluir módulos de gestão de vendas, controle de estoque e emissão de relatórios simples para apoio à tomada de decisão financeira e produtiva do agricultor familiar.
**AgriGest — Sistema de Gestão Agrícola**

Projeto desenvolvido como parte do Projeto Integrado II do curso de Análise e Desenvolvimento de Sistemas (ADS)** do CEAD/UFCA.

O *AgriGest* é um sistema pensado para facilitar o controle de produtores rurais, seus produtos e as vendas realizadas, com foco em organização, rastreabilidade e integridade dos dados.


Objetivo do Projeto

O objetivo do AgriGest é oferecer uma base sólida de dados que permita:

- Cadastro e gerenciamento de agricultores;
- Controle de produtos agrícolas e estoque;
- Registro completo das vendas realizadas;
- Manutenção do histórico financeiro e operacional;
- Segurança e consistência das informações armazenadas.

Este repositório concentra o projeto físico do banco de dados, etapa fundamental para garantir que o sistema funcione de forma eficiente, confiável e escalável.


 O que é Projeto Físico de Banco de Dados?

O projeto físico é a fase em que o banco de dados sai do papel e passa a existir de forma concreta no sistema gerenciador (no nosso caso, PostgreSQL).

É nesse momento que decidimos, por exemplo:
- Quais tabelas existirão;
- Quais tipos de dados serão usados (INTEGER, VARCHAR, DECIMAL, etc.);
- Como os dados se relacionam;
- Quais índices aceleram as consultas;
- Quais regras impedem dados inválidos.

Analogia simples
Imagine uma biblioteca:

- Projeto conceitual: decidir que haverá livros, autores e leitores;
- Projeto lógico: definir como eles se relacionam;
- Projeto físico: escolher o tamanho das prateleiras, etiquetas, ordem dos livros e regras de organização.

Sem um bom projeto físico, o sistema pode até funcionar, mas será lento, confuso e difícil de manter.


Estrutura do Banco de Dados

O banco foi modelado com três entidades principais:

Agricultor
Representa os produtores rurais cadastrados no sistema.

Armazena:
- Dados pessoais e de contato;
- Localização;
- Status (ativo/inativo);
- Total de vendas agregadas.

Produto
Representa os produtos agrícolas comercializados.

Armazena:
- Informações do produto;
- Categoria e tipo de venda;
- Preço;
- Controle de estoque;
- Relação direta com o agricultor fornecedor.

Venda
Registra todas as transações realizadas.

Armazena:
- Produto vendido;
- Quantidade e valores;
- Forma de pagamento;
- Status da venda;
- Dados do cliente;
- Data e observações.


 Principais Decisões Técnicas

- *Uso de IDs numéricos (SERIAL)* como chaves primárias, garantindo performance e imutabilidade;
- *Tipos DECIMAL* para valores monetários, evitando erros de arredondamento;
- *Índices estratégicos* para acelerar buscas frequentes;
- *Constraints (CHECK, FK, UNIQUE)* para garantir integridade dos dados;
- *Soft delete (ativo = false)* para preservar histórico sem excluir registros;
- *Triggers* para cálculos automáticos e atualização de dados agregados.

Essas decisões tornam o banco:
- Mais rápido;
- Mais seguro;
- Mais fácil de manter;
- Mais próximo de um cenário real de mercado.



Equipe

Projeto desenvolvido de forma colaborativa por:

- *Danilo Barros de Novaes* — Organização das reuniões, documentação e modelo lógico;
- *Eduardo Magalhães* — Estruturação do projeto físico e entidades principais;
- *Filipi Emanuel Pinto Teixeira* — Definição de atributos, chaves e relacionamentos;
- *Eyshila Serena Ferreira Mota* — Regras de negócio, cardinalidades e estruturação do README.

 Considerações Finais

Este projeto não se limita a cumprir um requisito acadêmico. Ele foi pensado para refletir **boas práticas reais de banco de dados**, preparando os estudantes para desafios do mercado e facilitando a compreensão de quem está começando na área.
