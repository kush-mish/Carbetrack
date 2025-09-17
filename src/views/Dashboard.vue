<script setup>
import { ref, computed } from 'vue';
import { useFirestore, useCollection } from 'vuefire';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import EmissionsLogger from '@/components/EmissionsLogger.vue';

const drawerOpen = ref(false);

function openDrawer() {
  drawerOpen.value = true;
}
function closeDrawer() {
  drawerOpen.value = false;
}

const db = useFirestore();
const projectsCollection = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(50));
const projects = useCollection(projectsCollection);

const totalEmissions = computed(() => {
  return projects.value.reduce((sum, project) => sum + (project.totalEmissions || 0), 0).toFixed(2);
});

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <button class="btn btn-primary" @click="openDrawer">Log Emissions</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Emissions -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Total Emissions</h2>
          <p class="text-4xl font-bold">{{ totalEmissions }} CO₂e</p>
        </div>
      </div>
      <!-- Emissions by Project -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Emissions by Project</h2>
        </div>
      </div>
      <!-- Emissions Over Time -->
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Emissions Over Time</h2>
        </div>
      </div>
    </div>

    <EmissionsLogger :open="drawerOpen" :close="closeDrawer" @saved="closeDrawer" />
  </div>
</template>

<style scoped></style>
