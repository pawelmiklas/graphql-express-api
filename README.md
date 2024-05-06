## Prerequisites

- Node.js (21.6 or later)
- npm (10.2 or later)
- Docker

## Setting up development environment

#### Installing dependencies

```bash
npm install
```

#### Setting up PostgreSQL with Docker

```bash
docker pull postgres
docker run --name postgres-example -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres
```

#### Database setup and seeding

```bash
npm run prisma:db
npm run seed
```

## Starting development server

```bash
npm run dev
```

open [http://localhost:4000/graphql](http://localhost:4000/graphql) in your browser

## Running tests

```bash
npm run test
```

## Prisma studio

```bash
npm run prisma:studio
```
