![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 2 - Back-end

Esse era o desafio do módulo 2 da Cubos, a tarefa era desenvolver uma API para um Banco Digital.

A API RESTful deveria:

- Criar conta bancária
- Listar contas bancárias
- Atualizar os dados do usuário da conta bancária
- Excluir uma conta bancária
- Depósitar em uma conta bancária
- Sacar de uma conta bancária
- Transferir valores entre contas bancárias
- Consultar saldo da conta bancária
- Emitir extrato bancário
- A API deveria seguir o padrão REST
- Ter um código organizado, delimitando as responsabilidades de cada arquivo adequadamente. Ou seja, era esperado que ele ter, no mínimo:
  - Um arquivo index.js
  - Um arquivo de rotas
  - Um pasta com controladores
- Qualquer valor (dinheiro) deveria ser representado em centavos (Ex.: R$ 10,00 reais = 1000)
- Evitar códigos duplicados.
<div style="display: inline_block"><br>
<img align="center"  height="300"  src="https://i.ibb.co/SfB9NVJ/Captura-de-tela-2023-03-04-182513.jpg" />
<img align="center"  height="300"  src="https://i.ibb.co/bP6GMss/Captura-de-tela-2023-03-04-182549.jpg" />    
</div>

## Tecnologias

<div style="display: inline_block"><br>
   <img align="center" alt="logo JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
   <img align="center" alt="logo Express"  src="https://img.shields.io/badge/Express.js-404D59?logo=Express&style=for-the-badge" />    
   <img align="center" alt="logo NodeJs" src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
   <img align="center" alt="logo PostgreSQL"  src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
          
</div>

## Requisitos

- Node.js `v18.12.1`
- PostgreSQL `v15`
- Insomnia ou outro API Client
- Beekeeper Studio ou outro gerenciador de banco de dados

## Como usar
1. Baixar ou clonar o repositório.

#### Para iniciar a API:
 1. Você deve abrir um terminal no diretório `/Desafio-M02-Backend`.
 2. Rodar o comando `npm install`.
 3. Após a instalação finalizar rodar o comando `npm run dev` para iniciar a API.

Você pode usar o insomnia ou outra API Client de sua preferência para testar os endpoints.

## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint lista todas as contas bancárias existentes.

- **Requisição** - query params (respeitando este nome)

  - senha_banco

#### Exemplo de Requisição

```javascript
http://localhost:3000/contas?senha_banco=Cubos123Bank
```

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint criar uma conta bancária.

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - cpf
  - data_nascimento
  - telefone
  - email
  - senha

#### Exemplo de Requisição

```javascript

{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualiza apenas os dados do usuário de uma conta bancária.

- **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

  - nome
  - cpf
  - data_nascimento
  - telefone
  - email
  - senha

#### Exemplo de Requisição

```javascript
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
{
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint exclui uma conta bancária existente.

- **Requisição**

  - Numero da conta bancária (passado como parâmetro na rota)

#### Exemplo de Requisição

```javascript
http://localhost:3000/contas/1
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint soma o valor do depósito ao saldo de uma conta válida e registra essa transação.

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - numero_conta
  - valor

#### Exemplo de Requisição

```javascript
{
    "numero_conta": "1",
    "valor": 1900
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registra essa transação.

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - numero_conta
  - valor
  - senha

#### Exemplo de Requisição

```javascript
{
    "numero_conta": "1",
    "valor": 1900,
    "senha": "12345"
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registra essa transação.

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - numero_conta_origem
  - numero_conta_destino
  - valor
  - senha

#### Exemplo de Requisição

```javascript

{
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 200,
    "senha": "12345"
}
```

### Saldo

#### `GET` `/contas/saldo?numero_conta=1&senha=12345`

Esse endpoint retorna o saldo de uma conta bancária.

- **Requisição** - query params

  - numero_conta
  - senha

#### Exemplo de Requisição

```javascript
http://localhost:3000/contas/saldo?numero_conta=1&senha=12345
```

### Extrato

#### `GET` `/contas/extrato?numero_conta=1&senha=12345`

Esse endpoint lista as transações realizadas de uma conta específica.

- **Requisição** - query params

  - numero_conta
  - senha

#### Exemplo de Requisição

```javascript
http://localhost:3000/contas/extrato?numero_conta=1&senha=12345
```

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`
