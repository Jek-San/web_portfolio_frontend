// import tailwindcss from "@tailwindcss/vite"
// export default defineNuxtConfig({
//   compatibilityDate: "2025-05-15",
//   devtools: { enabled: true },
//   css: ["~/assets/css/main.css"],
//   vite: {
//     plugins: [tailwindcss()],
//   },

//   modules: ["@nuxt/image", "@nuxt/eslint", "@nuxt/icon", "@nuxt/ui"],
// })

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: "static",
  },
  image: {
    provider: "ipx", // fallback to default IPX
    domains: ["webportfoliobackend-production.up.railway.app"],
  },

  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
    },
  },
  css: [
    "@vueup/vue-quill/dist/vue-quill.snow.css",
    "~/assets/css/main.css",
    "~/assets/css/quill-dark.css",
  ],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/ui",
  ],
})
