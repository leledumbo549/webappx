# React + TypeScript + Vite

This project is a small demo web app built with **Vite** and **React** using **TypeScript**. Tailwind CSS is used for styling and a few [shadcn/ui](https://ui.shadcn.com/) components are included.

The application contains three simple routes implemented with React Router:

- **Home** – showcases shadcn/ui components such as Button, Alert and Accordion.
- **Blogs** – displays a list of sample blog posts.
- **About** – a short description of the project.

The code is located in the `client/` folder. UI primitives live in `client/components/ui` and each route is in `client/pages`.

## Scripts

Run the following commands with npm:

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start a development server with hot reload.      |
| `npm run build`   | Create a production build in the `dist/` folder. |
| `npm run preview` | Preview the production build locally.            |
| `npm run deploy`  | Publish the contents of `dist/` to GitHub Pages. |
| `npm run lint`    | Lint the project with ESLint.                    |
| `npm run format`  | Format source files with Prettier.               |

## Deployment

A workflow located at `.github/workflows/deploy.yml` builds the project and pushes it to the `gh-pages` branch. The site will be available at [`https://leledumbo549.github.io/webappx`](https://leledumbo549.github.io/webappx).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Mock API with MSW

This project uses [Mock Service Worker](https://mswjs.io/) for local API mocking. Handlers are defined in `client/mocks/handlers.ts`. You can add new endpoints there to support features such as the cart, seller orders or admin approvals. Start the dev server normally with `npm run dev` and MSW will intercept requests.
