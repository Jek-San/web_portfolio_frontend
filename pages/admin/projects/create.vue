<template>
  <section class="min-h-screen bg-[#0d1117] text-white px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-10">
      <div class="space-y-2 text-center">
        <h1 class="text-4xl font-bold text-cyan-400">➕ Add New Project</h1>
        <p class="text-gray-400">Fill the form to add your awesome work.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Title</label>
          <input
            v-model="form.title"
            type="text"
            class="input"
            required
            @input="updateSlug"
          />
        </div>

        <!-- Slug -->

        <div>
          <label class="block text-sm font-medium text-gray-300">Slug</label>
          <input v-model="form.slug" class="input" required />
          <div class="text-sm mt-1">
            <span v-if="isChecking">🔄 Checking...</span>
            <span v-else-if="available === false" class="text-red-400"
              >❌ Slug taken</span
            >
            <span v-else-if="available === true" class="text-green-400"
              >✅ Slug available</span
            >
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Description</label
          >
          <textarea
            v-model="form.description"
            class="input"
            rows="3"
            required
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Tags (comma separated)</label
          >
          <input
            v-model="form.tags"
            type="text"
            class="input"
            placeholder="Vue, Nuxt 3, Tailwind"
          />
        </div>

        <!-- Link & Repo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300"
              >Live Link</label
            >
            <input v-model="form.link" type="url" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300"
              >Repo (GitHub)</label
            >
            <input v-model="form.repo" type="url" class="input" />
          </div>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Cover Image</label
          >
          <input
            type="file"
            @change="handleCoverChange"
            accept="image/*"
            class="input"
          />
          <img
            v-if="preview.cover"
            :src="preview.cover"
            class="mt-2 rounded shadow border w-48"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Gallery Images</label
          >

          <!-- Hidden input just to trigger selection -->
          <input
            ref="galleryInput"
            type="file"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleGalleryChange"
          />

          <button
            type="button"
            class="mb-2 text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            @click="galleryInput.click()"
          >
            ➕ Add Images
          </button>

          <!-- Preview Grid -->
          <div class="flex flex-wrap gap-4 mt-2">
            <div
              v-for="(src, i) in preview.gallery"
              :key="i"
              class="relative group w-32 h-32"
            >
              <img
                :src="src"
                class="rounded shadow border w-full h-full object-cover"
              />
              <button
                type="button"
                class="absolute top-0 right-0 text-white bg-red-600 rounded-full p-1 text-xs hidden group-hover:block"
                @click="removeGalleryImage(i)"
              >
                ❌
              </button>
            </div>
          </div>
        </div>
        <!-- Content (optional full description) -->
        <ClientOnly>
          <label class="block text-sm font-medium text-gray-300">Content</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            class="rounded border border-gray-700"
            style="min-height: 200px"
          />
        </ClientOnly>

        <!-- Submit -->
        <div class="text-right">
          <button
            type="submit"
            class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded shadow"
            :disabled="isLoading"
          >
            {{ isLoading ? "Saving..." : "Save Project" }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
definePageMeta({
  layout: "admin",
})

import { ref } from "vue"
import { useRouter } from "vue-router"
import { useFlash } from "@/composables/useFlash"
import { useApi } from "@/composables/useApi"
import { useSlugCheck } from "@/composables/useSlugCheck"
useMeta({
  title: `Create New Project`,
  description: "Create Projects",
  indexable: false, // Prevent search engines from indexing admin
})
import { debounce } from "lodash-es"
const QuillEditor = defineAsyncComponent(() =>
  import("@vueup/vue-quill").then((m) => m.QuillEditor)
)

const router = useRouter()
const { setFlash } = useFlash()

const form = ref({
  title: "",
  slug: "",
  description: "",
  content: "",
  tags: "",
  link: "",
  repo: "",
})
const { check, available, isChecking } = useSlugCheck()
watch(
  () => form.value.slug,
  debounce((val) => {
    check(val)
  }, 500)
)

const coverFile = ref(null)
const galleryFiles = ref([])
const preview = ref({
  cover: null,
  gallery: [],
})

const isLoading = ref(false)

const updateSlug = () => {
  form.value.slug = form.value.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

const handleCoverChange = (e) => {
  coverFile.value = e.target.files[0]
  preview.value.cover = URL.createObjectURL(coverFile.value)
}

const galleryInput = ref(null)

const handleGalleryChange = (e) => {
  const files = Array.from(e.target.files)

  for (const file of files) {
    galleryFiles.value.push(file)
    preview.value.gallery.push(URL.createObjectURL(file))
  }

  // Reset input value so we can reselect the same file later
  e.target.value = null
}

const removeGalleryImage = (index) => {
  galleryFiles.value.splice(index, 1)
  preview.value.gallery.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.description || !coverFile.value) {
    setFlash("❗ Title, description, and cover image are required")
    return
  }

  isLoading.value = true
  const formData = new FormData()

  formData.append("title", form.value.title)
  formData.append("slug", form.value.slug)
  formData.append("description", form.value.description)
  formData.append("link", form.value.link)
  formData.append("repo", form.value.repo)
  formData.append("content", form.value.content)
  formData.append(
    "tags",
    JSON.stringify(form.value.tags.split(",").map((t) => t.trim()))
  )
  formData.append("cover", coverFile.value)

  galleryFiles.value.forEach((file) => {
    formData.append("gallery", file)
  })

  try {
    await useApi(
      "api/projects",
      {
        method: "POST",
        body: formData,
      },
      true
    )

    setFlash("✅ Project created successfully")
    router.push("/admin/projects")
  } catch (err) {
    console.error(err)
    setFlash("❌ Failed to create project")
  } finally {
    isLoading.value = false
  }
}
</script>
