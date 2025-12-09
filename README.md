# Agrigest
Aqui faremos as atualizações do nosso projeto de ADS da UFCA

b) Princípios e Práticas de POO Utilizadas
O projeto é um excelente exemplo de aplicação dos pilares fundamentais da Programação Orientada a Objetos (POO):
1. Encapsulamento 🔒
●	Definição: Agrupamento dos dados (atributos) e das funções (métodos) que operam sobre esses dados em uma única unidade (a classe).
●	Aplicação: As classes Agricultor e Produto encapsulam seus atributos. Por exemplo, a classe Agricultor é a única responsável por gerenciar sua lista interna de produtos (self.produtos). A lógica de relacionamento está escondida no método adicionar_produto, protegendo o estado interno do objeto.
2. Abstração 🧠
●	Definição: Exposição apenas das informações relevantes, ocultando a complexidade de implementação.
●	Aplicação: Para o usuário final ou mesmo para a classe Adm, interagir com a classe Agricultor é simples: basta chamar cadastrar_agricultor() ou adicionar_produto(). O usuário não precisa saber como os dados são armazenados (em lista, dicionário, etc.), apenas que a funcionalidade existe. A classe Adm é a abstração do sistema de gerenciamento.
3. Associação (Relacionamento) 🔗
●	Definição: Estabelecimento de um vínculo entre duas classes.
●	Aplicação: Este é um requisito central. O projeto usa a Associação Unidirecional (Produto -> Agricultor) e Associação de Agregação (Agricultor -> Produto) para criar uma relação bidirecional:
○	Um objeto Agricultor contém uma lista de objetos Produto (self.produtos = []).
○	Um objeto Produto referencia o objeto Agricultor ao qual pertence (self.agricultor = None).
4. Construtores (__init__)
●	Prática: Utilizado para garantir que todo objeto, ao ser criado, esteja em um estado válido (com todos os atributos obrigatórios preenchidos: nome, preço, endereço, etc.).
