<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, LineController, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

Chart.register(LineController, LineElement, PointElement, Tooltip, Legend);

const props = defineProps({
  emissions: {
    type: Array,
    required: true
  }
});

const lineChartRef = ref(null);
let lineChartInstance = null;

function groupByDate(emissions) {
  const map = {};
  emissions.forEach(e => {
    let d = format(e.date.toDate(), 'dd MMM yyyy');
    map[d] = (map[d] || 0) + (e.totalEmissions || 0);
  });
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

function renderChart() {
  if (!lineChartRef.value) return;
  if (lineChartInstance) lineChartInstance.destroy();
  const grouped = groupByDate(props.emissions);
  const labels = grouped.map(([date]) => date);
  const data = grouped.map(([, total]) => total);
  lineChartInstance = new Chart(lineChartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Emissions (kg CO₂)',
        data,
        borderColor: window.getComputedStyle(document.body).color,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

onMounted(renderChart);
watch(() => props.emissions, renderChart, { deep: true });
</script>

<template>
  <div>
    <canvas ref="lineChartRef" height="180"></canvas>
  </div>
</template>

<style scoped></style>
