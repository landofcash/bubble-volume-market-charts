<script setup>
import { useTradesStore } from '@/stores/tradesStore.js'

const tradesStore = useTradesStore()
</script>

<template>
  <div class="w-full h-full p-4 bg-white shadow-md rounded">
    <h2 class="text-lg font-bold text-gray-700 mb-3">Recent Trades</h2>

    <!-- Table Header -->
    <div class="flex justify-between px-2 py-1 bg-gray-200 text-xs font-semibold text-gray-600 rounded">
      <span class="w-1/3 text-left">Price</span>
      <span class="w-1/3 text-center">Volume</span>
      <span class="w-1/3 text-right">Time</span>
    </div>

    <!-- Trades List -->
    <ul class="overflow-auto max-h-[500px] text-xs mt-1">
      <li v-for="(trade, index) in tradesStore.trades" :key="index"
          class="flex justify-between" style="line-height: 20px;">
        <span class="w-1/3 text-left"
              :class="trade.side === 'Buy' ? 'text-green-500' : 'text-red-500'">
          {{ trade.price }}
        </span>
        <span class="w-1/3 text-center">{{ trade.volume }}</span>
        <span class="w-1/3 text-right">{{ trade.time }}</span>
      </li>
    </ul>
  </div>
</template>
