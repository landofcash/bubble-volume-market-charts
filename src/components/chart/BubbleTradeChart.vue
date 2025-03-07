<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useTradesStore } from '@/stores/tradesStore.js'
import BubbleTradeChart from '@/utils/BubbleTradeChart.js'
import LoadingOverlay from '@/components/chart/LoadingOverlay.vue'

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
    sell: { fill: "rgba(255, 0, 0, 0.5)", border: "rgba(100, 0, 0, 1)" },
    buyCandle: { fill: "rgba(0, 255, 0, 0.3)", border: "rgba(0, 100, 0, 0.5)" },
    sellCandle: { fill: "rgba(255, 0, 0, 0.3)", border: "rgba(100, 0, 0, 0.5)" }
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
  <div class="w-full max-w-4xl mx-auto relative bg-white dark:bg-gray-700 p-4 rounded">
    <LoadingOverlay :isLoading="isLoading" :logMessages="logMessages" />
    <canvas ref="chartContainer"></canvas>
  </div>
</template>
