class Produto:
    def __init__(self, nome, preco, tipo_venda):
        self.nome = nome
        self.preco = float(preco)
        self.tipo_venda = tipo_venda
        self.agricultor = None

    def __str__(self):
        return (f"Produto: {self.nome} Preço: R${self.preco:.2f}"
                f"Tipo de Venda: {self.tipo_venda}")

class Agricultor:
    def __init__(self,nome,endereco):
        self.nome = nome
        self.endereco = endereco
        self.produtos = []

    def adicionar_produto(self, produto):
        self.produtos.append(produto)
        produto.agricultor = self

    def __str__(self):
        return f"Agricultor: {self.nome} Endereço: {self.endereco}"

class Adm:
    def __init__(self):
        self.agricultores = {}
        self.produtos = {}

    def cadastrar_agricultor(self):
        print("--- Cadastro de Agricultor ---")
        nome = input("Digite o nome do Agricultor: ")
        endereco = input("Digite o endereço do Agricultor: ")

        if nome in self.agricultores:
            print(f"O agricultor {nome} já está cadastrado.")
            return

        novo_agricultor = Agricultor(nome, endereco)
        self.agricultores[nome] = novo_agricultor
        print(f"Agricultor {nome} cadastrado com sucesso!")
        return novo_agricultor

 def cadastrar_produto(self):
        print("\n--- Cadastro de Produto ---")
        nome = input("Digite o nome do Produto: ")

        try:
            preco = input("Digite o preço do Produto: ")
            preco_float = float(preco)
        except ValueError:
            print("Preço inválido. O cadastro do produto foi cancelado.")
            return

        tipo_venda = input(
            "Digite o tipo de venda do Produto: ")

        if nome in self.produtos:
            print(f"O produto {nome} já está cadastrado.")
            return

        novo_produto = Produto(nome, preco_float, tipo_venda)
        self.produtos[nome] = novo_produto
        print(f"Produto {nome} cadastrado com sucesso!")
        return novo_produto

     def relacionar(self, produto_nome=nome, agricultor_nome=Nome):
        if not produto_nome:
            produto_nome = input("Qual o nome do produto que deseja relacionar? ")
            
        produto = self.produtos.get(produto_nome)
        if not produto:
            print(f"Produto {produto_nome} não encontrado.")
            return
        
        if not agricultor_nome:
            agricultores_nomes = list(self.agricultores.keys())[0]
            if not agricultores_nomes:
                print("Não ha agricultores cadastrados para relacionar.")
                return
            
            print("\nAgricultores disponíveis para relacionar:")
                 ",".join(agricultores_nomes))
            agricultor_nome = input(f"Qual o nome do agricultor que deseja relacionar ao produto {produto_nome}? ")
            
        agricultor = self.agricultores.get(agricultor_nome)
        if not agricultor:
            print(f"Agricultor {agricultor_nome} não encontrado.")
            return
        
        if produto not in agricultor.produtos:
            agricultor.adicionar_produto(produto)
            print(f"Produto {produto_nome} relacionado ao agricultor {agricultor_nome} com sucesso!")   
            
        else:
            print(f"O produto {produto_nome} já está relacionado ao agricultor {agricultor_nome}.") 
                
            
            




gerenciador = Adm()

agri1 = gerenciador.cadastrar_agricultor()

prod1 = gerenciador.cadastrar_produto()

gerenciador.relacionar()

agri2 = gerenciador.cadastrar_agricultor()
prod2 = gerenciador.cadastrar_produto()

if prod2 and agri2:
    gerenciador.relacionar_produto_a_agricultor()
