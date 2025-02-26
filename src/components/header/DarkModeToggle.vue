<script setup>
import { ref, onMounted } from 'vue'

// Detect user's saved preference
const isDark = ref(localStorage.getItem('theme') === 'dark')

// Apply the theme
const setTheme = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  setTheme(isDark.value)
}

// Apply stored theme on mount
onMounted(() => {
  setTheme(isDark.value)
})
</script>

<template>
  <button @click="toggleDarkMode" class="p-2 hover:cursor-pointer">
    <span v-if="isDark">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>
