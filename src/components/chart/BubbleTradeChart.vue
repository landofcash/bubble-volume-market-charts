<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useTradesStore } from '@/stores/tradesStore.js'
import BubbleTradeChart from '@/utils/BubbleTradeChart.js'

let chartInstance = null
const chartContainer = ref(null)
const tradesStore = useTradesStore()
const isLoading = ref(false) // Loading state
const logMessages = ref([]) // Stores log messages

const config = {
  symbol: tradesStore.symbol,
  updateIntervalMs: 500,
  apiLimit: 10000,
  historyHours: 2,
  historicTradesLimit: 100,
  colors: {
    buy: { fill: "rgba(0, 255, 0, 0.5)", border: "rgba(0, 100, 0, 1)" },
    sell: { fill: "rgba(255, 0, 0, 0.5)", border: "rgba(100, 0, 0, 1)" }
  }
}

const updateTrades = (newTrades) => {
  tradesStore.trades = newTrades
}

const setLoading = (status) => {
  isLoading.value = status
}

// Logs messages and keeps only the last 10 entries
const logMessage = (message, level = "info") => {
  const timestamp = new Date().toLocaleTimeString()
  logMessages.value.unshift({ message, level, timestamp })

  // Keep only the last 10 messages
  if (logMessages.value.length > 10) {
    logMessages.value.pop()
  }
}

const initializeChart = async () => {
  if (chartContainer.value) {
    if (chartInstance) {
      chartInstance.stop()
      chartInstance.destroy()
    }
    chartInstance = new BubbleTradeChart(
      chartContainer.value.getContext('2d'),
      config,
      updateTrades,
      setLoading,
      logMessage
    )
    await chartInstance.start()
  }
}

// 🔥 Watch for symbol changes & restart the chart
watch(() => tradesStore.symbol, async (newSymbol) => {
  config.symbol = newSymbol
  tradesStore.trades = [] // Clear trades when switching symbols
  await initializeChart()
})

onMounted(() => {
  initializeChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.stop()
    chartInstance.destroy()
  }
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto relative">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
      <div class="text-lg font-semibold text-gray-700 mb-2">Loading data...</div>

      <!-- Log Messages -->
      <div class="w-3/4 max-h-40 overflow-auto text-xs text-gray-700 bg-gray-100 p-2 rounded shadow">
        <ul>
          <li v-for="(log, index) in logMessages" :key="index"
              :class="{
                'text-red-500': log.level === 'error',
                'text-yellow-500': log.level === 'warning',
                'text-gray-500': log.level === 'info',
                'text-gray-500': log.level === 'debug',
                'text-gray-500': log.level === 'trace',
              }">
            [{{ log.timestamp }}] {{ log.message }}
          </li>
        </ul>
      </div>
    </div>

    <canvas ref="chartContainer"></canvas>
  </div>
</template>
