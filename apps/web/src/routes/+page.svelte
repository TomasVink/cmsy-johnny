<script lang="ts">
  import { PUBLIC_PAYLOAD_URL } from '$env/static/public'
</script>

<main class="container mx-auto px-4 py-16 max-w-3xl">
  <h1 class="text-4xl font-bold mb-6">SvelteKit + Payload CMS</h1>
  <p class="text-lg text-gray-600 mb-4">
    This SvelteKit app fetches content from Payload at
    <code class="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{PUBLIC_PAYLOAD_URL}</code>.
  </p>
  <div class="flex gap-4 mt-8">
    <a
      href="{PUBLIC_PAYLOAD_URL}/admin"
      class="inline-block bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      target="_blank"
      rel="noreferrer"
    >
      Open CMS Admin →
    </a>
    <a
      href="{PUBLIC_PAYLOAD_URL}/api/pages"
      class="inline-block border border-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      target="_blank"
      rel="noreferrer"
    >
      Pages API
    </a>
  </div>
</main>
