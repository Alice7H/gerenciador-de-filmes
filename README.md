# Gerenciador de Filmes - Ab Filmes

Este é um projeto com aplicação de signals, desenvolvendo um gerenciador de filmes com funcionalidades como cadastro e login de usuários, validação de formulários, controle de autenticação e comunicação com API.

O projeto permite adicionar filmes, atribuir notas, calcular automaticamente a média das avaliações, marcar favoritos e filtrar filmes por nome e categoria, utilizando signals como principal forma de gerenciamento de estado.

A pasta `server` contém o back-end da aplicação, responsável por disponibilizar a API do sistema.

## Características do Back-End:

- Stack Tecnológica: 
  runtime node.js, framework express, linguagem typescript, arquitetura Feature-Based / DDD (domain-driven design), separando responsabilidades por contexto (Users, Movies, Favorites).

- Persistência de dados e armazenamento:
  O sistema utiliza uma abordagem `Serveless-like` local, simulando banco de dados e storage.
  - JSON database: os dados são persistidos em arquivos locais (server/data/*.json) para Users, Movies e Favorites.
  - File System Storage: upload de imagens gerenciado localmente na pasta pública (server/public/uploads), servida estaticamente pelo Express.
  - Separação de Camadas: a pasta de dados (data) e ativos (public) está isolada do código fonte (src), garantindo segurança e organização.

- Middleware e segurança:
  - Auth Middleware: interceptador que valida tokens JWT (Json Web Tokens). Ele decodifica o token e injeta os dados do usuário no objeto request (req.user) de forma tipada.
  - Upload Middleware: utiliza a biblioteca Multer para gerenciar multipart/form-data, validando se o arquivo é uma imagem, gerando nomes únicos e salvando no disco.
  - CORS: Configurado para permitir requisições externas (essencial para a comunicação com o Frontend Angular).

- Endpoints e funcionalidades:
A API está dividida em 3 recursos principais.
1- Usuários (/users)
  - POST `/`: Cria um novo usuário
    - Lógica: verifica duplicidade de e-mail e salva no JSON. Retorna o usuário sanitizado (sem a senha).
  - POST `/login`: Autentica o usuário
    - Lógica: valida credencias e retorna um token JWT com validade de 1 hora, junto com os dados do usuário.

2- Filmes (/movies)
  - GET `/`: Lista todos os filmes cadastrados (Requer token)
  - GET `/:id`: Retorna os detalhes de um filme específico por ID numérico (Requer token)
  - POST `/`: Cadastra um novo filme com imagem (Requer token).
    - Feature: processa Upload de imagem e salva o caminho relativo (/uploads/...) no banco de dados, evitando Base64 pesado no JSON.
  - POST `/:id/rate`: Avalia um filme com nota de 1 a 5 (Requer token)
    - Algoritmo: implementa lógiva de média ponderada incremental, atualizando a nota média (mediaVotos) e o total de votos (qtdVotos) em tempo real.

3- Favoritos (/favorites)
  - GET `/`: Lista os filmes favoritos do usuário logado (Requer token).
    - Feature: realiza um 'join' lógico, buscando os IDs no favorites.json e cruzando com os dados completos do movie.json.
  - POST `/:movieId`: Adiciona um filme ao favoritos do usuário (Requer token).
  - DELETE `/:movieId`: Remove um filme dos favoritos (Requer token).

## Configuração da collection do back-end e teste dos endpoints

Usamos o Insomnia para testar os endpoints do back-end e o arquivo `collection-insomnia-gerenciador-filmes.yaml` para exploramos cada endpoint em funcionamento, desde a criação de usuários até a manipulação de filmes. Criamos o envio de requisições, lidamos com tokens JWT e interagimos com o servidor.

## Visão dos componentes

Os componentes do projeto são:
- authentication-screen
- login-form
- register-user-form
- main-layout
- header
- explore-movies
- movies-filter
- movies-list
- favorite-movies
- create-movie
- movie-details

## Visão da Estrutura em Feature Based Components

Os componentes estão organizados com a estrutura de Feature Based Components
A `Core` contém componentes essenciais, enquanto a Shared abriga itens reutilizáveis.
As `Features` organizam funcionalidades específicas, como autenticação e favoritos.
Usamos o Layout como uma abordagem de estrutura global da lógica, a Pages como parte das visualizações mais específicas da aplicação.

- LAYOUT: são componentes fixos e estruturantes, por exemplo: Header, Sidebar, Footer e componentes com RouterOutlet.

- PAGES: é o conteúdo. É a tela de destino final. Ela não tem rotas filhas, ela é a rota.

- COMPONENTS: geralmente se refere à widgets ou pedaços de UI que preenchem o esqueleto.

## Implementações

- Configuração de rotas e middlewares
- Implementação do Login
- Implementação do Registro de Usuário
- Implementação do Header
- Implementação da Área de Explorar
- Implementação da Área de Favoritos
- Implementação da Área de Detalhes do Filme
- Implementação da Área de Criação do Filme
- Aplicação de Lazy Loading nas Rotas
- Criação de Environments e substituição de hardcoded URL ( inserção de url diretamente no código)

## Para rodar a aplicação

Utilize o comando `npm run build`, para empacotar e otimizar a aplicação para a produção e gerar a pasta `dist`. Depois `ng run start` que foi configurado para executar os scripts da pasta gerada.

Utilize o comando `npm run start` ou `ng serve` para atuar sobre a aplicação front-end, lembrando que o comando com o `serve` utiliza a versão global do Angular CLI instalada em sua máquina.
