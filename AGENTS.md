# AGENTS Instructions

This project is a demo web app built with **Vite**, **React**, and **TypeScript**.

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
- Ensure `npm run build` passes.

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
- **Special Comments**
  - Never modify any line with `ai: dont modify this line`.
- **Scoped Changes**
  - If ordered to work in `client` code, do not modify anything outside `/client`.
  - If ordered to work in `server` code, do not modify anything outside `/server`.
  - If ordered to modify the OpenAPI spec, only modify `openapi.yaml` — do not touch any other files.

### 🚫 Forbidden

- Do not create new directories outside `client/` and `server/`.
- Do not install new packages without approval.
- Do not modify `README.md` or `openapi.yaml` without direct instruction.


