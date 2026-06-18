<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  menuClass: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["select"]);

const open = ref(false);
const dropdown = ref();

function toggle() {
  open.value = !open.value;
}

function select(item) {
  emit("select", item);
  open.value = false;
}

function handleClickOutside(event) {
  if (!dropdown.value) return;

  if (!dropdown.value.contains(event.target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="dropdown" class="dropdown">
    <div @click="toggle">
      <slot name="button" :open="open"></slot>
    </div>

    <div v-if="open" class="dropdown-menu" :class="props.menuClass">
      <div v-for="(item, index) in props.items" :key="index" class="dropdown-item" @click="select(item)">
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  cursor: pointer;
}

.dropdown-item:hover {
  background: #ffffff;
}
</style>