# Wasp 0.15.x Boilerplate

## Configure shadcn/ui

- Run `npx shadcn@latest init` to init the shadcn/ui tool.
- In `components.json` change the `utils` alias to `@../../lib/utils`.
- After installing a component, edit it and remove the `@` from the `cn` import.
- When importing the component:
  - Remove the `@/` from the import and replace it with a `../`

## Running it locally

1. Make sure you have the latest version of [Wasp](https://wasp-lang.dev) installed by running `curl -sSL https://get.wasp-lang.dev/installer.sh | sh` in your terminal.
2. Run `wasp db migrate-dev` to create the database and tables.
3. Run `wasp start`. This will install all dependencies and start the client and server for you.
4. Go to `localhost:3000` in your browser (your NodeJS server will be running on port `3001`)

## Deploying with Coolify

1. Run `./coolify-deploy.sh` to configure the deployment.
2. Run `./coolify-deploy.sh` to deploy the app whenever you make changes.
