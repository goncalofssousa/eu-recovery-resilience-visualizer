<template>
  <apexchart
    v-if="isMounted && chartReady"
    v-bind="props"
    :key="chartKey"
    type="donut"
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
      return `donut-${this.series.join("-")}-${this.labels.join("-")}-${this.colors.join("-")}`;
    },

    chartOptions() {
      return {
        chart: {
          type: "donut",
        },

        labels: this.labels,

        colors: this.colors,

        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "0%",
            },
          },
        },

        legend: {
          show: true,
          position: "right",
        },

        tooltip: {
          enabled: false,
        },

        stroke: {
          show: false,
        },
      };
    },
  },
};
</script>