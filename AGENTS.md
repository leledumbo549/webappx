# AGENTS Instructions

This project is a web app built with **Vite**, **React**, and **TypeScript**.

---

## Purpose

These instructions define how AI code agents and human contributors should modify the codebase consistently and safely.

---

## Development

- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Create a production build: `npm run build`

---

## Pre-commit Checklist

- Format code: `npm run format`
- Lint: `npm run lint`
- OpenAPI lint: `npm run lint:openapi` (only if `openapi.yaml` was modified)
- Run tests: `npm run test`
- Ensure `npm run lint`, `npm run lint:openapi`, `npm run build` passes.

---

## Branching & PR Workflow

- In the **pull request description and each commit message**, clearly explain:
  - **What** the agent has changed or done.
  - **How** it was done — list steps taken to fix or implement.
  - **Why** it was done — the purpose or goal.
  - Be as clear and descriptive as possible for reviewers and future reference.

---

## Coding Guidelines

### ✅ Allowed

- **Use TypeScript** for all code.
- **State Management**
  - Use [Jotai](https://jotai.org/) atoms for shared state.
  - Place atoms in `client/atoms/` with descriptive names.
- **Routing**
  - Define routes in `App.tsx` using `HashRouter` and `Routes`.
  - Place pages in the `pages/` directory.
- **API Calls**
  - Use `lib/axios` for all HTTP requests.
  - Keep server mocks inside `server/` only.
- **Types**
  - Define clear TypeScript interfaces for all data models.
- **Testing**
  - Use **Jest** as the unit test framework.
  - Write unit tests in the `/tests` folder.
  - Use descriptive test file names that match the component/function being tested.
  - Follow the pattern: `ComponentName.test.tsx` for React components and `functionName.test.ts` for functions.
  - Test both success and error scenarios.
  - Mock external dependencies appropriately.
- **Special Comments**
  - Never modify any line with `ai: skip`.

### 🚫 Forbidden

- Do not create new directories outside `client/`, `tests/` and `server/`.

