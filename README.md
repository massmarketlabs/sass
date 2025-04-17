# NuxSaaS

## Env
```bash
# use Node.js v22 LTS
nvm use
```

## Setup
```bash
# Use npm or whatever you like to install the dependencies
npm install

# Generate auth-related schema based on Better Auth config
npm run auth:schema

# Generate database schema based on Drizzle ORM config
npm run db:generate

# Apply database migrations to PostgreSQL
npm run db:migrate

# Development Server
npm run dev

# Run test
npm run test
npm run test -- -t="should submit valid signup form"

# Build the application for production
npm run build

# Locally preview production build
npm run preview
```

##### Documentation
* [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction)
* [Better Auth](https://better-auth.vercel.app/docs)

##### Reference
* [atinux/nuxthub-better-auth](https://github.com/atinux/nuxthub-better-auth)
