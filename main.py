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


