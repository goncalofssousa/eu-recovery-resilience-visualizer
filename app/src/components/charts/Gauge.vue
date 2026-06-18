<template>
  <div class="gauge">
    <apexchart
      v-if="isMounted && chartReady"
      :key="chartKey"
      type="radialBar"
      :height="height"
      :series="[value]"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { nextTick } from "vue";

export default {
  name: "Gauge",

  props: {
    series: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      default: () => ["Progresso"],
    },
    colors: {
      type: Array,
      default: () => ["#10b981"],
    },
    height: {
      type: [String, Number],
      default: 280,
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
    value() {
      const number = Number(this.series?.[0] ?? 0);

      if (!Number.isFinite(number)) {
        return 0;
      }

      return Math.min(100, Math.max(0, number));
    },

    gaugeColor() {
      return this.colors?.[0] ?? "#10b981";
    },

    chartReady() {
      return (
        Array.isArray(this.series) &&
        this.series.length > 0 &&
        Number.isFinite(Number(this.series[0]))
      );
    },

    chartKey() {
      return `gauge-${this.value}-${this.labels.join("-")}-${this.colors.join("-")}`;
    },

    chartOptions() {
      return {
        chart: {
          type: "radialBar",
          sparkline: {
            enabled: true,
          },
          animations: {
            enabled: true,
          },
        },

        colors: [this.gaugeColor],

        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,

            hollow: {
              size: "40%",
            },

            track: {
              background: "#e7e7e7",
              strokeWidth: "100%",
              margin: 0,
            },

            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              },
            },
          },
        },

        stroke: {
          lineCap: "butt",
        },

        labels: this.labels,
      };
    },
  },
};
</script>

<style scoped>
.gauge {
  width: 100%;
  min-height: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gauge :deep(.apexcharts-canvas),
.gauge :deep(svg) {
  max-width: 100%;
}
</style>