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
