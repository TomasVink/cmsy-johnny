import adapter from 'svelte-adapter-bun'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import type { Config } from '@sveltejs/kit'

const config: Config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      // Ensures svelte-kit sync propagates this into .svelte-kit/tsconfig.json
      '@repo/payload-types': '../../packages/payload-types/src/index.ts',
    },
  },
}

export default config
