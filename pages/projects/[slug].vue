<template>
  <section
    class="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] text-white"
  >
    <div class="max-w-4xl mx-auto px-6 py-20">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center min-h-[50vh]"
      >
        <div class="text-center space-y-4">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"
          />
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
        <!-- Title -->
        <div class="space-y-6">
          <h1
            class="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent leading-tight"
          >
            {{ project.title }}
          </h1>
          <p class="text-xl text-gray-300 leading-relaxed max-w-3xl">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div v-if="project.tags?.length" class="flex flex-wrap gap-3">
            <span
              v-for="(tag, i) in project.tags"
              :key="i"
              class="bg-gradient-to-r from-cyan-800/80 to-blue-800/80 border border-cyan-700/50 text-sm px-4 py-2 rounded-full text-cyan-100 font-medium shadow-lg"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Cover -->
        <div v-if="project.imageUrl" class="relative group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"
          />
          <img
            :src="useAssetUrl(project.imageUrl)"
            alt="Cover Image"
            class="relative w-full rounded-xl shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
          />
        </div>

        <!-- Gallery -->
        <div v-if="project.images?.length" class="space-y-6">
          <h2
            class="text-2xl font-bold text-cyan-400 border-b border-cyan-800/30 pb-2"
          >
            Gallery
          </h2>

          <!-- Swipeable gallery with mobile hint + peeking -->
          <Swiper
            :spaceBetween="16"
            :slidesPerView="1.2"
            :centeredSlides="true"
            :pagination="{ clickable: true }"
            class="!pl-4 !pb-10"
            :breakpoints="{
              768: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 20,
              },
            }"
          >
            <SwiperSlide
              v-for="(img, i) in project.images"
              :key="i"
              class="relative rounded-xl overflow-hidden cursor-pointer"
              @click="openModal(i)"
            >
              <NuxtImg
                :src="useAssetUrl(img)"
                alt="Gallery Image"
                class="rounded-xl shadow-lg object-cover h-64 w-full border border-gray-700/30 transition duration-300 hover:scale-[1.02]"
                format="webp"
                loading="lazy"
                placeholder
                width="600"
                height="400"
              />
              <!-- 👈 Mobile swipe hint (only on 1st image) -->
              <div
                v-if="i === 0"
                class="absolute bottom-3 left-3 text-xs sm:hidden text-white bg-black/50 px-3 py-1 rounded-full"
              >
                👈 Swipe to see more
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- Fullscreen Modal Lightbox -->
          <transition name="fade">
            <div
              v-if="showModal"
              class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              @click.self="closeModal"
            >
              <button
                @click="closeModal"
                class="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded-full text-sm z-50"
              >
                ❌ Close
              </button>

              <Swiper
                :initialSlide="activeIndex"
                :spaceBetween="20"
                :slidesPerView="1"
                navigation
                pagination
                class="w-full max-w-3xl"
              >
                <SwiperSlide
                  v-for="(img, i) in project.images"
                  :key="'modal-' + i"
                  class="flex justify-center"
                >
                  <NuxtImg
                    :src="useAssetUrl(img)"
                    class="max-h-[80vh] object-contain rounded-xl shadow-xl"
                    format="webp"
                    placeholder
                  />
                </SwiperSlide>
              </Swiper>
            </div>
          </transition>
        </div>

        <!-- Content -->
        <div v-if="renderedContent" class="space-y-6">
          <h2
            class="text-2xl font-bold text-cyan-400 border-b border-cyan-800/30 pb-2"
          >
            Details
          </h2>
          <div
            class="prose prose-invert prose-lg max-w-none text-gray-200"
            v-html="renderedContent"
          />
        </div>

        <!-- Links -->
        <div class="flex flex-wrap gap-4 pt-8 border-t border-gray-700/30">
          <a
            v-if="project.link"
            :href="project.link"
            target="_blank"
            class="group inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-lg hover:scale-105"
          >
            <span class="text-lg">🔗</span>
            <span>Live Demo</span>
          </a>
          <a
            v-if="project.repo"
            :href="project.repo"
            target="_blank"
            class="group inline-flex items-center gap-3 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition duration-300 hover:scale-105"
          >
            <span class="text-lg">💻</span>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ref, computed, onMounted } from "vue"
import { marked } from "marked"
import { useApi } from "@/composables/useApi"
import { useDeviceId } from "@/composables/useDeviceId"

import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

const showModal = ref(false)
const activeIndex = ref(0)

const openModal = (index) => {
  activeIndex.value = index
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const route = useRoute()
const slug = route.params.slug

const project = ref(null)
const error = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await useApi(`api/projects/${slug}`)
    project.value = res

    const { getDeviceId } = useDeviceId()
    const deviceId = getDeviceId()

    await useApi(`api/views/${slug}`, {
      method: "POST",
      body: {
        deviceId,
      },
    })
  } catch (err) {
    console.error("❌ Failed to fetch project:", err)
    error.value = err
  } finally {
    isLoading.value = false
  }
})

marked.setOptions({
  breaks: true,
  gfm: true,
  sanitize: false,
})

const renderedContent = computed(() => {
  if (!project.value?.content) return ""
  try {
    return marked.parse(project.value.content)
  } catch (err) {
    console.error("Markdown parse error:", err)
    return project.value.content
  }
})
</script>

<style>
.swiper-pagination-bullet {
  background-color: #94a3b8; /* slate-400 */
  opacity: 0.6;
}
.swiper-pagination-bullet-active {
  background-color: #22d3ee; /* cyan-400 */
  opacity: 1;
}
.swiper-pagination-bullet {
  background-color: #94a3b8; /* gray-400 */
  opacity: 0.6;
}
.swiper-pagination-bullet-active {
  background-color: #22d3ee; /* cyan-400 */
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
