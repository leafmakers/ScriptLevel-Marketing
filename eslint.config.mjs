import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  // Reference material is also excluded from the app's tsconfig.json.
  globalIgnores(['grid-system-kit/**', 'Design docs/**']),
]);
