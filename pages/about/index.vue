<template>
  <section
    class="min-h-screen bg-[#0d1117] text-white px-6 py-20 flex items-center justify-center"
  >
    <div class="max-w-4xl w-full text-center space-y-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-cyan-400">
        About Me
      </h1>

      <p class="text-gray-400 text-lg leading-relaxed">
        Hey there! I’m a passionate
        <span class="text-cyan-300 font-semibold">developer</span> who loves
        building clean, performant, and user-focused applications. Whether it’s
        working on the frontend UI/UX or the backend logic, I thrive on solving
        problems with code.
      </p>

      <p class="text-gray-400 text-lg leading-relaxed">
        My journey started with curiosity and a cup of coffee ☕ — and since
        then, I’ve built web apps, collaborated with teams, and explored
        technologies from Vue and Tailwind to Node and Python. I also enjoy
        creating side projects and portfolios like the one you’re looking at
        right now.
      </p>

      <div class="flex flex-col sm:flex-row justify-center gap-6 pt-8">
        <div class="bg-[#161b22] p-6 rounded-xl shadow-md w-full sm:w-1/2">
          <h3 class="text-xl text-cyan-400 font-semibold mb-2">
            🛠 Tech Stack
          </h3>
          <p class="text-gray-400">
            Vue, Nuxt, Tailwind, Node.js, Express, MongoDB
          </p>
        </div>
        <div class="bg-[#161b22] p-6 rounded-xl shadow-md w-full sm:w-1/2">
          <h3 class="text-xl text-cyan-400 font-semibold mb-2">💡 Interests</h3>
          <p class="text-gray-400">
            UI Design, Automation, Freelancing, Productivity Tools
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No logic needed for static content

import { useMeta } from "@/utils/meta"

useMeta({
  title: "About Me",
  description: "Learn more about my background, journey, and skills.",
})
</script>
