<script setup>
import Header from '@/components/header/HeaderMain.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <Header />
    <main class="flex w-full flex-1 p-4 gap-4">
      <slot />
    </main>
  </div>
</template>

