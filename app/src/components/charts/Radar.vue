<template>
  <apexchart
    v-if="isMounted && chartReady"
    v-bind="props"
    :key="chartKey"
    type="radar"
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
    props: { type: Object, default: () => ({}) },
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
      return `radar-${this.labels.join("-")}-${this.colors.join("-")}`;
    },

    chartOptions() {
      return {
        chart: {
          type: "radar",
          toolbar: { show: false },
        },

        plotOptions: {
          radar: {
            size: 100,
          },
        },

        colors: this.colors,

        stroke: {
          width: 2,
        },

        fill: {
          opacity: 0.2,
        },

        markers: {
          size: 4,
        },

        grid: {
          show: false,
        },

        yaxis: {
          show: false,
          max: 40,
        },

        xaxis: {
          categories: this.labels,
          labels: {
            show: true,
            style: {
              fontSize: "10px",
            },
          },
        },

        tooltip: {
          enabled: true,
        },

        legend: {
          show: false,
        },
      };
    },
  },
};
</script>