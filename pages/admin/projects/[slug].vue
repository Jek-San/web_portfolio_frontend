<!-- pages/projects/[slug].vue -->
<template>
  <section
    class="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] text-white"
  >
    <div class="max-w-4xl mx-auto px-6 py-20">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center min-h-[50vh]">
        <div class="text-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"
          ></div>
          <p class="text-gray-400 text-lg">Loading project...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex items-center justify-center min-h-[50vh]"
      >
        <div
          class="text-center space-y-4 bg-red-900/20 border border-red-500/30 rounded-xl p-8"
        >
          <div class="text-red-400 text-4xl">❌</div>
          <p class="text-red-300 text-lg">Failed to load project</p>
          <p class="text-gray-400 text-sm">Please try again later</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else-if="project" class="space-y-12">
        <!-- Header Section -->
        <div class="space-y-6">
          <!-- Title with gradient -->
          <h1
            class="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent leading-tight"
          >
            {{ project.title }}
          </h1>

          <!-- Description with better typography -->
          <p class="text-xl text-gray-300 leading-relaxed max-w-3xl">
            {{ project.description }}
          </p>

          <!-- Enhanced Tags -->
          <div v-if="project.tags?.length" class="flex flex-wrap gap-3">
            <span
              v-for="(tag, i) in project.tags"
              :key="i"
              class="bg-gradient-to-r from-cyan-800/80 to-blue-800/80 backdrop-blur-sm border border-cyan-700/50 text-sm px-4 py-2 rounded-full text-cyan-100 font-medium hover:from-cyan-700/80 hover:to-blue-700/80 transition-all duration-300 shadow-lg"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Cover Image with enhanced styling -->
        <div v-if="project.imageUrl" class="relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"
          ></div>
          <img
            :src="useAssetUrl(project.imageUrl)"
            alt="Cover Image"
            class="relative w-full rounded-xl shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
          />
        </div>

        <!-- Enhanced Gallery -->
        <div v-if="project.images && project.images.length" class="space-y-6">
          <h2
            class="text-2xl font-bold text-cyan-400 border-b border-cyan-800/30 pb-2"
          >
            Gallery
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(img, i) in project.images"
              :key="i"
              class="relative group overflow-hidden rounded-xl"
            >
              <div
                class="absolute -inset-0.5 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"
              ></div>
              <NuxtImg
                :src="useAssetUrl(img)"
                alt="Gallery Image"
                class="relative rounded-xl shadow-lg object-cover h-64 w-full border border-gray-700/30 group-hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02]"
                format="webp"
                loading="lazy"
                placeholder
                width="600"
                height="400"
              />
            </div>
          </div>
        </div>

        <!-- Enhanced Content Section -->
        <div v-if="renderedContent" class="space-y-6">
          <h2
            class="text-2xl font-bold text-cyan-400 border-b border-cyan-800/30 pb-2"
          >
            Details
          </h2>
          <div
            class="prose prose-invert prose-lg max-w-none text-gray-200 prose-headings:text-cyan-300 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8 prose-h2:text-xl prose-h2:border-b prose-h2:border-cyan-800/30 prose-h2:pb-2 prose-h3:text-lg prose-h3:text-cyan-400 prose-p:mb-4 prose-p:leading-relaxed prose-ul:my-4 prose-li:my-2 prose-li:text-gray-300 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-code:text-cyan-300 prose-code:bg-gray-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-700/50 prose-pre:p-4 prose-pre:rounded-lg prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-300 prose-blockquote:pl-4 prose-strong:text-white prose-em:text-gray-300"
            v-html="renderedContent"
          />
        </div>

        <!-- Enhanced Links Section -->
        <div class="flex flex-wrap gap-4 pt-8 border-t border-gray-700/30">
          <a
            v-if="project.link"
            :href="project.link"
            class="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
            target="_blank"
          >
            <span class="text-lg">🔗</span>
            <span>Live Demo</span>
            <svg
              class="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
          </a>

          <a
            v-if="project.repo"
            :href="project.repo"
            class="group inline-flex items-center gap-3 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 hover:border-gray-500/50 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-500/10 hover:scale-105"
            target="_blank"
          >
            <span class="text-lg">💻</span>
            <span>GitHub</span>
            <svg
              class="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
})
import { useRoute, useFetch } from "#app"
import { marked } from "marked"
import { computed } from "vue"

const route = useRoute()
const slug = route.params.slug

// Fetch project from backend
const {
  data: project,
  pending,
  error,
} = await useFetch(`http://localhost:3001/api/projects/${slug}`)

// Configure marked options for better rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false,
})

// Convert Markdown to HTML
const renderedContent = computed(() => {
  if (!project.value?.content) return ""

  try {
    return marked.parse(project.value.content)
  } catch (error) {
    console.error("Markdown parsing error:", error)
    return project.value.content
  }
})
</script>
