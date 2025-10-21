# URL Shortener API

API desenvolvida com **NestJS**, **TypeScript** e **PostgreSQL** para encurtar URLs, acompanhar cliques e gerenciar links autenticados.  
Este projeto foi criado com foco em **boas práticas**, **observabilidade** e **qualidade de código**, servindo como base sólida para aplicações de back-end modernas.

---

## Visão Geral

- Autenticação via **JWT**
- Encurtamento de URLs público e autenticado
- Contabilização de cliques em cada link
- Exclusão lógica (soft delete)
- Observabilidade com **Sentry**
- Testes unitários e integração com **GitHub Actions**
- Husky + ESLint + Prettier (garantindo commits limpos)
- Execução local via **Docker Compose**

---

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sentry](https://sentry.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)
- [Husky](https://typicode.github.io/husky)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

## Estrutura do Projeto

```
src/
 ├── auth/              # Módulo de autenticação (login, registro)
 ├── users/             # Módulo de usuários
 ├── urls/              # Módulo principal (encurtamento, contagem, redirecionamento)
 ├── common/            # Filtros, decorators, guards e interceptors globais
 ├── config/            # Configurações (DB, Sentry, etc.)
 └── main.ts            # Ponto de entrada da aplicação
```

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- NPM

---

### 1. Clone o repositório

```bash
git clone https://github.com/rycsouza/url-shortener.git
cd url-shortener
```

---

### 2. Crie o arquivo `.env`

```bash
# Servidor
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development

# Banco de Dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=database
POSTGRES_PORT=5432
DATABASE_URL=postgres://postgres:postgres@db:5432/database

# JWT
JWT_SECRET=mysecret
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Observabilidade
SENTRY_DSN=https://SEU_TOKEN_DO_SENTRY
```

---

### 3. Suba o ambiente com Docker

```bash
docker-compose up --build
```

Isso irá subir:

- API NestJS em `http://localhost:3000`
- Banco PostgreSQL

---

### 4. Acesse a documentação Swagger

Após subir o ambiente, acesse:

```
http://localhost:3000/docs
```

Você poderá testar todas as rotas diretamente pela interface Swagger UI.

---

### 5. Rodar os testes

```bash
npm run test
```

Para ver a cobertura:

```bash
npm run test:cov
```

---

## Funcionalidades Principais

| Método | Rota             | Descrição                          | Autenticação |
| ------ | ---------------- | ---------------------------------- | ------------ |
| POST   | `/auth/register` | Registrar novo usuário             | ❌           |
| POST   | `/auth/login`    | Obter token JWT                    | ❌           |
| POST   | `/urls`          | Encurtar uma URL                   | ✅ Opcional  |
| GET    | `/:shortCode`    | Redirecionar e contabilizar clique | ❌           |
| GET    | `/urls`          | Listar URLs do usuário autenticado | ✅           |
| PATCH  | `/urls/:id`      | Atualizar URL                      | ✅           |
| DELETE | `/urls/:id`      | Soft delete da URL                 | ✅           |

---

## Git Hooks e CI/CD

Este projeto utiliza:

### **Husky**

- `pre-commit`: roda ESLint, Prettier e testes antes do commit.
- `pre-push`: roda testes de cobertura antes do push.

### **GitHub Actions**

O pipeline executa automaticamente:

- Instalação de dependências
- Testes unitários
- Cobertura de código

Workflow: `.github/workflows/tests.yml`

---

## Observabilidade (Sentry)

A integração com o [Sentry](https://sentry.io/) captura automaticamente:

- Erros 500, 404 e qualquer exceção global
- Stack trace completo com contexto da requisição
- Performance e tempo de execução de rotas

---

## Próximos Passos e Possíveis Melhorias

- Adicionar métricas Prometheus / Grafana
- Implementar fila de jobs com RabbitMQ (contagem assíncrona)
- Deploy completo com Terraform + Kubernetes

---

## Licença

2025 — Desenvolvido por **Rychard Souza**  
Projeto criado para portfólio, estudo e demonstração de arquitetura back-end profissional.
