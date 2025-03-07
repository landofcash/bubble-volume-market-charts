<script setup>
import LoggingPanel from '@/components/LoggingPanel.vue'

defineProps({
  isLoading: { type: Boolean, default: false },
  loadingMessage: { type: String, default: "...Loading data..." },
  logMessages: { type: Array, default: () => [] },
})
</script>

<template>
  <div
    v-if="isLoading"
    class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-80 z-10"
  >
    <div class="text-lg font-semibold text-gray-700 mb-2">{{loadingMessage}}</div>
    <LoggingPanel :logMessages="logMessages" />
  </div>
</template>
