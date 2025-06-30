<template>
  <section class="min-h-screen bg-[#0d1117] text-white px-6 py-20">
    <div class="max-w-6xl mx-auto space-y-16">
      <!-- Header -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-cyan-400">
          Manage Projects
        </h1>
        <p class="text-gray-400 text-lg">
          Add, edit or remove your portfolio entries
        </p>

        <!-- ➕ Add New -->
        <NuxtLink
          to="/admin/projects/create"
          class="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 mt-4 rounded shadow"
        >
          ➕ Add New Project
        </NuxtLink>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center text-cyan-400">
        Loading projects...
      </div>

      <!-- Project Cards -->
      <div v-else class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(project, index) in projects"
          :key="index"
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
          <div class="flex gap-4 mb-4">
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

          <!-- Actions -->
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/projects/${project.slug}/edit`"
              class="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            >
              ✏️ Edit
            </NuxtLink>

            <button
              @click="openModal(project)"
              class="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              ❌ Delete
            </button>
            <NuxtLink
              :to="`/admin/projects/${project.slug}`"
              class="px-3 py-1 text-sm bg-gray-500 hover:bg-yellow-600 text-white rounded"
            >
              VIEW
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔥 Delete Confirmation Modal -->
    <DeleteModal
      :show="showModal"
      :itemName="projectToDelete?.title"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
})
import { ref, onMounted } from "vue"
import { useApi } from "@/composables/useApi"
import { useFlash } from "@/composables/useFlash"
import DeleteModal from "@/components/DeleteModal.vue"
useMeta({
  title: `Projects List`,
  description: "Admin Projects List",
  indexable: false, // Prevent search engines from indexing admin
})
const projects = ref([])
const isLoading = ref(false)
const showModal = ref(false)
const projectToDelete = ref(null)
const { setFlash } = useFlash()

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

const openModal = (project) => {
  projectToDelete.value = project
  showModal.value = true
}

const cancelDelete = () => {
  showModal.value = false
  projectToDelete.value = null
}

const confirmDelete = async () => {
  try {
    await useApi(
      `api/projects/${projectToDelete.value.id}`,
      { method: "DELETE" },
      true
    )
    await fetchProjects()
    setFlash("✅ Project deleted")
  } catch (err) {
    console.error("❌ Error deleting project:", err)
    setFlash("Error deleting project")
  } finally {
    showModal.value = false
    projectToDelete.value = null
  }
}

onMounted(fetchProjects)
</script>
