<script setup>
import { Bars3BottomLeftIcon, ChartPieIcon, BuildingOffice2Icon } from '@heroicons/vue/24/solid'
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
        <h1 class="text-lg font-bold text-base">Carbon Emissions Tracker</h1>
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
          <ul class="flex flex-col gap-2">
            <li class="flex flex-col">
              <RouterLink to="/" class="btn btn-ghost justify-start" :class="{ 'btn-active': $route.path === '/' }">
                <ChartPieIcon class="size-6 mr-2" />
                Dashboard
              </RouterLink>
            </li>
            <li class="flex flex-col">
              <RouterLink to="/projects" class="btn btn-ghost justify-start"
                :class="{ 'btn-active': $route.path === '/projects' }">
                <BuildingOffice2Icon class="size-6 mr-2" />
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
