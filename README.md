**AgriGest — Sistema de Gestão Agrícola**

Projeto desenvolvido como parte do Projeto Integrado II do curso de Análise e Desenvolvimento de Sistemas (ADS)* do CEAD/UFCA.

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



📎 **Repositório GitHub:**  
https://github.com/FilipiEPTeixeira/Agrigest
