<template>
  <div v-if="!loading && indicator" class="page relative">
    <!-- // BOTAO DO TIPO BACKLINK, para voltar à página de indicadores comuns, recebe como props o texto a mostrar e a rota para onde redirecionar -->
    <BackLink to="/common-indicators" text="Voltar aos Indicadores Comuns" /> 
    <h1 class="title">{{ indicator.title }}</h1>
    <h2 class="subtitle">{{ indicator.desc }}</h2>
    <section class="grid grid-cols-2 gap-5 mt-10">
      <div class="card cardInfo">
        <h3>O que é?</h3>
        <p>
          A Capacidade Renovável Adicional corresponde ao aumento líquido da
          potência máxima instalada proveniente de fontes de energia limpas,
          medida em Megawatts (MW), num determinado período de tempo. Reflete o
          reforço da infraestrutura de produção de energia renovável através da
          instalação de novas centrais, equipamentos ou sistemas capazes de
          gerar eletricidade a partir de recursos naturais. Este indicador
          técnico é utilizado para avaliar o progresso da transição energética e
          o ritmo de expansão das energias renováveis num determinado sistema
          elétrico, considerando apenas a capacidade efetivamente acrescentada,
          após descontadas eventuais reduções ou desativações anteriores.
        </p>
      </div>
      <div class="grid grid-cols-2 grid-rows-2 gap-5">
        <div class="card card2 text-(--blue-color)">
          <div>
            <img class="blueIMG" src="../assets/icons/increase.svg" alt="" />
            <h1>Valor Atual</h1>
          </div>
          <h2>{{ indicator.value.toLocaleString("pt-PT") }}</h2>
          <p class="capitalize">{{ indicator.metric }}</p>
        </div>
        <div class="card card2">
          <div>
            <img src="../assets/icons/increase.svg" alt="" />
            <h1>Meta</h1>
          </div>
          <h2>{{ indicator.objective.toLocaleString("pt-PT") }}</h2>
          <p class="capitalize">{{ indicator.metric }}</p>
        </div>
        <div class="card card2 text-(--green-color)">
          <div>
            <img class="greenIMG" src="../assets/icons/increase.svg" alt="" />
            <h1>Progresso</h1>
          </div>
          <h2>
            {{ Math.round((indicator.value / indicator.objective) * 100) }}%
          </h2>
          <progress
            class="progress mt-3"
            :value="Math.round((indicator.value / indicator.objective) * 100)"
            max="100"
          ></progress>
        </div>
        <div class="card card2 text-(--green-color)">
          <div>
            <img
              class="whiteToGreen"
              width="25"
              src="../assets/icons/tree.svg"
              alt=""
            />
            <h1>Impacto Ambiental</h1>
          </div>
          <h2>5,8</h2>
          <p>Milhões de Toneladas de CO2 evitadas</p>
        </div>
      </div>
    </section>
    <div class="mt-10 card relative">
      <ExportButton
        :data="{
          fields: ['Semestre', 'Valor'],
          data: indicator.evolution.map((item) => [item[0], item[1]]),
        }"
        class="absolute top-3 right-3"
      />
      <h1 class="title">Evolução Temporal (Semestral)</h1>
      <h2 class="subtitle">
        A Evolução Semestral da Capacidade Renovável Adicional refere-se à
        variação registada, de seis em seis meses, no aumento líquido da
        potência máxima instalada proveniente de fontes de energia renováveis,
        medida em Megawatts (MW). Este indicador permite acompanhar de forma
        periódica e sistemática o ritmo de crescimento da capacidade de produção
        de energia limpa num determinado sistema elétrico. A análise semestral
        permite acompanhar o ritmo de crescimento da capacidade renovável
        instalada, avaliando a eficácia dos investimentos e o cumprimento das
        metas energéticas. Num cenário de crescimento contínuo, este indicador
        apresenta uma tendência sempre positiva, refletindo a entrada em
        funcionamento de novas infraestruturas e o reforço progressivo da
        produção de energia a partir de fontes limpas.
      </h2>
      <div class="h-100 px-[5rem]">
        <Line
          :series="[
            {
              name: 'Variação Semestral',
              data: indicator.evolution.map((item) => item[1]),
            },
          ]"
          :labels="indicator.evolution.map((item) => item[0])"
          :colors="['var(--blue-color)']"
          height="100%"
        />
      </div>
    </div>
    <div class="mt-10 card relative">
      <ExportButton
        :data="{
          fields: ['Semestre', 'Valor Atual', 'Meta', 'Crescimento'],
          data: indicator.evolution.map((item) => [
            item[0],
            item[2].toLocaleString('pt-PT'),
            item[3].toLocaleString('pt-PT'),
            Math.round(((item[2]) / (item[3])) * 100) + '%',
            item[4] ?? '---------',
          ]),
        }"
        class="absolute top-3 right-3"
      />
      <h1 class="title">Dados detalhados por Semestre</h1>
      <h2 class="subtitle">
        Os Dados Detalhados por Semestre correspondem ao conjunto de informações
        quantitativas apresentadas de forma discriminada para cada período
        semestral, permitindo uma análise aprofundada da evolução da Capacidade
        Renovável Adicional. Estes dados incluem, entre outros elementos, o
        número de projetos concluídos, a potência instalada em MW por
        tecnologia, a distribuição geográfica das instalações e o volume de
        investimento associado.
      </h2>
      <div class="mt-10">
        <div class="grid grid-cols-5 text-center">
          <p>Semestre</p>
          <p>Valor Atual</p>
          <p>Meta</p>
          <p>Percentagem Atual</p>
          <p>Crescimento</p>
        </div>
        <div
          v-for="[semester, _, value, objective, growth] in indicator.evolution"
          :key="semester"
          class="grid grid-cols-5 border-b text-center border-b-[#aaaaaa] py-3"
        >
          <p>{{ semester }}</p>
          <p>{{ value.toLocaleString("pt-PT") }} empresas</p>
          <p>{{ objective.toLocaleString("pt-PT") }} empresas</p>
          <p class="text-[#B77700]">
            {{ Math.round(((value) / (objective)) * 100) }}%
          </p>
          <p v-if="growth" class="text-[#45B545]">{{ growth }}</p>
          <p v-else>---------</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card2 div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
