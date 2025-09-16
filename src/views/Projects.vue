<script setup>

import { ref } from 'vue'

const drawerOpen = ref(false)

const newProject = ref({
  name: '',
  location: '',
  createdAt: '',
  totalEmissions: 0
})

function openDrawer() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function addProject() {
  if (!newProject.value.name || !newProject.value.location || !newProject.value.createdAt) return
  projects.value.push({
    name: newProject.value.name,
    location: newProject.value.location,
    createdAt: newProject.value.createdAt,
  })
  newProject.value = { name: '', location: '', createdAt: '', totalEmissions: 0 }
  closeDrawer()
}

const projects = ref([
  { id: 1, name: 'Solar Farm', location: 'California', createdAt: '2025-01-10', totalEmissions: 1200 },
  { id: 2, name: 'Wind Park', location: 'Texas', createdAt: '2025-02-15', totalEmissions: 800 },
  { id: 3, name: 'Hydro Plant', location: 'Oregon', createdAt: '2025-03-20', totalEmissions: 950 },
  { id: 4, name: 'Urban Solar', location: 'New York', createdAt: '2025-04-05', totalEmissions: 600 },
])
</script>

<template>
  <div class="flex flex-col mb-8 space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Projects Management</h1>
      <button class="btn btn-primary" @click="openDrawer">Add New Project</button>
    </div>
    <div class="overflow-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Created At</th>
            <th>Total Emissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="hover:bg-base-300">
            <td>{{ project.id }}</td>
            <td>{{ project.name }}</td>
            <td>{{ project.location }}</td>
            <td>{{ project.createdAt }}</td>
            <td>{{ project.totalEmissions }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="drawer drawer-end">
      <input id="add-new-project-drawer" type="checkbox" class="drawer-toggle" :checked="drawerOpen" />
      <div class="drawer-side">
        <div class="flex flex-col space-y-4 bg-base-200 w-full md:w-120 h-full p-8 shadow-lg">
          <h2 class="text-xl font-bold">New Project</h2>
          <fieldset class="fieldset space-y-2">
            <legend class="fieldset-legend">Name</legend>
            <input class="input w-full" type="text" v-model="newProject.name" placeholder="e.g. Solar Farm" />
          </fieldset>
          <fieldset class="fieldset space-y-2">
            <legend class="fieldset-legend">Location</legend>
            <input class="input w-full" type="text" v-model="newProject.location" placeholder="e.g. California" />
          </fieldset>
          <fieldset class="fieldset space-y-2">
            <legend class="fieldset-legend">Date</legend>
            <input class="input w-full" type="date" v-model="newProject.createdAt" />
          </fieldset>

          <button class="btn btn-primary mt-4" @click="addProject">Add Project</button>
          <label class="btn btn-ghost" @click="closeDrawer">Cancel</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
