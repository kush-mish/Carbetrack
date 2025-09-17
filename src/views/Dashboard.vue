<script setup>
import { ref, computed } from 'vue';
import { useFirestore, useCollection } from 'vuefire';
import { collection, addDoc, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

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

const materialsCollection = collection(db, 'materials');
const materials = useCollection(materialsCollection);

const logForm = ref({
  projectId: null,
  material: null,
  quantity: 0,
  unit: null,
  emissionFactor: 0,
  date: format(new Date(), 'yyyy-MM-dd'),
});

const selectedMaterial = computed(() => materials.value.find(m => m.name === logForm.value.material));
const emissionFactor = computed(() => {
  return selectedMaterial.value ? selectedMaterial.value.emissionFactor : 0;
});
const unit = computed(() => {
  return selectedMaterial.value ? selectedMaterial.value.unit : '';
});
const totalCO2 = computed(() => {
  const q = parseFloat(logForm.value.quantity);
  return isNaN(q) ? 0 : q * emissionFactor.value;
});

async function saveLog() {
  if (!logForm.value.projectId || !logForm.value.material || !logForm.value.quantity || !logForm.value.date) return;
  try {
    await addDoc(collection(db, 'emissions'), {
      projectId: logForm.value.projectId,
      material: logForm.value.material,
      quantity: parseFloat(logForm.value.quantity),
      unit: unit.value,
      emissionFactor: emissionFactor.value,
      totalCO2: totalCO2.value,
      date: new Date(logForm.value.date),
    });

    await updateDoc(doc(db, 'projects', logForm.value.projectId), {
      totalEmissions: (projects.value.find(p => p.id === logForm.value.projectId)?.totalEmissions || 0) + totalCO2.value,
    });

    logForm.value = {
      projectId: null,
      material: null,
      quantity: 0,
      unit: null,
      emissionFactor: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
    };

    closeDrawer();
  } catch (e) {
    alert('Failed to log emissions: ' + e.message);
  }
}

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
          <p class="text-4xl font-bold">{{ totalEmissions }} tCO₂e</p>
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

    <!-- Log emissions drawer -->
    <div class="drawer drawer-end">
      <input id="log-emissions-drawer" type="checkbox" class="drawer-toggle" :checked="drawerOpen" />
      <div class="drawer-side">
        <div class="flex flex-col space-y-4 bg-base-200 w-full md:w-120 h-full p-8 shadow-lg">
          <h2 class="text-xl font-bold">Log Emissions</h2>
          <form class="space-y-4" @submit.prevent="saveLog">
            <fieldset class="fieldset space-y-2">
              <legend class="fieldset-legend">Project</legend>
              <select class="select w-full" v-model="logForm.projectId" required>
                <option value="" disabled>Select project</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
            </fieldset>
            <fieldset class="fieldset space-y-2">
              <legend class="fieldset-legend">Material</legend>
              <select class="select w-full" v-model="logForm.material" @change="updateMaterial" required>
                <option value="" disabled>Select material</option>
                <option v-for="mat in materials" :key="mat.name" :value="mat.name">
                  {{ mat.name }}
                </option>
              </select>
            </fieldset>
            <fieldset class="fieldset space-y-2">
              <legend class="fieldset-legend">Quantity ({{ logForm.unit || 'unit' }})</legend>
              <input class="input w-full" type="number" min="0" step="any" v-model="logForm.quantity" required />
            </fieldset>
            <fieldset class="fieldset space-y-2">
              <legend class="fieldset-legend">Date</legend>
              <input class="input w-full" type="date" v-model="logForm.date" required />
            </fieldset>
            <div class="flex items-center space-x-2">
              <span class="font-semibold">Emission Factor:</span>
              <span>{{ emissionFactor }} kg CO₂/{{ unit || 'unit' }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-semibold">Total CO₂:</span>
              <span>{{ totalCO2 }} kg</span>
            </div>
            <button class="btn btn-primary w-full mt-2" type="submit">Save</button>
            <label class="btn btn-ghost w-full" @click="closeDrawer">Cancel</label>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