.card2 h1 {
  font-weight: 500;
  font-size: 20px;
}
.card2 h2 {
  margin-top: 10px;
  font-weight: 600;
  font-size: 30px;
}
.card2 p {
  color: #00000055;
  font-size: 15px;
}
.whiteToGreen {
  filter: invert(52%) sepia(67%) saturate(410%) hue-rotate(110deg)
    brightness(92%) contrast(90%);
}
</style>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Line from "../components/charts/Line.vue";
import ExportButton from "../components/ExportButton.vue";
import { useDataStore } from "../stores/dataStore";
import BackLink from "../components/BackLink.vue";

// usado para ler a rota atual 
const route = useRoute();
// para redirecionador
const router = useRouter();
// para aceder à Pinia store
const store = useDataStore();

//  vai buscar o valor da rota, para depois usar no pinia store para ir buscar os dados do indicar (getIndicatorById)
const indicatorKey = route.params.indicator;

// variável loading do pinia, serve para indicar se os dados foram chegados ou nao.
// no template com v-if só mostramos a pagina caso os dados sejam carregados
const loading = computed(() => store.isLoading);
// ir buscar os dados relativos ao indicar com a key calculada a partir da rota. Só se mostra a página se conseguimos ir buscar o indicador
const indicator = computed(() => store.getIndicatorById(indicatorKey));

// async para poder usar o await (sempre que tiver await, a função deve conter async, como é onMounted, ou seja não bem um function, deve ser definida dentro)
onMounted(async () => {
  if (!indicatorKey) {
    router.push("/common-indicators");
    return;
  }

  // Espera o carregamento dos indicadores terminar.
  // Sem await, o código seguinte podia correr antes dos dados chegarem
  await store.loadIndicators();

  if (!indicator.value) {
    router.push("/common-indicators");
  }
});
</script>
