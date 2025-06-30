<template>
  <section class="min-h-screen bg-[#0d1117] text-white px-6 py-20">
    <div class="max-w-3xl mx-auto space-y-10">
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold text-cyan-400">✏️ Edit Project</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300">Title</label>
          <input v-model="form.title" type="text" class="input" required />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Description</label
          >
          <textarea
            v-model="form.description"
            rows="3"
            class="input"
            required
          />
        </div>

        <ClientOnly>
          <label class="block text-sm font-medium text-gray-300">Content</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            class="bg-white text-black rounded-md"
            style="min-height: 200px"
          />
        </ClientOnly>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-300"
            >Tags (comma separated)</label
          >
          <input v-model="form.tags" type="text" class="input" />
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
            <label class="block text-sm font-medium text-gray-300">Repo</label>
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
          <div v-if="coverPreview" class="mt-2">
            <img
              :src="coverPreview"
              alt="Preview"
              class="w-full h-48 object-cover rounded border border-gray-700"
            />
          </div>
        </div>

        <!-- Gallery Images -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Gallery Images
          </label>

          <!-- Hidden file input -->
          <input
            type="file"
            ref="galleryInput"
            multiple
            accept="image/*"
            class="hidden"
            @change="handleGalleryChange"
          />

          <!-- Trigger button -->
          <button
            type="button"
            class="mb-2 text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            @click="galleryInput.click()"
          >
            ➕ Add Images
          </button>

          <!-- Existing images from DB -->
          <div
            v-if="existingImages.length"
            class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4"
          >
            <div
              v-for="(img, index) in existingImages"
              :key="'existing-' + index"
              class="relative group"
            >
              <img
                :src="getFullImageUrl(img)"
                alt="Gallery"
                class="w-full h-32 object-cover rounded border border-gray-700"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-xs px-1.5 py-0.5 rounded"
                @click="removeExistingImage(index)"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- New selected images -->
          <div
            v-if="newGalleryPreview.length"
            class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4"
          >
            <div
              v-for="(img, index) in newGalleryPreview"
              :key="'new-' + index"
              class="relative group"
            >
              <img
                :src="img"
                alt="New"
                class="w-full h-32 object-cover rounded border border-gray-700"
              />
              <button
                type="button"
                class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-xs px-1.5 py-0.5 rounded"
                @click="removeNewImage(index)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="text-right">
          <button
            :disabled="isLoading"
            type="submit"
            class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded"
          >
            {{ isLoading ? "Saving..." : "Update Project" }}
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

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useFlash } from "@/composables/useFlash"
import { useApi } from "@/composables/useApi"
const QuillEditor = defineAsyncComponent(() =>
  import("@vueup/vue-quill").then((m) => m.QuillEditor)
)
const { params } = useRoute()
const router = useRouter()
const { setFlash } = useFlash()

const galleryInput = ref(null)
const isLoading = ref(false)
const coverFile = ref(null)
const galleryFiles = ref([])
const coverPreview = ref("")
const galleryPreview = ref([])
const existingImages = ref([]) // ← from backend
const newGalleryFiles = ref([])
const newGalleryPreview = ref([])

const form = ref({
  title: "",
  description: "",
  content: "",
  tags: "",
  link: "",
  repo: "",
})

onMounted(async () => {
  try {
    const data = await useApi(`api/projects/${params.id}`, {}, true)
    form.value = {
      ...data,
      tags: data.tags.join(", "),
    }
    coverPreview.value = useRuntimeConfig().public.API_BASE_URL + data.imageUrl
    existingImages.value = data.images
  } catch (err) {
    setFlash("❌ Failed to load project")
    console.error(err)
    router.push("/admin/projects")
  }
})

const getFullImageUrl = (img) => {
  return useRuntimeConfig().public.API_BASE_URL + img
}

const removeExistingImage = (index) => {
  existingImages.value.splice(index, 1)
}

const removeNewImage = (index) => {
  newGalleryFiles.value.splice(index, 1)
  newGalleryPreview.value.splice(index, 1)
}

const handleGalleryChange = (e) => {
  const files = Array.from(e.target.files)

  galleryFiles.value.push(...files) // ✅ This is what formData uses
  newGalleryFiles.value.push(...files)
  newGalleryPreview.value.push(...files.map((f) => URL.createObjectURL(f)))
}

const handleCoverChange = (e) => {
  coverFile.value = e.target.files[0]
  if (coverFile.value) {
    coverPreview.value = URL.createObjectURL(coverFile.value)
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  const formData = new FormData()

  formData.append("title", form.value.title)
  formData.append("description", form.value.description)
  formData.append("content", form.value.content)
  formData.append(
    "tags",
    JSON.stringify(form.value.tags.split(",").map((t) => t.trim()))
  )
  formData.append("link", form.value.link)
  formData.append("repo", form.value.repo)

  if (coverFile.value) {
    formData.append("cover", coverFile.value)
  }

  galleryFiles.value.forEach((file) => {
    formData.append("gallery", file)
  })

  try {
    await useApi(
      `api/projects/${params.id}`,
      {
        method: "PUT",
        body: formData,
      },
      true
    )

    setFlash("✅ Project updated successfully")
    router.push("/admin/projects")
  } catch (err) {
    setFlash("❌ Failed to update project")
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>
