<template>
  <div
    class="min-h-screen bg-[#0d1117] text-white flex items-center justify-center px-4"
  >
    <div class="bg-[#161b22] p-8 rounded-lg w-full max-w-md space-y-6 shadow">
      <h1 class="text-2xl font-bold text-cyan-400 text-center">Admin Login</h1>

      <form @submit.prevent="loginHandler">
        <input
          v-model="username"
          placeholder="Username"
          class="w-full p-2 rounded bg-[#0d1117] border border-gray-700 mb-4"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full p-2 rounded bg-[#0d1117] border border-gray-700 mb-6"
        />

        <button
          type="submit"
          class="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded"
        >
          Login
        </button>
      </form>

      <p v-if="error && error.length" class="text-red-400 text-sm text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "guest-only",
})
useMeta({
  title: "Login",
  description: "Admin login page",
  indexable: false, // Prevent search engines from indexing admin
})
import { useRouter } from "vue-router"
const router = useRouter()

const username = ref("")
const password = ref("")
const error = ref("")

const { login, isLoggedIn } = useAuth()
const { setFlash } = useFlash()
const config = useRuntimeConfig()

const loginHandler = async () => {
  try {
    const res = await $fetch(`${config.public.API_BASE_URL}/api/auth/login`, {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    })

    login(res.token) // 🔐 set token
    setFlash("Login successful!")
    router.push("/admin/dashboard")
  } catch (err) {
    error.value = err?.data?.message || "Login failed"
    setFlash(error.value)
  }
}
</script>
