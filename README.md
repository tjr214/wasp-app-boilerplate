# A Simple ToDo App w/ Typescript & Fullstack Type Saftey ⛑

## Configure shadcn/ui

- Run `npx shadcn@latest init` to init the shadcn/ui tool.
- In `components.json` change the `utils` alias to `@../../lib/utils`.
- After installing a component, edit it and remove the `@` from the import.
- When importing the component:
  - Remove the `@/` from the import and replace it with a `./`

## Running it locally

1. Make sure you have the latest version of [Wasp](https://wasp-lang.dev) installed by running `curl -sSL https://get.wasp-lang.dev/installer.sh | sh` in your terminal.
2. Run `wasp new <project-name> -t todo-ts` to create a new app using this template.
3. Run `wasp db migrate-dev`
4. Run `wasp start`. This will install all dependencies and start the client and server for you :)
5. Go to `localhost:3000` in your browser (your NodeJS server will be running on port `3001`)
6. Install the Wasp extension for VSCode to get the best DX
7. Check out the docs for more info on wasp's [features](https://wasp-lang.dev/docs/language/features) and step-by-step [guides](https://wasp-lang.dev/docs)
