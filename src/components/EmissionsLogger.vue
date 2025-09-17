<script setup>
import { ref, computed } from 'vue';
import { useFirestore, useCollection } from 'vuefire';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';

const emit = defineEmits(['saved']);
const props = defineProps({
  open: Boolean,
  close: Function,
});

const db = useFirestore();
const projectsCollection = collection(db, 'projects');
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
const emissionFactor = computed(() => selectedMaterial.value ? selectedMaterial.value.emissionFactor : 0);
const unit = computed(() => selectedMaterial.value ? selectedMaterial.value.unit : '');
const totalEmissions = computed(() => {
  const q = parseFloat(logForm.value.quantity);
  return isNaN(q) ? 0 : q * emissionFactor.value;
});

function updateMaterial() {
  const mat = selectedMaterial.value;
  if (mat) {
    logForm.value.emissionFactor = mat.emissionFactor;
    logForm.value.unit = mat.unit;
  } else {
    logForm.value.emissionFactor = 0;
    logForm.value.unit = '';
  }
}

async function saveLog() {
  if (!logForm.value.projectId || !logForm.value.material || !logForm.value.quantity || !logForm.value.date) return;
  try {
    await addDoc(collection(db, 'emissions'), {
      projectId: logForm.value.projectId,
      material: logForm.value.material,
      quantity: parseFloat(logForm.value.quantity),
      unit: unit.value,
      emissionFactor: emissionFactor.value,
      totalEmissions: totalEmissions.value,
      date: new Date(logForm.value.date),
    });
    await updateDoc(doc(db, 'projects', logForm.value.projectId), {
      totalEmissions: (projects.value.find(p => p.id === logForm.value.projectId)?.totalEmissions || 0) + totalEmissions.value,
    });
    logForm.value = {
      projectId: null,
      material: null,
      quantity: 0,
      unit: null,
      emissionFactor: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    emit('saved');
    if (props.close) props.close();
  } catch (e) {
    alert('Failed to log emissions: ' + e.message);
  }
}
</script>

<template>
  <div class="drawer drawer-end">
    <input id="log-emissions-drawer" type="checkbox" class="drawer-toggle" :checked="props.open" />
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
            <legend class="fieldset-legend">Quantity ({{ unit || 'unit' }})</legend>
            <input class="input w-full" type="number" min="0" step="any" v-model="logForm.quantity" required />
          </fieldset>
          <fieldset class="fieldset space-y-2">
            <legend class="fieldset-legend">Date</legend>
            <input class="input w-full" type="date" v-model="logForm.date" required />
          </fieldset>
          <div class="flex items-center space-x-2">
            <span class="font-semibold">Emission Factor:</span>
            <span>{{ emissionFactor }} kg CO₂e/{{ unit || 'unit' }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="font-semibold">Total CO₂e:</span>
            <span>{{ totalEmissions }} kg</span>
          </div>
          <button class="btn btn-primary w-full mt-2" type="submit">Save</button>
          <label class="btn btn-ghost w-full" @click="props.close">Cancel</label>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
