<script setup>
import BubbleTradeChart from '@/components/chart/BubbleTradeChart.vue'
import TradesView from '@/components/chart/TradesList.vue'
import ConfigPanel from '@/components/chart/ConfigPanel.vue'
import { useTradesStore } from '@/stores/tradesStore.js'

const tradesStore = useTradesStore()
</script>

<template>
  <div class="flex flex-1 w-full p-4 gap-4">
    <!-- Chart Section (Left) -->
    <div class="flex-[3] bg-gray-100 dark:bg-gray-800 p-4 pb-4 rounded shadow-md">
      <h1 class="text-xl font-bold text-gray-700 dark:text-gray-100 mb-2">
        <span class="font-bold">{{tradesStore.symbol}}</span>
       Bubble Trade Chart</h1>
      <BubbleTradeChart />
    </div>

    <!-- Right Panel (Config Panel + Trades List) -->
    <div class="flex flex-col flex-[1] rounded bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
      <ConfigPanel />
      <TradesView />
    </div>
  </div>
</template>
