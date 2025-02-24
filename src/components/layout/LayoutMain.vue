<script setup>
import Header from '@/components/header/HeaderMain.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <Header />
    <main class="flex-1 flex items-center justify-center overflow-hidden">
      <slot />
    </main>
  </div>
</template>

