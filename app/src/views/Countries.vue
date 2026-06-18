<template>  
<!--Só mostra a página quando o loading tiver acabado-->
  <div class="page" v-if="!loading">
    <h1 class="title">Estados-Membros</h1>
    <h2 class="subtitle">
      Selecione um país para ver detalhes específicos do seu plano de
      recuperação e resiliência.
    </h2>
    <!--criar uma grid para fazer display dos cards dos países. Usa-se TailWind CSS para o estilo e set do display-->
    <div class="grid grid-cols-3 gap-10 mt-10">
        <!--Criar um redirecionador para a página do país, dada pela rota "/countries/" + country.id-->
        <!-- Utiliza-se v-for de modo a tornar genérico, percorrendo todos os países obtidos no fetch dos dados do db.json -->
        <router-link
          class="country card flex gap-5"
          v-for="country in countries"
          :key="country.id"
          :to="'/countries/' + country.id"
        >
        <div class="relative flex flex-row items-center">
          <!-- Usa componente dynamic image para fazer display da figura relativa ao país, passando o filename como sendo o nome do país para ir buscar a imagem certa -->
          <DynamicImage class="w-20 aspect-video" folder="countries" :filename="country.id"
          />
          <!-- Nome do país e tradução, tudo dados fetched da db.json -->
          <div class="ml-5">
            <h1 class="font-bold text-[16px]">{{ country.translation }}</h1>
            <h2 class="text-[12px] mt-1">{{ country.abreviation }}</h2>
          </div>
          <img
            class="absolute top-3 right-0"
            src="../assets/icons/arrow.svg"
            alt=""
          />
        </div>
        <!-- Calculo dos totais alocados e pagos -->
        <div class="text-[12px]">
          <h2>Total Alocado</h2>
          <h3 class="mt-1 text-(--blue-color) font-bold">
            €{{ (country.rrp.allocation / 1e9).toFixed(2) }}B
          </h3>
        </div>
        <div class="text-[12px]">
          <h2>Total Pago</h2>
          <h3 class="mt-1 text-(--green-color) font-bold">
            €{{ (country.rrp.total / 1e9).toFixed(2) }}B
          </h3>
        </div>
        <div class="text-[12px]">
          <h2>Progresso</h2>
          <div class="flex flex-row items-center gap-3">
            <progress
              class="progress w-3/4"
              :style="{ '--progress-color': progressColor(country.rrp.percentage) }"
              max="100"
              :value="country.rrp.percentage"
            >
              country.rrp.percentage
            </progress>
            <p class="progressText m-0! text-[10px]!">
              {{ country.rrp.percentage }}%
            </p>
          </div>
        </div>
        </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import DynamicImage from "../components/DynamicImage.vue";
import { useDataStore } from "../stores/dataStore";

const store = useDataStore();
const loading = computed(() => store.isLoading);
const countries = computed(() => store.getCountries);
 

onMounted(() => {
  store.loadCountries();
});

function progressColor(percentage) {
  if (percentage < 20) return "#ef4444";
  if (percentage < 60) return "#f59e0b";
  return "#10b981";
}
</script>

<style scoped>
.country {
  box-sizing: border-box;
  border: 3px solid transparent;
}
.country:hover {
  border: 3px solid rgba(37, 99, 235, 0.59);
  transition: border 0.3s ease;
}

.progress::-webkit-progress-value {
  background-color: var(--progress-color);
}

.progress::-moz-progress-bar {
  background-color: var(--progress-color);
}
</style>
