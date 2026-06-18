<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  imageClass: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  external: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <!-- permite criar um botao generico, tanto para: botoes para links externos (com href),  links internos (router link) e para botões clicáveis. target="_blank" para nao sair da nossa pagina-->
  <a v-if="props.link && props.external" :href="props.link" target="_blank" class="inline-flex items-center justify-center gap-3 text-white bg-(--blue-color) rounded-[10px] cursor-pointer w-32 h-9 hover:brightness-90 transition duration-300">
    <img v-if="props.icon" :src="props.icon" alt="" :class="['w-3.75 aspect-square', props.imageClass]"/>

    <slot></slot>
  </a>

  <router-link v-else-if="props.link" :to="props.link" class="container flex-row! gap-3 text-white bg-(--blue-color) rounded-[10px] w-full h-full cursor-pointer">
    <img v-if="props.icon" :src="props.icon" alt="" :class="['w-3.75 aspect-square', props.imageClass]"/>

    <slot></slot>
  </router-link>

  <button v-else type="button" class="container flex-row! gap-3 text-white bg-(--blue-color) rounded-[10px] w-full h-full cursor-pointer">
    <img v-if="props.icon" :src="props.icon" alt="" :class="['w-3.75 aspect-square', props.imageClass]"/>

    <slot></slot>
  </button>
</template>