# GST Invoice App - Frontend

React + TypeScript + Vite frontend for GST invoice management system.

## Deployment (Production)

This frontend is deployed on **Vercel**. For complete deployment instructions, see [DEPLOYMENT_GUIDE.md](../../DEPLOYMENT_GUIDE.md).

**Quick Deploy:**
- Repository: https://github.com/AkshTheDev/GST-frontend
- Platform: Vercel
- Framework: Vite
- Build: `npm run build`
- Output: dist
- Environment: Set `VITE_API_BASE` to your Render backend URL

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_BASE=http://localhost:8000/api
```

3. Start dev server:
```bash
npm run dev
```

Client will start on http://localhost:5173 by default.

## Tech Stack

- **Framework:** React 19 + Vite 7 + TypeScript 5.9
- **UI:** Material-UI (MUI) 7
- **Data Fetching:** TanStack React Query 5
- **Charts:** Chart.js 4 with react-chartjs-2
- **Routing:** React Router 7
- **Export:** jsPDF, jspdf-autotable, xlsx

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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
