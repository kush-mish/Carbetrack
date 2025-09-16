<script setup>
import { Bars3BottomLeftIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar always on top -->
    <div class="navbar bg-base-100 z-10 fixed top-0">
      <div class="block lg:hidden">
        <label for="sidebar-drawer" class="btn btn-ghost btn-square">
          <Bars3BottomLeftIcon class="size-6" />
        </label>
      </div>
      <div class="flex-1 px-4">
        <h1 class="text-lg font-bold text-primary">Carbon Emissions Tracker</h1>
      </div>
    </div>
    <!-- Drawer below navbar -->
    <div class="drawer lg:drawer-open flex-1">
      <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col pt-16">
        <div class="p-8">
          <router-view />
        </div>
      </div>
      <div class="drawer-side z-9 pt-16">
        <label for="sidebar-drawer" class="drawer-overlay"></label>
        <aside class="p-4 w-64 h-full bg-base-100 text-base-content border-r border-base-300">
          <ul class="list">
            <li class="list-row">
              <RouterLink to="/" class="btn btn-ghost" :class="{ 'btn-active': $route.path === '/' }">
                Dashboard
              </RouterLink>
            </li>
            <li class="list-row">
              <RouterLink to="/projects" class="btn btn-ghost" :class="{ 'btn-active': $route.path === '/projects' }">
                Projects
              </RouterLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
