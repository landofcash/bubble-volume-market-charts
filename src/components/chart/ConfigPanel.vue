<script setup>
import { useTradesStore } from '@/stores/tradesStore.js'

const tradesStore = useTradesStore()

const binancePairs = [
  "BTCUSDT", "ETHUSDT", "ALGOUSDT", "TRXUSDT", "HBARUSDT", "XRPUSDT"
]

// Function to switch symbol
const switchSymbol = (symbol) => {
  tradesStore.setSymbol(symbol)
}
</script>

<template>
  <div class="flex flex-col p-4 mb-4 bg-white dark:bg-gray-700 shadow-md rounded">
    <h2 class="text-sm font-bold text-gray-700 dark:text-gray-100 text-center mb-2">Select Symbol</h2>
    <div class="grid grid-cols-2 gap-2">
      <button v-for="symbol in binancePairs" :key="symbol"
              @click="switchSymbol(symbol)"
              class="text-xs px-2 py-1 rounded transition"
              :class="{
                'bg-blue-700 text-white font-bold': tradesStore.symbol === symbol,
                'bg-blue-500 text-white hover:bg-blue-600': tradesStore.symbol !== symbol
              }">
        {{ symbol }}
      </button>
    </div>
  </div>
</template>
