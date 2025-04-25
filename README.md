# NuxSaaS


## Setup
```bash
# use Node.js v22 LTS
nvm use

# Use npm or whatever you like to install the dependencies
npm install

# Setup env
cp .env.example .env

# Generate database migration based on database schema
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

# Starting the Production Server
npm run serve

# Deploy to Cloudflare Worker
cp wrangler.example.toml wrangler.toml
npm run deploy
```

##### Documentation
* [Nuxt](https://nuxt.com/docs/getting-started/introduction)
* [Better Auth](https://better-auth.vercel.app/docs)
* [Drizzle](https://orm.drizzle.team/docs/overview)
