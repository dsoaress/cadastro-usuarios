# Cadastro de usuários

[DEMO online](https://cadastro-usuarios-one.vercel.app)

Aplicação fullstack de cadastro de usuários. O projeto utiliza Nest.js no backend e React no frontend.

## Rodar localmente

No diretório backend, algumas variáveis de ambiente precisam ser informadas:

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb"
AWS_REGION="us-east-2"
AWS_S3_BUCKET="****"
AWS_S3_BUCKET_URL="https://*******.amazonaws.com"
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

Na raiz do projeto basta instalar as dependências com `yarn install`, fazer o push do schema para o banco com `yarn prisma:push` e, de forma opcional, fazer o seed com `yarn prisma:seed`.

Com esses processos realizados, basta rodar `yarn start` que front e back irão iniciar nas portas 3000 e 3010, respectivamente.

## Tecnologias

### Backend

- Nest.js (com Express)
- Prisma (com Postgres)
- AWS S3
- TypeScript

### Frontend

- React
- Axios
- Chakra ui
- React Hook Form
- Yup
- TypeScript

## Autenticação

Não fazia parte do escopo proposto o processo de autenticação e autorização, mas [aqui tem um exemplo](https://github.com/dsoaress/next-nest-auth) de um fluxo de autenticação completo com tokens JTW e refresh token.
