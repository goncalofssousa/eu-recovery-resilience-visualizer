<script setup>
import DynamicImage from "./DynamicImage.vue";

const props = defineProps({
  filename: {
    type: String,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  format: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    default: "country",
  },
});

const emit = defineEmits(["remove"]);
</script>

<template>
  <div class="filter-chip">
     <!-- aqui a classe vai depender se o tipo de filtro é para pilar ou para country, uma vez que as imagens dos pilares são muito pequenas -->
    <div :class="props.type === 'pillar' ? 'filter-chip-pillar' : 'filter-chip-country'">
      <DynamicImage :folder="props.folder" :filename="props.filename" :format="props.format"
      />
    </div>

    <p>{{ props.label }}</p>

    <button class="filter-chip-remove" @click="emit('remove')">
      X
    </button>
  </div>
</template>

<style scoped>
.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 20px;
  border-radius: 10px;
  background-color: var(--sidebar-color);
  border: 1px solid #00000015;
}

.filter-chip-country,
.filter-chip-pillar {
  width: 26px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-chip-country :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.filter-chip-pillar :deep(img) {
  width: 34px;
  height: 34px;
  min-width: 34px;
  object-fit: contain;
}

.filter-chip p {
  color: black;
}

.filter-chip-remove {
  cursor: pointer;
  font-weight: 600;
  color: #00000056;
}

.filter-chip-remove:hover {
  color: black;
}
</style>