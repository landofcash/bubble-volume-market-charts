<script setup>
import ContactPanel from '@/components/ContactPanel.vue'
</script>

<template>
  <div class="h-screen w-full overflow-y-auto bg-gray-100">
    <div class="flex justify-center items-start min-h-screen py-10">
      <div class="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">About This Project</h1>

        <p class="text-gray-700 leading-relaxed mb-6">
          This is a <strong>real-time cryptocurrency trading dashboard</strong> built using modern web technologies.
          It features <strong>live market data</strong>, an <strong>interactive trade visualization</strong>, and a
          <strong>fully responsive UI</strong> for a seamless experience.
          <br><br>
          <strong>This project was created from scratch in just 3 days.</strong> It serves as a <strong>technology test</strong> and
          a <strong>proof of concept</strong> for integrating <strong>Binance API</strong> with <strong>WebSockets</strong> to deliver
          real-time trading data in a high-performance frontend environment.
        </p>

        <h2 class="text-xl font-semibold text-gray-900 mb-4">🛠️ Technologies Used</h2>

        <div class="grid grid-cols-2 gap-4 text-gray-700">
          <div><strong>Vue.js 3</strong> – Reactive JavaScript framework.</div>
          <div><strong>WebSockets</strong> – Real-time trade updates.</div>
          <div><strong>Vite</strong> – Fast build tool with hot reload.</div>
          <div><strong>Pinia</strong> – Global state management.</div>
          <div><strong>Vue Router</strong> – Client-side routing.</div>
          <div><strong>Chart.js</strong> – Real-time trade visualization.</div>
          <div><strong>Tailwind CSS</strong> – Utility-first CSS framework.</div>
          <div><strong>Headless UI</strong> – Accessible UI components.</div>
          <div><strong>Binance API</strong> – Fetching live crypto trades.</div>
          <div><strong>Moment.js</strong> – Handling time-based chart data.</div>
        </div>

        <h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">🔥 Key Features</h2>

        <ul class="space-y-2 text-gray-700">
          <li><strong>Real-time Trade Visualization</strong> – Displays buy/sell trades dynamically.</li>
          <li><strong>Responsive UI</strong> – Styled with Tailwind CSS.</li>
          <li><strong>Live Market Data</strong> – Uses WebSockets for real-time updates.</li>
          <li><strong>Custom Symbol Selection</strong> – Instant trading pair switching.</li>
          <li><strong>Trade History</strong> – Tracks recent transactions.</li>
          <li><strong>Update Intervals</strong> – Efficiently throttled updates.</li>
          <li><strong>State Management</strong> – Pinia ensures smooth data flow.</li>
          <li><strong>Logging System</strong> – Debugging & performance insights.</li>
          <li><strong>Optimized Build</strong> – Uses Vite for fast builds.</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-900 mt-6 mb-4">🚀 Why This Project Stands Out</h2>

        <p class="text-gray-700 leading-relaxed">
          This project is a fully functional trading dashboard, demonstrating expertise in:
        </p>

        <ul class="space-y-2 text-gray-700">
          <li><strong>Performance Optimization</strong> – REST API, WebSockets, throttled updates.</li>
          <li><strong>Live Data Streaming</strong> – WebSocket trade management.</li>
          <li><strong>Scalable UI Design</strong> – Built with Tailwind CSS & Headless UI.</li>
          <li><strong>Modular & Maintainable Codebase</strong> – Vue 3, Composition API.</li>
          <li><strong>State Management</strong> – Pinia for real-time updates.</li>
        </ul>

        <p class="text-gray-700 mt-6">
          If you're looking for a <strong>Vue.js Developer</strong>, feel free to reach out 📡!
        </p>

        <div class="mt-6">
          <ContactPanel />
        </div>
      </div>
    </div>
  </div>
</template>
