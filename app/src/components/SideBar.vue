<script setup>
import logo from "../assets/logo.svg";
import { routes } from "../lib/router";
import SideBarItem from "./SideBarItem.vue";
</script>

<template>
  <div class="sidebar">
    <div class="top">
      <div class="section">
        <img :src="logo" alt="logo" />
        <p class="text-left text-(--title-color) text-[25px] font-bold">
          Comissão Europeia
        </p>
      </div>
      <p class="text-[20px] text-black/54 text-center mb-3">
        UE Próxima Geração
      </p>
    </div>
    <nav class="nav">
      <!--
      Percorre as rotas filhas e cria um item na sidebar para cada rota que não esteja escondida com meta.hide, essecialmennte serve para 
      não mostrar as tabs "secundárias" como top100beeficiários etc, que são acessíveis apenas a partir da parent route 
      -->
      <SideBarItem
        v-for="{ meta: route, path } in routes[0].children.filter((e) => !e.meta.hide)"
        :key="path"
        :route="path"
        :icon="route.icon"
        >{{ route.title }}
      </SideBarItem>
    </nav>
  </div>
</template>

<style scoped>
.nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.top .section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  justify-content: center;
  height: 100px;
  align-items: center;
}

.top {
  border-bottom: 0.2px solid black;
  padding: 0 1rem;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: var(--sidebar-color);
  border-right: 0.2px solid black;
}
</style>
