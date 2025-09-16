<script setup>

import { ref } from 'vue'
import { useFirestore, useCollection } from 'vuefire'
import { collection, addDoc, query, orderBy, limit } from 'firebase/firestore'
import { format } from 'date-fns'

const drawerOpen = ref(false)

const newProject = ref({
  name: '',
  location: '',
  createdAt: new Date(),
  totalEmissions: 0
})

function openDrawer() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

const db = useFirestore()
const projectsCollection = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50))
const projects = useCollection(projectsCollection)

async function addProject() {
  if (!newProject.value.name || !newProject.value.location || !newProject.value.createdAt) return
  try {
    await addDoc(projectsCollection, {
      name: newProject.value.name,
      location: newProject.value.location,
      createdAt: new Date(newProject.value.createdAt),
      totalEmissions: newProject.value.totalEmissions,
    })
    newProject.value = { name: '', location: '', createdAt: new Date(), totalEmissions: 0 }
    closeDrawer()
  } catch (e) {
    alert('Failed to add project: ' + e.message)
  }
}
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
            <td>{{ format(project.createdAt.toDate(), 'MMM dd, yyyy') }}</td>
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
            <input class="input w-full" type="date" :value="format(newProject.createdAt, 'yyyy-MM-dd')"
              @input="newProject.createdAt = new Date($event.target.value)" />
          </fieldset>

          <button class="btn btn-primary mt-4" @click="addProject">Add Project</button>
          <label class="btn btn-ghost" @click="closeDrawer">Cancel</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
