<script setup>
import { computed } from "vue";

// Importa automaticamente todas as imagens dentro de assets
// com formato png, jpg, jpeg ou svg.
const images = import.meta.glob("../assets/**/**.{png,jpg,jpeg,svg}", {
  eager: true,
  import: "default",
});

const props = defineProps({
  folder: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: "png",
  },
});

const imageSrc = computed(() => {
  if (!props.filename) return "";

  const path = `../assets/${props.folder}/${props.filename}.${props.format}`;

  return images[path] || "";
});
</script>

<template>
  <img width="50" :src="imageSrc" alt="" />
</template>