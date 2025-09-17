<script setup>
import { ref, computed } from 'vue';
import { useFirestore, useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import EmissionsLogger from '@/components/EmissionsLogger.vue';
import EmissionsByProject from '@/components/charts/EmissionsByProject.vue';
import EmissionsOverTime from '@/components/charts/EmissionsOverTime.vue';

const drawerOpen = ref(false);

function openDrawer() {
  drawerOpen.value = true;
}
function closeDrawer() {
  drawerOpen.value = false;
}

const db = useFirestore();
const projectsCollection = collection(db, 'projects');
const projects = useCollection(projectsCollection);
const emissionsCollection = collection(db, 'emissions');
const emissions = useCollection(emissionsCollection);

const totalEmissions = computed(() => {
  return projects.value.reduce((sum, project) => sum + (project.totalEmissions || 0), 0).toFixed(2);
});

</script>

<template>
  <div class="flex flex-col mb-8 space-y-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <button class="btn btn-primary" @click="openDrawer">Log Emissions</button>
    </div>
    <!-- Total Emissions -->
    <div class="card card-border bg-base-100 text-center">
      <div class="card-body flex flex-col items-center">
        <h2 class="card-title">Total Emissions</h2>
        <p class="text-4xl font-bold">{{ totalEmissions }} CO₂e</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Emissions by Project -->
      <div class="card card-border bg-base-100">
        <div class="card-body">
          <h2 class="card-title">Emissions by Project</h2>
          <EmissionsByProject :projects="projects" />
        </div>
      </div>
      <!-- Emissions Over Time -->
      <div class="card card-border bg-base-100">
        <div class="card-body">
          <h2 class="card-title">Emissions Over Time</h2>
          <EmissionsOverTime :emissions="emissions" />
        </div>
      </div>
    </div>

    <EmissionsLogger :open="drawerOpen" :close="closeDrawer" @saved="closeDrawer" />
  </div>
</template>

<style scoped></style>
