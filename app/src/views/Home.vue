<template>
  <div v-if="!loading" class="page">
    <section>
      <h1 class="title">
        Painel de Avaliação do Mecanismo de Recuperação e Resiliência
      </h1>

      <h2 class="subtitle">
        Visão geral do progresso da implementação do Mecanismo de Recuperação e
        Resiliência (MRR/RRF) e dos Planos Nacionais de Recuperação e
        Resiliência.
      </h2>

      <div class="flex flex-row items-center justify-center gap-5 mt-10">
        <div class="card cardInfo">
          <img class="r" :src="infoIcon" alt="" />

          <h3>Sobre o Painel de Avaliação</h3>

          <p>
            O Scoreboard monitoriza a implementação do Mecanismo de Recuperação
            e Resiliência (MRR), o pilar central do NextGenerationEU, e a
            evolução dos Planos de Recuperação e Resiliência de cada País. Este
            instrumento histórico disponibiliza até €653 mil milhões de euros em
            subvenções e empréstimos para os estados membros da UE de modo a
            reparar os danos da pandemia e preparar a Europa para o futuro.
          </p>
        </div>

        <div class="card cardInfo">
          <img class="r" :src="govIcon" alt="" />

          <h3>Objetivos Estratégicos</h3>

          <p>
            Os Estados Membros vão utilizar os fundos fornecidos pelo MRR para
            reformas e investimentos ambiciosos, tornando as suas economias e
            sociedades mais sustentáveis, resilientes e preparadas para as
            transições ecológica e digital. Explore o Scoreboard para acompanhar
            o progresso dos Estados-Membros ou da União Europeia no seu
            conjunto. Para mais informações sobre o Mecanismo de Recuperação e
            Resiliência, visite o
            <a
              class="link"
              target="_blank"
              href="https://reforms-investments.ec.europa.eu/recovery-and-resilience-facility-1_en"
            >
              website dedicado
            </a>
            e o
            <a
              class="link"
              target="_blank"
              href="https://reforms-investments.ec.europa.eu/recovery-and-resilience-facility-1_en"
            >
              mapa de projetos do MRR
            </a>.
          </p>
        </div>
      </div>

      <div class="flex flex-row gap-10 mt-10">
        <div  v-for="card in summaryCards"  :key="card.title"  class="card card2">
          <img :class="card.imageClass" :src="card.icon" alt="" />

          <div>
            <h4>{{ card.title }}</h4>

            <h3 :class="card.valueClass">
              {{ card.value }}
            </h3>

            <template v-if="card.progress">
              <progress class="progress" :value="percentage" max="100">
                {{ percentage }}%
              </progress>

              <p class="progressText text-[12px]!">
                {{ percentage }}% de €{{ allocated }}B alocado
              </p>
            </template>
          </div>
        </div>

        <div class="card card2">
          <Donut
            height="140%"
            :series="[100 - grants, grants]"
            :labels="['Empréstimos', 'Subvenções']"
            :colors="['var(--purple-color)', 'var(--yellow-color)']"
          />
        </div>
      </div>

      <div class="card cardInfo mt-10">
        <h3>Os Seis Pilares de Intervenção</h3>

        <p class="subtitle">
          Para garantir que os fundos do MRR impulsionam uma recuperação justa e
          moderna, todos os investimentos e reformas nacionais devem estar
          alinhados com seis áreas prioritárias, designadas como os “Pilares”.
          Estes pilares definem a direção estratégica da União Europeia para uma
          Europa mais verde, digital e resiliente.
        </p>

        <div class="pillars grid grid-cols-3 grid-rows-2">
          <div v-for="pillar in pillarCards" :key="pillar.id">
            <img :src="pillar.icon" alt="" />

            <p :class="pillar.colorClass">
              {{ pillar.title }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="m-10">
      <h1 class="title text-center">Alocação de Fundos PRR por País</h1>

      <h2 class="subtitle text-center w-full!">
        Informação sobre os PIBs dos países com base em dados de 2019
      </h2>

      <div class="grid grid-cols-[1fr_1fr] gap-10 mt-10 items-center">
        <div class="container">
          <EuropeMap :onClick="setCard" />
        </div>

        <div class="flex items-center justify-center">
          <div class="card w-3/4 justify-center min-h-40 relative">
            <img :src="info2Icon" class="absolute top-3 left-3" width="30" alt=""/>

            <div v-if="country && selectedCountryInfo" class="flex flex-col items-center">
              <DynamicImage folder="countries" :filename="country" />

              <h1 class="title text-[35px]! mt-5">
                {{ selectedCountryInfo.translation }}
              </h1>

              <h2 class="subtitle w-auto! mb-5">Resumo do País</h2>

              <table class="country-info">
                <tbody>
                  <tr>
                    <td>Subvenções Alocadas:</td>
                    <td>
                      €{{
                        (selectedCountryInfo.grants.allocate / 1e9).toFixed(2)
                      }}B
                    </td>
                  </tr>

                  <tr>
                    <td>Empréstimos Alocados:</td>
                    <td>
                      €{{
                        (selectedCountryInfo.loans.allocate / 1e9).toFixed(2)
                      }}B
                    </td>
                  </tr>

                  <tr>
                    <td>PIB do País:</td>
                    <td>
                      €{{ (selectedCountryInfo.pib[2019] / 1e9).toFixed(2) }}B
                    </td>
                  </tr>

                  <tr>
                    <td>Alocação como % do PIB:</td>
                    <td>
                      {{
                        (
                          (selectedCountryInfo.rrp.allocation /
                            selectedCountryInfo.pib[2019]) *
                          100
                        ).toFixed(2)
                      }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 v-else class="text-[30px] text-center text-(--title-color)">
              Clique num país para obter detalhes
            </h4>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10">
      <div class="card cardInfo mt-10 relative">
        <ExportButton :data="pillarsExportInfo" class="absolute top-3 right-3"/>

        <h3>Distribuição por Pilar</h3>

        <p class="subtitle">
          Distribuição percentual dos marcos e metas concluídos por pilar
          estratégico.
        </p>

        <Donut
          :series="pillarsChartInfo.series"
          :labels="pillarsChartInfo.labels"
          :colors="pillarsChartInfo.colors"
          height="200%"
        />
      </div>
    </section>

    <section class="mt-10">
      <div class="card cardInfo mt-10 relative">
        <ExportButton :data="fundsByCountryExportInfo" class="absolute top-3 right-3"/>

        <h3>Fundos por País (em milhares de milhões €)</h3>

        <p class="subtitle">
          Comparação entre os fundos atribuídos e desembolsados a cada
          Estado-Membro. Para informação mais detalhada, consultar a tabela
          abaixo.
        </p>

        <Bar
          :series="[
            {
              name: 'Fundos Atribuídos',
              data: CountryData.map((c) => ({
                x: c.translation,
                y: Number((c.rrp.allocation / 1e9).toFixed(2)),
                fillColor: 'var(--blue-color)',
              })),
            },
            {
              name: 'Fundos Desembolsados',
              data: CountryData.map((c) => ({
                x: c.translation,
                y: Number((c.rrp.total / 1e9).toFixed(2)),
                fillColor: 'var(--green-color)',
              })),
            },
          ]"
          :labels="CountryData.map((c) => c.abreviation)"
          height="200%"
        />
      </div>
    </section>

    <section class="mt-10">
      <div class="card cardInfo mt-10 relative">
        <ExportButton :data="memberStatesExportInfo" class="absolute top-3 right-3"/>

        <h3>Estados-Membros</h3>

        <p class="subtitle">
          A tabela seguinte apresenta, para cada país, o montante total alocado
          ao plano e o valor já investido até ao momento.
        </p>

        <table class="countries-table">
          <thead>
            <tr class="bg-[#f7f7f7]">
              <th>País</th>
              <th>Total Alocado</th>
              <th>Total Pago</th>
              <th>Progresso</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="c in CountryData" :key="c.id">
              <td class="flex flex-row items-center gap-3">
                <DynamicImage
                  class="w-10 aspect-video"
                  folder="countries"
                  :filename="c.id"
                />

                {{ c.translation }}
              </td>

              <td class="text-(--blue-color) font-bold">
                €{{ (c.rrp.allocation / 1e9).toFixed(2) }}B
              </td>

              <td class="text-(--green-color) font-bold">
                €{{ (c.rrp.total / 1e9).toFixed(2) }}B
              </td>

              <td class="flex flex-row gap-3 items-center">
                <progress
                  class="progress progress2"
                  :value="c.rrp.percentage"
                  max="100"
                >
                  {{ c.rrp.percentage }}%
                </progress>

                <p class="progressText m-0! text-[10px]!">
                  {{ c.rrp.percentage }}%
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import Bar from "../components/charts/Bar.vue";
import Donut from "../components/charts/Donut.vue";
import DynamicImage from "../components/DynamicImage.vue";
import EuropeMap from "../components/EuropeMap.vue";
import ExportButton from "../components/ExportButton.vue";

import { useDataStore } from "../stores/dataStore";

import infoIcon from "../assets/icons/info.svg";
import govIcon from "../assets/icons/gov.svg";
import bankIcon from "../assets/icons/bank.svg";
import increaseIcon from "../assets/icons/increase.svg";
import info2Icon from "../assets/icons/info2.svg";

import greenPillar from "../assets/pillars/green.svg";
import digitalPillar from "../assets/pillars/digital.svg";
import growthPillar from "../assets/pillars/growth.svg";
import mapPillar from "../assets/pillars/map.svg";
import healthPillar from "../assets/pillars/health.svg";
import helpPillar from "../assets/pillars/help.svg";

const store = useDataStore();

const country = ref("");

const loading = computed(() => store.isLoading);
const CountryData = computed(() => store.getCountries);
const pillars = computed(() => store.getPillars);

onMounted(async () => {
  await store.loadBaseData();
});

const allocated = computed(() =>
  Number((store.totalAllocated / 1e9).toFixed()),
);

const invested = computed(() =>
  Number((store.totalInvested / 1e9).toFixed()),
);

const percentage = computed(() => {
  if (store.totalAllocated === 0) return 0;

  return Number(((store.totalInvested / store.totalAllocated) * 100).toFixed());
});

const grants = computed(() => {
  const totalGrants = store.totalGrantsAllocated;
  const totalLoans = store.totalLoansAllocated;
  const total = totalGrants + totalLoans;

  if (total === 0) return 0;

  return Number(((totalGrants / total) * 100).toFixed(2));
});

const summaryCards = computed(() => [
  {
    title: "Total Alocado",
    value: `€${allocated.value}B`,
    icon: bankIcon,
    imageClass: "bg-[#2563f566]",
    valueClass: "text-(--blue-color)",
    progress: false,
  },
  {
    title: "Total Investido",
    value: `€${invested.value}B`,
    icon: increaseIcon,
    imageClass: "bg-[#10b98166] greenIMG",
    valueClass: "text-[#10b981]",
    progress: true,
  },
]);

const pillarCards = [
  {
    id: "green_transition",
    title: "Transição Verde",
    icon: greenPillar,
    colorClass: "text-[#286C42]",
  },
  {
    id: "digital_transformation",
    title: "Transição Digital",
    icon: digitalPillar,
    colorClass: "text-[#B82BAF]",
  },
  {
    id: "smart_growth",
    title: "Crescimento inteligente, inclusivo e sustentável",
    icon: growthPillar,
    colorClass: "text-[#068CEB]",
  },
  {
    id: "social_cohesion",
    title: "Coesão social e territorial",
    icon: mapPillar,
    colorClass: "text-[#EB5E06]",
  },
  {
    id: "health_resilience",
    title: "Saúde e resiliência económica, social e institucional",
    icon: healthPillar,
    colorClass: "text-[#EB0606]",
  },
  {
    id: "next_generation",
    title: "Políticas para a nova geração",
    icon: helpPillar,
    colorClass: "text-(--yellow-color)",
  },
];

const pillarColorMap = {
  green_transition: "#4EB856",
  digital_transformation: "#C77DFF",
  smart_growth: "#4FA8FF",
  social_cohesion: "#F4A259",
  health_resilience: "#FF6B6B",
  next_generation: "#FFD166",
};

// vai buscar info do gráfico de distribuição por pilar
const pillarsChartInfo = computed(() => {
  const doneByPillar = [];

  for (const pillar of pillars.value) {
    let done = 0;

    for (const country of CountryData.value) {
      // ? -> se existe... se não existir, considera como 0
      done += country.pillarsCount?.[pillar.id]?.done ?? 0;
    }

    doneByPillar.push(done);
  }

  let totalDone = 0;

  for (const value of doneByPillar) {
    totalDone += value;
  }

  const labels = [];
  const series = [];
  const colors = [];

  for (let i = 0; i < pillars.value.length; i++) {
    const pillar = pillars.value[i];
    const value = doneByPillar[i];

    labels.push(pillar.title);

    if (totalDone === 0) {
      series.push(0);
    } else {
      series.push(Number(((value / totalDone) * 100).toFixed(2)));
    }

    colors.push(pillarColorMap[pillar.id] ?? "var(--blue-color)");
  }

  return {
    labels,
    series,
    colors,
  };
});

const pillarsExportInfo = computed(() => ({
  fields: ["Pilar", "Percentagem"],
  data: pillarsChartInfo.value.labels.map((label, index) => [
    label,
    pillarsChartInfo.value.series[index] + "%",
  ]),
}));

const fundsByCountryExportInfo = computed(() => ({
  fields: ["País", "Fundos Atribuídos", "Fundos Desembolsados"],
  data: CountryData.value.map((country) => [
    country.translation,
    "€" + (country.rrp.allocation / 1e9).toFixed(2) + "B",
    "€" + (country.rrp.total / 1e9).toFixed(2) + "B",
  ]),
}));

const memberStatesExportInfo = computed(() => ({
  fields: ["País", "Total Alocado", "Total Pago", "Progresso"],
  data: CountryData.value.map((country) => [
    country.translation,
    "€" + (country.rrp.allocation / 1e9).toFixed(2) + "B",
    "€" + (country.rrp.total / 1e9).toFixed(2) + "B",
    country.rrp.percentage + "%",
  ]),
}));

const selectedCountryInfo = computed(() => {
  return store.getCountryById(country.value);
});

function setCard(countryKey) {
  country.value = countryKey;
}
</script>

<style scoped>
.page {
  padding: 1rem 2rem;
}

.card2 {
  flex: 1;
  height: 125px;
  flex-direction: row !important;
  gap: 10px;
  align-items: center;
}

.card2 img {
  width: 70px;
  height: 80px;
  padding: 0 10px !important;
  margin-left: 10px;
  border-radius: 13px;
}

.card2 div h4 {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: normal;
  margin: 0;
}

.card2 div h3 {
  font-size: 30px;
  font-weight: bold;
  margin: 0;
}

.pillars div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pillars p {
  text-transform: capitalize;
  text-align: center;
  font-size: 22px;
}

.pillars img {
  height: 150px;
  object-fit: cover;
}

.country-info tr td:last-child {
  padding: 5px 14px;
  color: var(--title-color);
  font-weight: bold;
}

.progressText {
  font-size: 10px;
  color: #656363;
  font-weight: 500;
  margin: 0;
  margin-top: 3px;
}

.countries-table th {
  text-align: left;
  padding: 10px;
  color: rgba(0, 0, 0, 0.55);
  font-weight: 500;
}

.countries-table td {
  padding: 10px;
}

.progress2::-webkit-progress-value {
  border-radius: 50px;
  background-color: var(--blue-color) !important;
}

.r {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>