<script setup lang="ts">
import ContactPanel from '@/components/ContactPanel.vue'
</script>

<template>
  <div class="h-screen w-full overflow-y-auto bg-gray-100">
    <!-- Centered Content Wrapper -->
    <div class="flex justify-center items-start min-h-screen py-10">
      <!-- Main Content (Fixed Width, Scrolling Outside) -->
      <div class="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <ContactPanel></ContactPanel>
      </div>
    </div>
  </div>
</template>
