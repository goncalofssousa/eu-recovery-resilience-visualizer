<template>
  <div v-if="!loading" class="page flex flex-col gap-10">
    <section>
      <p class="title">Indicadores Comuns</p>
      <p class="subtitle">
        Visualização dos 14 indicadores obrigatórios comuns a todos os
        Estados-Membros.
      </p>
      <p class="subtitle">
        Os indicadores comuns foram atualizados pela última vez em 20/11/2025.
      </p>
    </section>
    <section class="grid grid-cols-2 gap-15">
      <div class="card cardInfo">
        <img class="r" src="../assets/icons/info.svg" alt="" />
        <h3>O que são?</h3>
        <p>
          Os indicadores comuns do Mecanismo de Recuperação e Resiliência (RRF)
          são uma ferramenta fundamental para acompanhar os resultados das
          reformas e investimentos financiados no âmbito dos planos nacionais de
          recuperação e resiliência. Estes indicadores permitem medir, de forma
          consistente em todos os Estados-Membros, os progressos alcançados na
          implementação das medidas apoiadas pelo RRF e o seu contributo para os
          objetivos estratégicos da União Europeia.
        </p>
      </div>
      <div class="card cardInfo">
        <img class="r" src="../assets/icons/gov.svg" alt="" />
        <h3>Para que servem?</h3>
        <p>
          Através destes indicadores, é possível avaliar o impacto das políticas
          nos 6 pilares definidos pelo MRR. Os dados recolhidos contribuem para
          uma monitorização transparente e comparável dos resultados alcançados
          pelos diferentes países. Os Estados-Membros são responsáveis pela
          recolha e reporte dos dados relativos aos indicadores comuns, que são
          comunicados à Comissão Europeia duas vezes por ano, até ao final de
          fevereiro e de agosto.
        </p>
      </div>
      <div class="card card2">
        <div>
          <img class="blueIMG" src="../assets/icons/increase.svg" alt="" />
          <h3>Progresso Médio</h3>
        </div>
        <h2>{{ averageProgress }}%</h2>
        <p class="subtitle text-[15px]!">Média de todos os indicadores</p>
      </div>
      <div class="card card2">
        <div>
          <img class="imgGreen" src="../assets/icons/bullet.svg" alt="" />
          <h3>Indicadores na Meta</h3>
        </div>
        <h2 class="text-[#39B139]!">{{ indicatorsOnTarget }}</h2>
        <p class="subtitle text-[15px]!">
          Número de indicacores com progresso maior ou igual do que 70%
        </p>
      </div>
      <div class="card" v-for="value in indicators" :key="value.id">
        <h1 class="font-bold text-[20px]">{{ value.title }}</h1>
        <h2 class="subtitle mt-1! text-[15px]!">{{ value.desc }}</h2>
        <table class="mt-3">
          <tbody>
            <tr class="font-semibold text-[15px]!">
              <td class="subtitle pb-3">Atual:</td>
              <td class="text-nowrap text-right text-(--blue-color)">
                {{ value.value }} {{ value.metric }}
              </td>
            </tr>
            <tr class="font-semibold text-[15px]!">
              <td class="subtitle pb-3">Meta:</td>
              <td class="text-nowrap text-right">
                {{ value.objective }} {{ value.metric }}
              </td>
            </tr>
          </tbody>
        </table>
        <p class="mt-3 text-[13px]">Progresso</p>
        <div class="flex flex-row items-center gap-1 mt-2">
          <progress
            max="100"
            :value="Math.round((value.value / value.objective) * 100)"
            class="progress progressBlack w-3/4"
          ></progress>
          <p class="text-[11px]">
            {{ Math.round((value.value / value.objective) * 100) }}%
          </p>
        </div>
        <div class="bg-[#dfdfdf] w-3/4 h-0.5 my-3"></div>
        <router-link :to="'/common-indicators/' + value.id" class="text-[15px] link">
          Clique para mais informações
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useDataStore } from "../stores/dataStore";

const store = useDataStore();

const loading = computed(() => store.isLoading);
const indicators = computed(() => store.getIndicators);

const averageProgress = computed(() => {
  if (indicators.value.length === 0) return 0;

  const total = indicators.value.reduce((sum, indicator) => {
    return sum + (indicator.value / indicator.objective) * 100;
  }, 0);

  return Math.round(total / indicators.value.length);
});

const indicatorsOnTarget = computed(() => {
  return indicators.value.filter((indicator) => {
    return (indicator.value / indicator.objective) * 100 >= 70;
  }).length;
});

onMounted(() => {
  // nao precisa de await uma vez que nao fazemos nada a seguir ao load
  store.loadIndicators();
});
</script>

<style scoped>
.cardInfo p {
  width: 95%;
}
.card2 {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.card2 div {
  display: flex;
  align-items: center;
  gap: 15px;
}
.card2 img {
  width: 30px;
  aspect-ratio: 1/1;
}
.card2 h2 {
  font-size: 30px;
  font-weight: 600;
  color: var(--blue-color);
}
.card h3 {
  font-size: 20px;
  font-weight: 600;
}
.imgGreen {
  filter: invert(52%) sepia(66%) saturate(391%) hue-rotate(63deg)
    brightness(100%) contrast(92%);
}
.r {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
