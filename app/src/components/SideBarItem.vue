<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: false,
    default: "",
  },
});

const currentRoute = useRoute();

const icons = import.meta.glob("../assets/icons/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const iconSrc = computed(() => {
  const key = `../assets/icons/${props.icon}`;

  if (icons[key]) {
    return icons[key];
  }

  return "";
});
 
// saber se um elemento da sidebar está ativo ou não. Usado para determinar o estilo de "ativo" ou não...
const isActive = computed(() => {
  return (
    currentRoute.path === props.route ||
    currentRoute.meta.parentRoute === props.route
  );
});
</script>

<template>
  <router-link :to="route" :class="{ ativo: isActive, item: true }">
    <img class="icon" :src="iconSrc" alt="Icon" />
    <slot></slot>
  </router-link>
</template>

<style scoped>
.item {
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.item:hover:not(.ativo) {
  border-radius: 13px;
  background-color: rgba(135, 135, 135, 0.18);
}

.icon {
  width: 20px;
  height: 20px;
  margin: 0 10px;
  fill: black;
}

.text {
  font-size: 20px;
}

.ativo {
  border-radius: 13px;
  background-color: rgba(121, 153, 255, 0.18);
  color: #1654da;
}

.ativo .icon {
  filter: brightness(0) saturate(100%) invert(27%) sepia(91%) saturate(3000%)
    hue-rotate(210deg);
}
</style>