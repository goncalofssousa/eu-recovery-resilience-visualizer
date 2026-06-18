<template>
  <apexchart
    v-if="isMounted && chartReady"
    v-bind="props"
    :key="chartKey"
    :options="chartOptions"
    :series="series"
  />
</template>

<script>
import { nextTick } from "vue";

export default {
  props: {
    series: { type: Array, required: true },
    labels: { type: Array, required: true },
    colors: { type: Array, default: () => [] },
    horizontal: { type: Boolean, default: false },
    props: { type: Object, default: () => ({}) },
    grid: {
      type: Object,
      default: () => ({
        yaxis: {
          lines: { show: true },
        },
        xaxis: {
          lines: { show: false },
        },
      }),
    },
  },

  data() {
    return {
      isMounted: false,
    };
  },

  async mounted() {
    await nextTick();
    this.isMounted = true;
  },

  beforeUnmount() {
    this.isMounted = false;
  },

  computed: {
    chartReady() {
      return (
        Array.isArray(this.series) &&
        this.series.length > 0 &&
        Array.isArray(this.labels) &&
        this.labels.length > 0
      );
    },

    chartKey() {
      return `bar-${this.labels.join("-")}-${this.colors.join("-")}-${this.horizontal}`;
    },

    chartOptions() {
      return {
        chart: {
          type: "bar",
          toolbar: { show: false },
        },

        xaxis: {
          categories: this.labels,
        },

        colors: this.colors,

        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: this.horizontal,
            columnWidth: "50%",
          },
        },

        grid: this.grid,

        dataLabels: {
          enabled: false,
        },

        legend: {
          show: false,
        },

        tooltip: {
          enabled: true,
        },

        stroke: {
          show: false,
        },
      };
    },
  },
};
</script>