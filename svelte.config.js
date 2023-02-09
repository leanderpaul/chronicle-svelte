import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

const defaultTSCompilerConfig = {
  baseUrl: '.',
  esModuleInterop: true,
  allowJs: true,
  forceConsistentCasingInFileNames: true,
  resolveJsonModule: true,
  removeComments: true,
  skipLibCheck: true,
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  strictFunctionTypes: true,
  strictBindCallApply: true,
  strictPropertyInitialization: true,
  noImplicitThis: true,
  alwaysStrict: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  noUncheckedIndexedAccess: true,
  noImplicitOverride: true,
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '@/*': 'src/*',
      '$routes/*': '.svelte-kit/types/src/routes/*',
    },
    typescript: {
      config: (config) => {
        const paths = { '@/*': ['../src/*'], '$routes/*': ['./types/src/routes/*'] };
        const tsconfig = { ...config, compilerOptions: { ...config.compilerOptions, ...defaultTSCompilerConfig, paths } };
        return tsconfig;
      },
    },
  },
};

export default config;
