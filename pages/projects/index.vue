<!-- pages/projects/index.vue -->
<template>
  <section class="min-h-screen bg-[#0d1117] text-white px-6 py-20">
    <div class="max-w-6xl mx-auto space-y-16">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-cyan-400">
          My Projects
        </h1>
        <p class="text-gray-400 text-lg">
          Some cool things I've built with code 🧠💻
        </p>
      </div>

      <!-- Project Cards -->
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="index"
          :to="`/projects/${project.slug}`"
          class="bg-[#161b22] rounded-xl p-6 shadow-lg hover:shadow-cyan-500/20 transition block"
        >
          <h2 class="text-2xl font-semibold text-white mb-2">
            {{ project.title }}
          </h2>
          <p class="text-gray-400 mb-4 text-sm">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="(tag, i) in project.tags"
              :key="i"
              class="bg-cyan-800 text-xs px-2 py-1 rounded-full text-cyan-100"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Links -->
          <div class="flex gap-4">
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              class="text-cyan-400 hover:underline text-sm"
            >
              🔗 Live
            </a>
            <a
              v-if="project.repo"
              :href="project.repo"
              target="_blank"
              class="text-gray-400 hover:underline text-sm"
            >
              💻 GitHub
            </a>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useApi } from "@/composables/useApi"
import { useFlash } from "@/composables/useFlash"

const { setFlash } = useFlash()
const projects = ref([])
const isLoading = ref(false)

const fetchProjects = async () => {
  isLoading.value = true
  try {
    const res = await useApi("api/projects")
    projects.value = res
  } catch (err) {
    console.error("❌ Failed to fetch projects:", err)
    setFlash("Failed to fetch projects")
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchProjects)
</script>
