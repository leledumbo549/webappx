# AGENTS Instructions

This repository hosts a small demo web app using **Vite**, **React** and **TypeScript**. The code lives in the `client/` directory while a lightweight API mock server is placed in `server/`. Formatting is handled with Prettier and linting with ESLint.

## Development

- Install dependencies with `npm install`.
- Start the dev server using `npm run dev`.
- Create a production build with `npm run build`.

## Pre‑commit checklist

- Run `npm run format` to apply the Prettier style (semi‑colons disabled, single quotes, trailing commas where valid).
- Run `npm run lint` and fix any reported issues.
- Ensure `npm run build` succeeds before opening a pull request.

## Coding guidelines

- TypeScript is used across both client and server code.
- Do not modify lines that include the comment `ai: dont modify this line`.
- Dont create any new directory.
- Dont install any new packages.
- Dont update `README.md`.
- Dont update `openapi.yaml` except directly ordered.
- Ensure client/ code connect to api defined in `openapi.yaml`.
- Ensure server/ code to implement all api defined in `openapi.yaml`.

## Pull requests

Describe your changes clearly and mention any new scripts or steps required to build or run the project.
 
