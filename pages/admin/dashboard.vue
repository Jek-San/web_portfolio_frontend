<template>
  <div class="min-h-screen bg-[#0d1117] text-white p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl text-cyan-400 font-bold">Welcome, Admin</h1>
      <button
        @click="handleLogout"
        class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white transition"
      >
        Logout
      </button>
    </div>

    <p class="mb-6 text-gray-400">
      This is a protected dashboard page only for logged-in users.
    </p>

    <!-- Grid Menu -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/" class="dashboard-card">
        <span class="text-4xl mb-2">🏠</span>
        <span class="text-xl font-semibold">Go to Home</span>
      </NuxtLink>
      <NuxtLink to="/admin/analytics" class="dashboard-card">
        <span class="text-4xl mb-2">📊</span>
        <span class="text-xl font-semibold">Analytics</span>
      </NuxtLink>

      <NuxtLink to="/admin/projects" class="dashboard-card">
        <span class="text-4xl mb-2">💼</span>
        <span class="text-xl font-semibold">Projects</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
})
useMeta({
  title: "Admin Dashboard",
  description: "Admin dashboard for Jekk",
  indexable: false, // Prevent search engines from indexing admin
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

<style scoped>
.dashboard-card {
  background-color: #1a202c;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition:
    background-color 0.2s ease-in-out,
    transform 0.2s ease-in-out;
  cursor: pointer;
}

.dashboard-card:hover {
  background-color: #1e293b;
  transform: scale(1.05);
}
</style>
