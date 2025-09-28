# 🚗 API de Vistorias EPTA

API desenvolvida em NestJS para gerenciamento de vistorias de veículos, com sistema de autenticação JWT e controle de acesso por roles.

## 📋 Funcionalidades

- **Autenticação JWT** com refresh token
- **Controle de acesso** por roles (Admin, Inspetor, Usuário)
- **Gestão de veículos** (CRUD completo)
- **Gestão de vistorias** com checklist de itens
- **Relatórios** com métricas e exportação CSV
- **Sistema de status** para vistorias (Pendente, Em Andamento, Aprovada, Reprovada, Cancelada)

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **TypeScript** - Linguagem principal

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd vistorias-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/vistorias_db"
JWT_SECRET=SEU-SECRET-JWT
```

### 4. Configure o banco de dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar as migrações
npx prisma migrate dev

# (Opcional) Visualizar o banco no Prisma Studio
npx prisma studio
```

### 5. Execute os seeds (dados de teste)

```bash
npm run seed
```

Isso criará:

- 1 usuário admin
- 2 usuários inspetores
- 10 veículos
- 20 vistorias distribuídas entre os status

### 6. Inicie a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:8000`

## 📚 Documentação da API

### Autenticação

#### Registrar usuário

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Nome do Usuário",
  "email": "usuario@email.com",
  "password": "123456",
  "role": "INSPECTOR" // opcional, padrão: USER
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "123456"
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "seu-refresh-token"
}
```

### Veículos

#### Listar veículos

```http
GET /vehicles
Authorization: Bearer <token>
```

#### Criar veículo

```http
POST /vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Civic 2020",
  "placa": "ABC-1234",
  "marca": "Honda",
  "modelo": "Civic",
  "ano": 2020,
  "proprietario": "João da Silva"
}
```

#### Atualizar veículo

```http
PUT /vehicles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Civic 2021",
  "marca": "Honda"
}
```

#### Deletar veículo

```http
DELETE /vehicles/:id
Authorization: Bearer <token>
```

### Vistorias

#### Listar vistorias

```http
GET /inspections?status=PENDENTE&inspectorId=123&from=2024-01-01&to=2024-12-31
Authorization: Bearer <token>
```

#### Criar vistoria

```http
POST /inspections
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Vistoria de Segurança",
  "descricao": "Vistoria completa do veículo",
  "vehicleId": "vehicle-id",
  "inspectorId": "inspector-id",
  "items": [
    {
      "key": "freios",
      "status": "APROVADO",
      "comment": "Sistema funcionando perfeitamente"
    },
    {
      "key": "pneus",
      "status": "REPROVADO",
      "comment": "Pneus carecas"
    }
  ]
}
```

#### Atualizar status da vistoria

```http
PATCH /inspections/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "APROVADA"
}
```

#### Finalizar vistoria

```http
PUT /inspections/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "observacoes": "Vistoria concluída com sucesso"
}
```

### Relatórios

#### Relatório geral

```http
GET /reports/overview?from=2024-01-01&to=2024-12-31
Authorization: Bearer <token>
```

#### Métricas por inspetor

```http
GET /reports/by-inspector
Authorization: Bearer <token>
```

#### Exportar vistorias (CSV)

```http
GET /reports/export/inspections?from=2024-01-01&to=2024-12-31
Authorization: Bearer <token>
```

#### Exportar inspetores (CSV)

```http
GET /reports/export/inspectors
Authorization: Bearer <token>
```

## 🔑 Credenciais de Teste

Após executar os seeds, você pode usar estas credenciais:

- **Admin:** `admin@vistorias.com` / `123456`
- **Inspetor 1:** `inspector1@vistorias.com` / `123456`
- **Inspetor 2:** `inspector2@vistorias.com` / `123456`

## 🏗️ Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/           # Autenticação e autorização
│   ├── vehicles/       # Gestão de veículos
│   ├── inspections/    # Gestão de vistorias
│   └── reports/        # Relatórios e métricas
├── shared/
│   ├── decorators/     # Decorators customizados
│   ├── guards/         # Guards de autenticação
│   ├── interfaces/     # Interfaces TypeScript
│   ├── prisma/         # Configuração do Prisma
│   └── types/          # Tipos e enums
└── seeds/              # Seeds para dados de teste
```

## 📊 Status das Vistorias

- **PENDENTE** - Vistoria criada, aguardando início
- **EM_ANDAMENTO** - Vistoria em execução
- **APROVADA** - Vistoria concluída com aprovação
- **REPROVADA** - Vistoria concluída com reprovação
- **CANCELADA** - Vistoria cancelada

## 🔍 Status dos Itens do Checklist

- **APROVADO** - Item aprovado na vistoria
- **REPROVADO** - Item reprovado na vistoria
- **NAO_APLICAVEL** - Item não aplicável

## 👥 Roles de Usuário

- **ADMIN** - Acesso total ao sistema
- **INSPECTOR** - Pode criar e gerenciar vistorias
- **USER** - Acesso limitado (padrão)

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Seeds
npm run seed

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `.env`
- Execute `npx prisma migrate dev`


### Erro de permissão

- Verifique se o usuário tem o role correto
- Use as credenciais de teste dos seeds
