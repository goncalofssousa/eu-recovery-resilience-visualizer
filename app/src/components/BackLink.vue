<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <router-link
    :to="to"
    class="back absolute flex items-center gap-1 top-10 right-8"
  >
    <img
      src="../assets/icons/arrow.svg"
      class="rotate-180"
      style="
        filter: invert(29%) sepia(92%) saturate(5751%) hue-rotate(206deg)
          brightness(95%) contrast(92%);
      "
      alt=""
    />

    <p class="text-(--blue-color)">
      {{ text }}
    </p>
  </router-link>
</template>