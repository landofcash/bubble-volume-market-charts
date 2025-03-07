<script setup>
defineProps({
  logMessages: Array
})
</script>

<template>
  <div class="w-3/4 max-h-40 overflow-auto text-xs text-gray-700 bg-gray-100 p-2 rounded shadow">
    <ul>
      <li v-for="(log, index) in logMessages" :key="index"
          :class="{
            'text-red-500': log.level === 'error',
            'text-yellow-500': log.level === 'warning',
            'text-slate-500': log.level === 'info',
            'text-gray-500': log.level === 'debug',
            'text-zinc-500': log.level === 'trace',
          }">
        [{{ log.timestamp }}] {{ log.message }}
      </li>
    </ul>
  </div>
</template>
