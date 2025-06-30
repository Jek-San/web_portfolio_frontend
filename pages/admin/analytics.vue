<template>
  <section>
    <div class="p-6 text-white space-y-8">
      <h1 class="text-3xl font-bold text-cyan-400">📈 Analytics Overview</h1>

      <div v-if="pending">Loading analytics...</div>
      <div v-else>
        <h2 class="text-xl font-semibold mb-2">Views per Project</h2>
        <ul class="space-y-1 mb-6">
          <li
            v-for="entry in data.viewsByProject"
            :key="entry.projectSlug"
            class="flex justify-between border-b border-gray-700 py-1"
          >
            <span>{{ entry.projectSlug }}</span>
            <span class="text-cyan-300 font-bold">{{ entry._count }}</span>
          </li>
        </ul>

        <h2 class="text-xl font-semibold mb-2">Recent Views</h2>
        <div class="overflow-auto border border-gray-700 rounded">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-800 text-cyan-400">
              <tr>
                <th class="px-3 py-2 text-left">Project</th>
                <th class="px-3 py-2 text-left">Device</th>
                <th class="px-3 py-2 text-left">IP</th>
                <th class="px-3 py-2 text-left">User Agent</th>
                <th class="px-3 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="v in data.recentViews"
                :key="v.id"
                class="border-t border-gray-700 hover:bg-gray-800/50"
              >
                <td class="px-3 py-2">{{ v.projectSlug }}</td>
                <td class="px-3 py-2">{{ v.deviceId.slice(0, 8) }}...</td>
                <td class="px-3 py-2">{{ v.ip }}</td>
                <td class="px-3 py-2 truncate max-w-[200px]">
                  {{ v.userAgent }}
                </td>
                <td class="px-3 py-2 text-gray-400">
                  {{ new Date(v.createdAt).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

  <section class="min-h-screen bg-[#0d1117] text-white p-6">
    <h1 class="text-3xl font-bold mb-8 text-cyan-400">
      📊 Project View Analytics Chart
    </h1>

    <div v-if="loading" class="text-center text-gray-400">Loading chart...</div>
    <div v-else-if="error" class="text-red-400">
      ❌ Failed to load analytics
    </div>
    <div v-else>
      <BarChart :chartData="chartData" :chartOptions="chartOptions" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useApi } from "@/composables/useApi"
import BarChart from "@/components/BarChart.vue"

useMeta({
  title: "Analytics",
  description: "Project view tracking and insights.",
  indexable: false, // Prevent search engines from indexing admin
})
// Default reactive state for fetched analytics data
const data = ref({
  viewsByProject: [],
  recentViews: [],
})

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Views",
      backgroundColor: "#06b6d4",
      data: [],
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "#e5e7eb" },
    },
    x: {
      ticks: { color: "#e5e7eb" },
    },
  },
  plugins: {
    legend: { labels: { color: "#e5e7eb" } },
  },
}

const loading = ref(true)
const error = ref(false)
const pending = ref(true)

onMounted(async () => {
  try {
    const res = await useApi("api/views/analytics")

    // Save full response to local state
    data.value = res

    // Chart mapping
    chartData.value.labels = res.viewsByProject.map((v) => v.projectSlug)
    chartData.value.datasets[0].data = res.viewsByProject.map((v) => v._count)
  } catch (err) {
    console.error("❌ Analytics error:", err)
    error.value = true
  } finally {
    loading.value = false
    pending.value = false
  }
})
</script>
