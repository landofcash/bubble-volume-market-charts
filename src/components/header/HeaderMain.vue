<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import LogoMain from '@/components/header/LogoMain.vue'
import DarkModeToggle from '@/components/header/DarkModeToggle.vue'

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const route = useRoute()
const isActive = (item) => computed(() => route.path === item.path)
</script>

<template>
  <header class="bg-gray-900 text-white p-4 shadow-md">
    <div class="container mx-auto flex items-center">
      <!-- Logo on the Left -->
      <LogoMain />

      <!-- Navigation Menu (Right-aligned) -->
      <nav class="hidden md:flex space-x-6 ml-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="hover:text-gray-400"
          :class="{ 'text-blue-400 font-semibold': isActive(item).value }">
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Mobile Menu Button (Right-aligned with Dark Mode Toggle) -->
      <div class="flex items-center ml-6">
        <Menu as="div" class="relative md:hidden">
          <MenuButton class="px-3 py-2 bg-gray-800 rounded-md"> ☰ </MenuButton>
          <MenuItems class="absolute right-0 mt-2 w-48 bg-gray-900 text-white border border-gray-700 rounded shadow-lg">
            <MenuItem v-for="item in menuItems" :key="item.path" v-slot="{ active }">
              <router-link
                :to="item.path"
                :class="{
                  'bg-gray-700': active,
                  'text-blue-400 font-semibold': isActive(item).value,
                }"
                class="block px-4 py-2"
              >
                {{ item.name }}
              </router-link>
            </MenuItem>
          </MenuItems>
        </Menu>

        <!-- Dark Mode Toggle -->
        <DarkModeToggle class="ml-4" />
      </div>
    </div>
  </header>
</template>
