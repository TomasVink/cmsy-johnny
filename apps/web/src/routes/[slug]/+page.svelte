<script lang="ts">
  import { untrack } from "svelte";
  import type { PageData } from "./$types";
  import { useLivePreview } from "$lib/stores/live-preview.svelte.ts";
  import { PUBLIC_PAYLOAD_URL } from "$env/static/public";
  import type { Page } from "@repo/payload-types";

  let { data }: { data: PageData } = $props();

  // useLivePreview starts with SSR data and updates reactively via postMessage
  // when this page is embedded in the Payload admin iframe. It is a no-op when
  // accessed directly (window.parent === window).
  const preview = useLivePreview<Page>({
    initialData: untrack(() => data.page as Page),
    serverURL: PUBLIC_PAYLOAD_URL,
  });

  function renderLexical(content: Page["content"]): string {
    if (!content?.root) return "";
    return renderNode(content.root as unknown as LexicalNode);
  }

  type LexicalNode = {
    type: string;
    text?: string;
    format?: number;
    tag?: string;
    url?: string;
    listType?: string;
    children?: LexicalNode[];
  };

  function renderNode(node: LexicalNode): string {
    const children = () => (node.children ?? []).map(renderNode).join("");

    switch (node.type) {
      case "root":
        return children();
      case "paragraph":
        return `<p>${children()}</p>`;
      case "heading":
        return `<${node.tag}>${children()}</${node.tag}>`;
      case "text": {
        if (!node.text) return "";
        let t = node.text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        const fmt = node.format ?? 0;
        if (fmt & 1) t = `<strong>${t}</strong>`;
        if (fmt & 2) t = `<em>${t}</em>`;
        if (fmt & 8) t = `<u>${t}</u>`;
        if (fmt & 4) t = `<s>${t}</s>`;
        if (fmt & 16) t = `<code>${t}</code>`;
        return t;
      }
      case "link":
        return `<a href="${node.url}">${children()}</a>`;
      case "list": {
        const tag = node.listType === "number" ? "ol" : "ul";
        return `<${tag}>${children()}</${tag}>`;
      }
      case "listitem":
        return `<li>${children()}</li>`;
      case "quote":
        return `<blockquote>${children()}</blockquote>`;
      case "horizontalrule":
        return "<hr>";
      case "linebreak":
        return "<br>";
      default:
        return children();
    }
  }
</script>

<svelte:head>
  <title>{preview.data?.seo?.title ?? preview.data?.title ?? "Page"}</title>
  {#if preview.data?.seo?.description}
    <meta name="description" content={preview.data.seo.description} />
  {/if}
</svelte:head>

{#if preview.isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
    <span class="text-sm text-gray-400">Connecting to live preview…</span>
  </div>
{/if}

<article class="container mx-auto px-4 py-16 max-w-2xl">
  <a
    href="/"
    class="text-sm text-gray-400 hover:text-black transition-colors mb-8 inline-block"
  >
    ← Back
  </a>

  <h1 class="text-4xl font-bold mb-8">{preview.data?.title ?? "Untitled"}</h1>

  {#if preview.data?.content}
    <div class="prose prose-gray max-w-none">
      {@html renderLexical(preview.data.content)}
    </div>
  {/if}
</article>
