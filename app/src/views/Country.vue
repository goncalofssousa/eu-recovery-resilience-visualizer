<script setup>
import { computed, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";
import BackLink from "../components/BackLink.vue";
import Button from "../components/Button.vue";
import Bar from "../components/charts/Bar.vue";
import Gauge from "../components/charts/Gauge.vue";
import DynamicImage from "../components/DynamicImage.vue";
import ExportButton from "../components/ExportButton.vue";

// Store Pinia onde estão guardados os dados globais da aplicação.
import { useDataStore } from "../stores/dataStore";

// Cores usadas no gráfico dos pilares.
const colors = [
  "green-color",
  "purple-color",
  "blue-color",
  "orange-color",
  "red-color",
  "yellow-color",
];

// Informação da rota atual.
const route = useRoute();

// Router usado para redirecionar o utilizador caso o país não exista.
const router = useRouter();

// Acede à store global de dados.
const store = useDataStore();

// Vai buscar o parâmetro country da rota.
// Exemplo: em /countries/portugal, countryKey será "portugal".
const countryKey = route.params.country;

// Loading vem diretamente da store.
// Assim não precisamos de ter loading local neste componente.
const loading = computed(() => store.isLoading);

// Lista de pilares vinda da store.
const pillars = computed(() => store.getPillars);

// País selecionado, encontrado através do ID presente na rota.
const country = computed(() => store.getCountryById(countryKey));

// Quando o componente é montado, carrega os dados necessários.
onMounted(async () => {
  // Se não existir countryKey, volta para a lista de países.
  if (!countryKey) {
    router.push("/countries");
    return;
  }

  // Carrega countries + pillars através da store.
  // Se já tiverem sido carregados antes, a store não volta a fazer fetch.
  await store.loadBaseData();

  // Depois de carregar os dados, verifica se o país existe.
  // Se não existir, redireciona para /countries.
  if (!country.value) {
    router.push("/countries");
  }
});

// Total alocado ao país em milhares de milhões.
const allocated = computed(() => {
  if (!country.value?.rrp) return 0;
  return Number((country.value.rrp.allocation / 1e9).toFixed(2));
});

// Total já investido/desembolsado no país.
const total = computed(() => {
  if (!country.value?.rrp) return 0;
  return Number((country.value.rrp.total / 1e9).toFixed(2));
});

// Empréstimos alocados ao país.
const loans = computed(() => {
  if (!country.value?.loans) return "0.00";
  return (country.value.loans.allocate / 1e9).toFixed(2);
});

// Empréstimos já pagos ao país.
const loansTotal = computed(() => {
  if (!country.value?.loans) return "0.00";
  return (country.value.loans.total / 1e9).toFixed(2);
});

// Percentagem de empréstimos já pagos.
const loansPercentage = computed(() => {
  if (!country.value?.loans || country.value.loans.allocate === 0) return 0;

  return Number(
    ((country.value.loans.total / country.value.loans.allocate) * 100).toFixed(2),
  );
});

// Subvenções alocadas ao país.
const grants = computed(() => {
  if (!country.value?.grants) return "0.00";
  return (country.value.grants.allocate / 1e9).toFixed(2);
});

// Subvenções já pagas ao país.
const grantsTotal = computed(() => {
  if (!country.value?.grants) return "0.00";
  return (country.value.grants.total / 1e9).toFixed(2);
});

// Percentagem de subvenções já pagas.
// Corrigido o nome de "gransPercentage" para "grantsPercentage".
const grantsPercentage = computed(() => {
  if (!country.value?.grants || country.value.grants.allocate === 0) return 0;

  return Number(((country.value.grants.total / country.value.grants.allocate) * 100).toFixed(2));
});

// Percentagem do PRR em relação ao PIB de 2019.
const percentagePIB = computed(() => {
  if (!country.value?.rrp || !country.value?.pib) return 0;

  return Number(((country.value.rrp.allocation / country.value.pib[2019]) * 100).toFixed(2));
});

// Percentagem total já investida em relação ao total alocado.
const percentage = computed(() => {
  if (!country.value?.rrp || country.value.rrp.allocation === 0) return 0;

  return Number(((country.value.rrp.total / country.value.rrp.allocation) * 100).toFixed(2));
});

// Soma total dos valores associados aos pilares do país.
const pillarsTotal = computed(() => store.getCountryPillarsTotal(countryKey));

const milestonesDone = computed(() => store.getCountryMilestonesDone(countryKey));

const milestonesTotal = computed(() => store.getCountryMilestonesTotal(countryKey));

const milestonesPercentage = computed(() => Number(store.getCountryExecutionRate(countryKey).toFixed(1)));

// Quantidade de marcos/metas que ainda faltam cumprir.
const milestonesMissing = computed(() => {
  return milestonesTotal.value - milestonesDone.value;
});

const reformsCount = computed(() => store.getCountryReformsCount(countryKey));

const investmentsCount = computed(() => store.getCountryInvestmentsCount(countryKey));

// Percentagem da despesa associada aos pilares.
const expenses = computed(() => {
  if (!country.value?.rrp || country.value.rrp.allocation === 0) return "0.00";

  return ((pillarsTotal.value / country.value.rrp.allocation) * 100).toFixed(2);
});

// Cards dos principais objetivos.
const objectiveCards = computed(() => {
  if (!country.value?.objectives) return [];

  return [
    {
      img: "college",
      number: country.value.objectives.renovated_schools,
      text: "Escolas Renovadas",
    },
    {
      img: "suitcase",
      number: country.value.objectives.supported_companies,
      text: "Empresas Apoiadas",
    },
    {
      img: "tree",
      number: country.value.objectives.green_projects,
      text: "Projetos Verdes",
    },
    {
      img: "wifi",
      number: country.value.objectives.digital_infrastructure,
      text: "Infraestruturas Digitais",
    },
  ];
});

// Cards principais com valores financeiros.
const kpiCards = computed(() => [
  {
    title: "Total Alocado",
    value: `€${allocated.value}B`,
    desc: "Fundos Totais do PRR",
    img: "bank",
    color: "#2563EB",
  },
  {
    title: "Subvenções",
    value: `€${grants.value}B`,
    desc: "Total Alocado em Subvenções",
    img: "money-sac",
    color: "var(--purple-color)",
  },
  {
    title: "Empréstimos",
    value: `€${loans.value}B`,
    desc: "Total Alocado em Empréstimos",
    img: "card",
    color: "var(--yellow-color)",
  },
  {
    title: "Fundos PRR em % do PIB",
    value: `${percentagePIB.value}%`,
    desc: "Impacto do PRR na Economia Nacional",
    img: "percentage",
    color: "#747884",
  },
]);

// Dados preparados para o gráfico e para o botão de exportação.
// fields guarda os nomes dos pilares.
// data guarda as percentagens de contribuição de cada pilar.
const pillarContribuitions = computed(() => {
  const fields = [];
  const data = [[]];

  if (!country || !country.value || !country.value.pillars || pillarsTotal.value === 0) {
    return { fields, data };
  }

  for (const pillar of pillars.value) {
    fields.push(pillar.title);

    data[0].push(Number(((country.value.pillars[pillar.id] / pillarsTotal.value) * 100).toFixed(2)));
  }

  return { fields, data };
});
</script>

<template>
  <div v-if="!loading && country" class="page flex flex-col gap-10">
    <section class="relative">
      <BackLink to="/countries" text="Voltar aos países" />

      <div class="flex flex-row gap-3">
        <DynamicImage class="w-18 aspect-video" folder="countries" :filename="countryKey"/>

        <div>
          <h1 class="font-bold text-[30px]">
            {{ country.translation }}
          </h1>

          <p class="subtitle subtitle2">
            Plano de Recuperação e Resiliência
          </p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-(--blue-color) text-[25px] font-bold">
        Principais objetivos alcançados no âmbito do PRR
      </h2>

      <p class="subtitle subtitle2">
        Impacto direto da aplicação do PRR na vida quotidiana
      </p>

      <div class="grid grid-cols-4 gap-5 mt-5">
        <div v-for="item in objectiveCards" :key="item.img" class="card bg-(--blue-color)! flex-row! gap-3 text-white">
          <DynamicImage class="w-12.5 aspect-square" folder="icons" :filename="item.img" format="svg"/>

          <div>
            <p class="text-[40px] font-semibold">
              {{ item.number }}
            </p>

            <p class="text-[17px]! m-0!">
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-4 gap-5 mt-5">
        <div v-for="item in kpiCards" :key="item.title" class="relative card">
          <DynamicImage class="absolute top-3 right-3 w-10 aspect-square" folder="icons" :filename="item.img" format="svg"/>

          <p class="text-black/58">
            {{ item.title }}
          </p>

          <p :style="{ color: item.color }" class="mt-3 title">
            {{ item.value }}
          </p>

          <p class="text-[15px] text-black/58">
            {{ item.desc }}
          </p>
        </div>
      </div>
    </section>

    <section class="card p-0!">
      <div class="cardPadding pb-5! w-full border-b border-[#bebebe] grid grid-cols-[1.5fr_1fr_3fr_auto] items-center gap-x-6">
        <div>
          <h2 class="title">
            Desembolsos
          </h2>

          <p class="subtitle subtitle2 text-nowrap">
            Fundos Investidos no País até ao momento
          </p>
        </div>

        <div class="text-center">
          <p class="text-nowrap subtitle subtitle2 text-[20px]!">
            Total Investido
          </p>

          <p class="title text-(--green-color)!">
            €{{ total }}B
          </p>
        </div>

        <div class="w-full">
          <progress class="progress h-4! w-3/4" max="100" :value="percentage"></progress>

          <p class="subtitle text-center mt-1!">
            {{ percentage }}% investidos de €{{ allocated }}B alocados
          </p>
        </div>

        <div class="flex justify-end items-center">
          <Button
            :link="`/disbursements?country=${countryKey}`"
            class="w-fit min-w-25 h-12.5! hover:bg-[#1746b8] transition-colors duration-300"
          >
            Ver Mais
          </Button>
        </div>
      </div>

      <div class="cardPadding grid grid-cols-2">
        <div class="disburCard border-r border-[#bebebe]">
          <h2>
            Desembolsos em Subvenções
          </h2>

          <div class="gauge-wrapper">
            <Gauge
              :series="[grantsPercentage]"
              :labels="['Progresso']"
              :colors="['var(--purple-color)']"
              :height="360"
            />
          </div>

          <h3 class="title text-(--purple-color)!">
            €{{ grantsTotal }}B
          </h3>

          <h4 class="subtitle subtitle2">
            De €{{ grants }}B alocados em subvenções
          </h4>

          <p class="desc">
            Este gráfico apresenta o montante de subvenções desembolsado até ao
            momento no âmbito do MRR para este País. As subvenções são
            contribuições financeiras não reembolsáveis. O montante total de
            subvenções atribuído a cada Estado-Membro é determinado por uma
            chave de repartição e pelo custo total estimado do respetivo plano
            de recuperação e resiliência.
          </p>
        </div>

        <div class="disburCard">
          <h2>
            Desembolsos em Empréstimos
          </h2>

          <div class="gauge-wrapper">
            <Gauge
              :series="[loansPercentage]"
              :labels="['Progresso']"
              :colors="['var(--yellow-color)']"
              :height="360"
            />
          </div>

          <h3 class="title text-(--yellow-color)!">
            €{{ loansTotal }}B
          </h3>

          <h4 class="subtitle subtitle2">
            De €{{ loans }}B alocados em empréstimos
          </h4>

          <p class="desc">
            Este gráfico mostra o montante de empréstimos já desembolsados para
            o País no âmbito do MRR. Os empréstimos são contribuições
            financeiras reembolsáveis. O montante total de empréstimos concedido
            a cada Estado-Membro é determinado pela avaliação do seu pedido de
            empréstimo e não pode exceder 6,8% do seu RNB (Rendimento Nacional
            Bruto) de 2019.
          </p>
        </div>
      </div>
    </section>

    <section class="card relative">
      <ExportButton :data="pillarContribuitions" class="absolute top-3 right-3"/>

      <h2 class="title">
        Contribuição dos fundos MRR para cada pilar (em %)
      </h2>

      <div class="flex flex-row h-150 gap-4">
        <div class="pillars-labels">
          <div v-for="pillar in pillars" :key="pillar.id" class="pillar-label">
            <DynamicImage
              :class="[
                pillar.img === 'help' || pillar.img === 'growth'
                  ? 'pillar-icon-smaller'
                  : 'pillar-icon',
              ]"
              folder="pillars"
              format="svg"
              :filename="pillar.img"
            />

            <p>
              {{ pillar.title }}
            </p>
          </div>
        </div>

        <Bar
          :series="[
            {
              name: 'Percentagem (%)',
              data: pillarContribuitions.data[0]
                .map((e, i) => [e, colors[i] ?? ''])
                .map(([value, colorVar]) => ({
                  x: 'Dados',
                  y: value,
                  fillColor: 'var(--' + colorVar + ')',
                })),
            },
          ]"
          :labels="['', '', '', '', '', '']"
          :horizontal="true"
          :grid="{
            yaxis: {
              lines: { show: false },
            },
            xaxis: {
              lines: { show: true },
            },
          }"
          height="100%"
          class="flex-1"
        />
      </div>

      <p class="subtitle">
        Este gráfico apresenta a percentagem da contribuição estimada do plano
        de recuperação e resiliência para cada pilar de política.
      </p>
    </section>

    <section class="card">
      <h2 class="title">
        Despesa Associada ao Plano
      </h2>

      <p class="subtitle subtitle2 text-[20px]!">
        A Comissão desenvolveu uma metodologia para calcular a despesa social de
        cada plano de recuperação e resiliência com base em quatro categorias
        sociais (conforme definido no Regulamento Delegado (UE) 2021/2105).
        Neste plano, a despesa social representa
        <span class="text-[30px] text-[#1E3A8A]">
          {{ expenses }}%
        </span>
        do total da despesa estimada.
      </p>
    </section>

    <section class="card relative">
      <Button
        :link="`/milestones?country=${countryKey}`"
        class="absolute top-4 right-4 w-25! h-12.5! hover:bg-[#1746b8] transition-colors duration-300"
      >
        Ver Mais
      </Button>

      <h2 class="title">
        Marcos e Metas
      </h2>

      <p class="subtitle">
        Etapas definidas para acompanhar a implementação das reformas e
        investimentos previstos no plano de recuperação e resiliência.
      </p>

      <div class="grid grid-cols-2 text-center items-start gap-6">
        <div class="container marcoemeta">
          <h2>
            Comparação marcos realizados / projetados
          </h2>

          <div class="gauge-wrapper gauge-wrapper-large">
            <Gauge
              :series="[milestonesPercentage]"
              :labels="['Progresso']"
              :colors="['#10b981']"
              :height="380"
            />
          </div>

          <h3>
            {{ milestonesDone }} Marcos Concluídos
          </h3>

          <p>
            De {{ milestonesTotal }}, faltando cumprir
            {{ milestonesMissing }} ({{ (100 - milestonesPercentage).toFixed(1) }}%)
          </p>
        </div>

        <div class="container marcoemeta">
          <h2>
            Marcos e metas por tipo de indicador
          </h2>

          <div class="bar-wrapper-milestones">
            <Bar
              :series="[
                {
                  name: 'Quantidade',
                  data: [investmentsCount, reformsCount].map((value) => ({
                    x: 'Dados',
                    y: value,
                    fillColor: '#4425ed',
                  })),
                },
              ]"
              :labels="['Investimentos', 'Reformas']"
              :horizontal="false"
              height="250px"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2 class="title">
        Histórico de Revisões de Planos
      </h2>

      <div>
        <div
          v-for="revision in country.revisions"
          :key="revision.date"
          class="flex flex-row items-center gap-5 font-medium text-[20px]"
        >
          <span class="date">
            {{ revision.date }}
          </span>

          <div class="relative h-25 w-1 bg-black">
            <div
              class="absolute top-1/2 left-1/2 -translate-1/2 h-6 aspect-square bg-white border-[5px] border-[#fad872] rounded-full"
            ></div>
          </div>

          <p class="font-medium text-[17px]">
            {{ revision.text }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.subtitle2 {
  width: 100% !important;
  font-size: 17px !important;
}

.cardPadding {
  padding: 1rem 24px;
}

.disburCard {
  text-align: center;
}

.disburCard h2 {
  font-size: 18px;
  margin: 0.75rem 0 0;
}

.disburCard .desc {
  margin: 1rem 0;
  text-align: justify;
  padding: 0 4rem;
  font-size: 14px;
}

.marcoemeta {
  text-align: center;
}

.marcoemeta h2 {
  min-height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 25px;
  margin-top: 0.5rem;
  margin-bottom: 0;
  font-weight: bold;
  color: #808080;
}

.marcoemeta h3 {
  font-size: 25px;
  margin-top: -0.5rem;
  font-weight: bold;
  color: #10b981;
}

.marcoemeta p {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  color: #00000052;
}

.bar-wrapper-milestones {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-wrapper-large {
  width: 100%;
  height: 260px;
  margin-top: -1.25rem;
  margin-bottom: -1rem;
}

.pillars-labels {
  width: 300px;
  flex-shrink: 0;
  padding-top: 28px;
  padding-bottom: 40px;
}

.pillar-label {
  height: calc(100% / 6);
  display: flex;
  align-items: center;
  gap: 12px;
}

.pillar-icon {
  width: 70px;
  height: 80px;
  object-fit: contain;
}

.pillar-icon-smaller {
  width: 70px;
  height: 45px;
  object-fit: contain;
}

.pillar-label p {
  font-size: 14px;
  font-weight: 600;
  color: var(--title-color);
  line-height: 1.2;
  max-width: 220px;
}

.gauge-wrapper {
  width: 100%;
  height: 230px;
  margin: -1.25rem auto -2.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: visible;
}
</style>