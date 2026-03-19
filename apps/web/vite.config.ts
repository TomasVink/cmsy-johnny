import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    // tailwindcss() must come before sveltekit()
    tailwindcss(),
    sveltekit(),
  ],
  server: {
    port: 5173,
  },
  ssr: {
    // Bundle the workspace package (pure TS source, no compiled output)
    noExternal: ['@repo/payload-types'],
  },
})
