# medium-post-app
## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Como Rodar a Aplicação](#-como-rodar-a-aplicação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Contato](#-contato)

## ✨ Funcionalidades

-   **Autenticação de Usuário**: Sistema completo de registro e login com tokens JWT.
-   **CRUD de Posts**: Usuários autenticados podem criar, ler, atualizar e deletar seus próprios posts.
-   **Feed de Notícias**: Página inicial que exibe todos os posts com scroll infinito.
-   **Paginação por Cursor**: Carregamento de posts sob demanda de forma eficiente, evitando o uso de `offset` e melhorando a performance.
-   **Sistema de Likes**: Usuários podem curtir e descurtir posts.
-   **Busca Avançada**: Funcionalidade de busca por posts com base em palavras-chave no título, resumo ou texto.
-   **Cache com Redis**: As consultas de listagem de posts são cacheadas para reduzir a carga no banco de dados e acelerar as respostas.
-   **Edição de Perfil**: Usuários podem atualizar suas informações de perfil, incluindo nome, email e senha.

## 🚀 Tecnologias Utilizadas

#### **Frontend**

-   **AngularJS (1.8)**: Framework para construir a interface dinâmica da aplicação.
-   **HTML5 / CSS3**: Estrutura e estilização das páginas.
-   **Bootstrap**: Componentes de UI e responsividade.

#### **Backend**

-   **Node.js**: Ambiente de execução para o JavaScript no servidor.
-   **Express.js**: Framework para a construção da API REST.
-   **Sequelize**: ORM (Object-Relational Mapper) para interagir com o banco de dados SQL.
-   **JSON Web Token (JWT)**: Para autenticação e autorização segura.
-   **Bcrypt**: Para criptografia de senha
-   **PostgreSQL**: Banco de dados relacional.

#### **Banco de Dados & Cache**

-   **Redis**: Banco de dados em memória utilizado para cache de requisições.

## 🔧 Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:

-   [Node.js](https://nodejs.org/en/) (que já inclui o npm)
-   Um banco de dados PostgreSQL [PostgreSQL](https://www.postgresql.org/)
-   [Redis](https://redis.io/docs/getting-started/installation/)
-   [Live Server](https://www.npmjs.com/package/live-server) (extensão do VSCode ou pacote npm global)

## 👾 Instalação e Configuração
Siga os passos abaixo para configurar o ambiente de desenvolvimento.

Clone o repositório:

```Bash
git clone https://github.com/LuccaMontarroyos/medium-post-app.git
```
```
cd medium-post-app
```

Configure o Backend:

Navegue até a pasta do backend:

```Bash
cd backend
```
Instale as dependências:

```Bash
npm install
```
Crie um arquivo .env na raiz da pasta backend, copiando o exemplo de .env.example (veja a seção Variáveis de Ambiente abaixo).

Configure seu banco de dados no arquivo .env.

Execute as migrations para criar as tabelas no banco de dados:

```Bash
npx sequelize-cli db:migrate
```
Configure o Frontend:

Apenas certifique-se de ter o live-server instalado globalmente:
```bash
npm install -g live-server
```

## ▶️ Como Rodar a Aplicação
Para executar a aplicação, os três serviços (Redis, Backend, Frontend) precisam estar ativos.

Inicie o Servidor Redis:

Navegue até o diretório de instalação do Redis e execute o servidor:

```Bash
redis-server.exe
```
Nota: Deixe este terminal aberto enquanto estiver desenvolvendo.

Inicie o Servidor Backend:

Em um novo terminal, navegue até a pasta backend:

```Bash
cd backend
```
Execute o servidor em modo de desenvolvimento:

```Bash
npm run dev
```
O backend estará rodando em http://localhost:3333 por padrão.

Inicie o Servidor Frontend:

Em um terceiro terminal, navegue até a pasta raiz do projeto (ou a pasta do frontend, dependendo da sua estrutura) e execute:

```Bash
live-server
```
O live-server abrirá automaticamente o seu navegador com a aplicação rodando, geralmente em http://127.0.0.1:5500.

## 📂 Estrutura do Projeto
```
/
├── apps
      └── backend/
      │   ├── src/
      │   ├── node_modules/
      │   ├── .env
      │   └── package.json
      └── frontend/
          ├── assets/
          ├── src/
          │   ├── controllers/
          │   ├── services/
          │   └── views/
          └── index.html
└── README.md
```
## 🔑 Variáveis de Ambiente
Crie um arquivo .env na pasta backend com as seguintes variáveis. Substitua os valores pelos da sua configuração local.

### URL Base da Aplicação (usada para gerar links de imagens)
```
BASE_URL=http://localhost:3333
```
### Configuração do Banco de Dados (exemplo para PostgreSQL)
```
DB_DIALECT=postgres
DB_HOST=localhost
DB_USERNAME=seu_usuario_db
DB_PASSWORD=sua_senha_db
DB_NAME=nome_do_seu_db
DB_PORT=5432
```

### Credenciais do JWT
```
APP_SECRET=seu_segredo_jwt_super_secreto
TOKEN_EXPIRES_IN=7d
```

### Configuração do Redis
```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```
## 👨‍💻 Contato
GitHub: https://github.com/LuccaMontarroyos

LinkedIn: https://linkedin.com/in/lucca-barros

Email: luccabarros2003@gmail.com
