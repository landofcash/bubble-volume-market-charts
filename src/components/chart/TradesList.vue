<script setup>
import { useTradesStore } from '@/stores/tradesStore.js'

const tradesStore = useTradesStore()
</script>

<template>
  <div class="flex flex-col flex-1 p-4 bg-white dark:bg-gray-700 shadow-md rounded">
    <h2 class="text-sm font-bold text-gray-700 dark:text-gray-100 text-center mb-2">Recent Trades</h2>
    <!-- Table Header -->
    <div class="flex justify-between px-2 py-1 bg-gray-200
    dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400 rounded">
      <span class="w-1/3 text-left">Price</span>
      <span class="w-1/3 text-center">Volume</span>
      <span class="w-1/3 pr-8 text-right">Time</span>
    </div>

    <!-- Trades List -->
    <ul class="flex-grow h-0 overflow-auto text-xs mt-1 pb-2">
      <li v-for="(trade, index) in tradesStore.trades" :key="index"
          class="flex justify-between" style="line-height: 20px;">
        <span class="w-1/3 pl-2 text-left" :class="trade.side === 'Buy' ? 'text-green-500' : 'text-red-500'">
          {{ trade.price }}
        </span>
        <span class="w-1/3 text-center">{{ trade.volume }}</span>
        <span class="w-1/3 pr-2 text-right">{{ trade.time }}</span>
      </li>
    </ul>
  </div>
</template>
