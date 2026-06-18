<template>
  <div class="layout">
    <SideBar />

    <div class="content">
      <router-view class="flex-1 mb-5" />
      <footer class="footer">
        <p>©Copyright. All Rights reserved to REI</p>
      </footer>
    </div>
  </div>
</template>

<script>
import SideBar from "../components/SideBar.vue";

export default {
  components: { SideBar },
};
</script>

<style scoped>
.layout {
  display: flex;
}

.content {
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0;
  height: 5rem;
  background: var(--sidebar-color);
  border-top: 0.2px solid black;
}
</style>
