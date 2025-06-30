<template>
  <div class="min-h-screen bg-[#0d1117] text-white p-6">
    <button
      @click="handleLogout"
      class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
    >
      Logout
    </button>
    <h1 class="text-3xl text-cyan-400 font-bold">Welcome, Admin</h1>
    <p class="mt-4">This is a protected page only for logged-in users.</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
})
import { useRouter } from "vue-router"

const router = useRouter()
const { logout } = useAuth()
const { setFlash } = useFlash()

const handleLogout = () => {
  logout()
  setFlash("Logged out successfully!")
  router.push("/admin/login")
}
</script>
