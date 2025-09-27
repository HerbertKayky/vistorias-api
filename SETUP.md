# Configuração do Projeto - API de Vistorias

## Estrutura do Projeto

```
src/
├── modules/
│   └── auth/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── profile.controller.ts
│       ├── use-cases/
│       │   ├── register.use-case.ts
│       │   ├── login.use-case.ts
│       │   └── refresh-token.use-case.ts
│       ├── dto/
│       │   ├── register.dto.ts
│       │   ├── login.dto.ts
│       │   └── refresh-token.dto.ts
│       ├── guards/
│       ├── strategies/
│       │   └── jwt.strategy.ts
│       └── auth.module.ts
├── shared/
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── interfaces/
│       └── auth.interface.ts
└── app.module.ts
```

## Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vistorias_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# App
PORT=3000
NODE_ENV=development
```

## Comandos Necessários

1. **Instalar dependências:**
```bash
npm install
```

2. **Gerar cliente Prisma:**
```bash
npx prisma generate
```

3. **Executar migrações:**
```bash
npx prisma migrate dev --name init
```

4. **Executar o projeto:**
```bash
npm run start:dev
```

## Endpoints Disponíveis

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar access token

### Perfil (Protegido)
- `GET /profile` - Obter perfil do usuário logado
- `GET /profile/admin` - Acesso apenas para ADMIN
- `GET /profile/inspector` - Acesso para INSPECTOR e ADMIN

### Veículos (Protegido - ADMIN e INSPECTOR)
- `POST /vehicles` - Criar novo veículo
- `GET /vehicles` - Listar todos os veículos
- `GET /vehicles/:id` - Obter veículo por ID
- `PUT /vehicles/:id` - Atualizar veículo
- `DELETE /vehicles/:id` - Excluir veículo

### Inspeções/Vistorias (Protegido - ADMIN e INSPECTOR)
- `POST /inspections` - Criar nova inspeção com checklist
- `GET /inspections` - Listar todas as inspeções (com filtros)
- `GET /inspections/:id` - Obter inspeção por ID
- `PUT /inspections/:id` - Atualizar inspeção
- `PUT /inspections/:id/complete` - Finalizar inspeção
- `PATCH /inspections/:id/status` - Alterar status da vistoria
- `DELETE /inspections/:id` - Remover vistoria

### Relatórios (Protegido - ADMIN e INSPECTOR)
- `GET /reports/overview?from=YYYY-MM-DD&to=YYYY-MM-DD` - Relatório geral com agregados
- `GET /reports/by-inspector` - Métricas por inspetor
- `GET /reports/export/inspections` - Exportar vistorias em CSV
- `GET /reports/export/inspectors` - Exportar métricas de inspetores em CSV

## Roles Disponíveis
- `ADMIN` - Administrador
- `INSPECTOR` - Inspetor
- `USER` - Usuário comum

## Exemplo de Uso

### Registro
```json
POST /auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "USER"
}
```

### Login
```json
POST /auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Resposta do Login
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usar Token
```bash
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Exemplos de Uso dos Relatórios

### Relatório Geral
```bash
GET /reports/overview?from=2025-01-01&to=2025-01-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "total": 10,
  "aprovadas": 6,
  "reprovadas": 2,
  "tempoMedio": 140,
  "periodo": {
    "from": "2025-01-01",
    "to": "2025-01-31"
  }
}
```

### Relatório por Inspetor
```bash
GET /reports/by-inspector
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
[
  {
    "inspectorId": "inspector1",
    "inspectorName": "João Silva",
    "inspectorEmail": "joao.inspector@email.com",
    "total": 3,
    "aprovadas": 2,
    "reprovadas": 1,
    "tempoMedio": 150,
    "status": {
      "PENDENTE": 0,
      "EM_ANDAMENTO": 0,
      "APROVADA": 2,
      "REPROVADA": 1,
      "CANCELADA": 0
    }
  }
]
```

## Exemplos de Uso dos Veículos

### Criar Veículo
```bash
POST /vehicles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nome": "Civic Branco",
  "placa": "ABC-1234",
  "marca": "Honda",
  "modelo": "Civic",
  "ano": 2020,
  "proprietario": "João Proprietário"
}
```

### Listar Veículos
```bash
GET /vehicles
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Exemplos de Uso das Inspeções

### Criar Inspeção
```bash
POST /inspections
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "titulo": "Vistoria Honda Civic",
  "descricao": "Vistoria completa do Honda Civic",
  "vehicleId": "veh1",
  "inspectorId": "inspector1",
  "items": [
    {
      "key": "FREIOS",
      "status": "APROVADO",
      "comment": "Sistema de freios funcionando perfeitamente"
    },
    {
      "key": "MOTOR",
      "status": "APROVADO",
      "comment": "Motor em bom estado"
    },
    {
      "key": "PNEUS",
      "status": "REPROVADO",
      "comment": "Pneus desgastados"
    }
  ]
}
```

### Finalizar Inspeção
```bash
PUT /inspections/vist1/complete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "observacoes": "Veículo aprovado com ressalvas nos pneus"
}
```
