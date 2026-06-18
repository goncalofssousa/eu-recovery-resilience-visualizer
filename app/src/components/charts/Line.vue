<template>
  <apexchart
    v-if="isMounted && chartReady"
    :key="chartKey"
    type="line"
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
      return `line-${this.labels.join("-")}-${this.colors.join("-")}`;
    },

    chartOptions() {
      return {
        chart: {
          type: "line",
          toolbar: { show: false },
        },

        stroke: {
          curve: "straight",
          width: 3,
        },

        colors: this.colors,

        xaxis: {
          categories: this.labels,
        },

        yaxis: {
          labels: {
            formatter: (val) => Math.round(val).toLocaleString("pt-PT"),
          },
          tickAmount: 4,
          min: 0,
          max: (max) => Math.ceil(max / 1000) * 1000,
        },

        grid: {
          strokeDashArray: 4,
        },

        dataLabels: {
          enabled: false,
        },

        markers: {
          size: 4,
        },

        tooltip: {
          theme: "light",
          y: {
            formatter: (val) => `${val.toLocaleString("pt-PT")} MW`,
          },
        },
      };
    },
  },
};
</script>