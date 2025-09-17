<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
});

const barChartRef = ref(null);
let barChartInstance = null;

function renderChart() {
  if (!barChartRef.value) return;
  if (barChartInstance) barChartInstance.destroy();

  barChartInstance = new Chart(barChartRef.value, {
    type: 'bar',
    data: {
      labels: props.projects.map(p => p.name),
      datasets: [{
        label: 'Emissions (kg CO₂e)',
        data: props.projects.map(p => p.totalEmissions || 0),
        backgroundColor: window.getComputedStyle(document.body).color,
      }],
    },
    options: {
      responsive: true,
      borderRadius: 4,
      plugins: { legend: { display: false } },
      barThickness: 24,
    },
  });
}

onMounted(renderChart);
watch(() => props.projects, renderChart, { deep: true });
</script>

<template>
  <div>
    <canvas ref="barChartRef" height="180"></canvas>
  </div>
</template>

<style scoped></style>
