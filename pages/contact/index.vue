<template>
  <section
    class="min-h-screen bg-[#0d1117] text-white px-6 py-20 flex items-center justify-center"
  >
    <div class="max-w-2xl w-full text-center space-y-10">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-cyan-400">
        Contact Me
      </h1>
      <p class="text-gray-400 text-lg">
        Got a project or question? Let's talk via WhatsApp. Just drop your info
        below!
      </p>

      <form
        @submit.prevent="handleSubmit"
        class="space-y-10 text-left bg-[#161b22]/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50"
      >
        <!-- Name and Email Row - Using Flexbox -->
        <div class="flex flex-col md:flex-row gap-8">
          <div class="flex-1 space-y-3">
            <label class="block mt-10 text-base font-medium text-gray-300">
              Full Name
              <span class="text-cyan-400 ml-1">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter your full name"
                class="w-full px-6 py-5 rounded-xl bg-[#161b22] text-white placeholder-gray-500 border-2 border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div class="flex-1 space-y-3">
            <label
              class="block mt-10 md:mt-10 text-base font-medium text-gray-300"
            >
              Email Address
              <span class="text-cyan-400 ml-1">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.email"
                type="email"
                placeholder="your.email@example.com"
                class="w-full px-6 py-5 rounded-xl bg-[#161b22] text-white placeholder-gray-500 border-2 border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300"
                required
              />
            </div>
          </div>
        </div>

        <!-- Message Field -->
        <div class="space-y-3">
          <label class="block text-base font-medium text-gray-300">
            Your Message
            <span class="text-cyan-400 ml-1">*</span>
          </label>
          <div class="relative">
            <textarea
              v-model="form.message"
              rows="5"
              placeholder="Tell me about your project, ideas, or questions. I'd love to hear from you!"
              class="w-full px-6 py-5 rounded-xl bg-[#161b22] text-white placeholder-gray-500 border-2 border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 resize-none leading-relaxed"
              required
            ></textarea>
            <div class="absolute bottom-3 right-3 text-xs text-gray-500">
              {{ form.message.length }}/500
            </div>
          </div>
        </div>

        <div class="text-center pt-4">
          <button
            type="submit"
            class="w-3/4 py-4 px-4 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition"
          >
            Send Message via WhatsApp
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue"
useMeta({
  title: "Contact Jekk",
  description: "Welcome to my portfolio website!",
})
// Replace with your WhatsApp number (in international format, no "+" or spaces)
const whatsappNumber = "62895625047784"

const form = reactive({
  name: "",
  email: "",
  message: "",
})

function handleSubmit() {
  const encodedMessage = encodeURIComponent(
    `Hello, my name is ${form.name}.\n\nEmail: ${form.email}\n\nMessage:\n${form.message}`
  )

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

  // Redirect to WhatsApp
  window.open(whatsappURL, "_blank")
}
</script>
