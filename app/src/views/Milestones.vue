<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Bar from "../components/charts/Bar.vue";
import Donut from "../components/charts/Donut.vue";
import Dropdown from "../components/Dropdown.vue";
import DynamicImage from "../components/DynamicImage.vue";
import ExportButton from "../components/ExportButton.vue";
import { useDataStore } from "../stores/dataStore";
import FilterChip from "../components/FilterChip.vue";
import BackLink from "../components/BackLink.vue";

const store = useDataStore();
const route = useRoute();

const selectedCountry = ref("all");
const selectedPillar = ref("all");
const showBackButton = ref(false);

// Paginação da tabela, feita porque caso contrário, a tab de millestones teria muita pouco performance, visto que tem mais de 1000 entradas
const currentPage = ref(1);
const itemsPerPage = ref(25);

const loading = computed(() => store.isLoading);
const CountryData = computed(() => store.getCountries);
const pillarsWithoutAll = computed(() => store.getPillars);

onMounted(async () => {
  await store.loadBaseData();

  if (route.query.country) {
    const countryKey = route.query.country;

    if (store.getCountryById(countryKey)) {
      setSelectedCountry(countryKey);
      showBackButton.value = true;
    }
  }
});

const country = computed(() => {
  if (selectedCountry.value === "all") return undefined;
  return store.getCountryById(selectedCountry.value);
});

const pillars = computed(() => [
  {
    id: "all",
    title: "Todos as Políticas",
  },
  ...pillarsWithoutAll.value,
]);

const pillarsWithRepower = computed(() => [
  ...pillarsWithoutAll.value,
  {
    id: "repower",
    title: "REPowerEU",
    img: "repower",
    color: "",
  },
]);

const pillar = computed(() => {
  return pillars.value.find((p) => p.id === selectedPillar.value);
});

const listMilestones = computed(() =>
  store.getMilestonesByFilters(selectedCountry.value, selectedPillar.value),
);

// Paginação calculada
const totalMilestones = computed(() => listMilestones.value.length);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalMilestones.value / itemsPerPage.value)),
);

const paginatedMilestones = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return listMilestones.value.slice(start, end);
});

const investments = computed(() => {
  return store.getCountryInvestmentsCount(selectedCountry.value, selectedPillar.value,);
});

const reforms = computed(() => {
  return store.getCountryReformsCount(selectedCountry.value, selectedPillar.value);
});

const milestonesDone = computed(() => {
  return store.getMilestonesDonePercentage(selectedCountry.value, selectedPillar.value);
});

const exportData = computed(() => ({
  fields: ["País", "Medida", "Tipo", "Prazo", "Estado", "Pilares"],
  data: listMilestones.value.map(
    ({ country, measure, type, deadline, status, pillars: pillarsL }) => [
      store.getCountryById(country)?.translation,
      measure,
      type,
      deadline,
      status,
      pillarsL
        .map((e) => pillarsWithRepower.value.find((p) => p.id === e)?.title)
        .join(", "),
    ],
  ),
}));

function setSelectedCountry(countryKey) {
  selectedCountry.value = countryKey;
  showBackButton.value = false;
  currentPage.value = 1;
}

function setSelectedPillar(pillarKey) {
  selectedPillar.value = pillarKey;
  currentPage.value = 1;
}

function getPillarById(id) {
  return pillarsWithRepower.value.find((p) => p.id === id);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<template>
  <div v-if="!loading" class="page flex flex-col gap-10 relative">
    <BackLink v-if="showBackButton" :to="`/countries/${route.query.country}`" text="Voltar ao País"/>

    <section>
      <h1 class="title">Marcos e Metas</h1>
      <p class="subtitle">
        Representam etapas que permitem acompanhar a implementação dos PRRs
      </p>
    </section>

    <section>
      <div class="grid grid-cols-2 gap-5">
        <div class="card">
          <p class="text-[20px]">Selecionar País</p>

          <div v-if="selectedCountry !== 'all'" class="flex flex-row gap-3 mt-5">
            <FilterChip
              folder="countries"
              type="country"
              :filename="selectedCountry"
              :label="country?.translation"
              @remove="setSelectedCountry('all')"
            />
          </div>

          <Dropdown
            menuClass="dropdownCustom"
            class="w-3/4"
            :items="[
              {
                id: 'all',
                translation: 'Todos os Países da UE',
                abreviation: 'all',
              },
              ...CountryData,
            ]"
            @select="(item) => setSelectedCountry(item.id)"
          >
            <template #button>
              <div class="dropdownCustomBar mt-5">
                <p class="text-[20px] flex-1">
                  {{
                    selectedCountry == "all"
                      ? "Todos os Países da UE"
                      : country?.translation
                  }}
                </p>
                <img src="../assets/icons/arrow.svg" alt="" />
              </div>
            </template>

            <template #item="{ item }">
              <div class="flex flex-row gap-3 items-center dropdownCustomItem">
                <DynamicImage
                  v-if="item.id != 'all'"
                  class="h-7! aspect-video"
                  folder="countries"
                  :filename="item.id"
                />
                <p class="text-[20px]">{{ item.translation }}</p>
              </div>
            </template>
          </Dropdown>
        </div>

        <div class="card">
          <p class="text-[20px]">Selecione o Pilar da Política</p>

          <div v-if="selectedPillar !== 'all'" class="flex flex-row gap-3 mt-5">
            <FilterChip
              v-if="selectedPillar !== 'all' && pillar?.img"
              type="pillar"
              folder="pillars"
              :filename="pillar.img"
              format="svg"
              :label="pillar.title"
              @remove="setSelectedPillar('all')"
            />
          </div>

          <Dropdown
            class="w-3/4"
            menuClass="dropdownCustom"
            :items="pillars"
            @select="(item) => setSelectedPillar(item.id)"
          >
            <template #button>
              <div class="dropdownCustomBar mt-5">
                <p class="text-[20px] flex-1">
                  {{ pillar?.title }}
                </p>
                <img src="../assets/icons/arrow.svg" alt="" />
              </div>
            </template>

            <template #item="{ item }">
              <div class="flex flex-row gap-3 items-center dropdownCustomItem">
                <DynamicImage
                  v-if="item.id !== 'all' && item.img"
                  class="h-12! aspect-square"
                  folder="pillars"
                  :filename="item.img"
                  format="svg"
                />

                <p class="text-[20px]">
                  {{ item.title }}
                </p>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </section>

    <section class="card cardInfo">
      <h3>Como funcionam?</h3>
      <p class="text-[25px]! text-(--subtitle-color) text-justify">
        Os marcos e metas desempenham um papel central na monitorização dos
        investimentos e das reformas estruturais, assegurando que os recursos
        aplicados geram impactos concretos. Cada marco representa uma etapa
        qualitativa a atingir, enquanto cada meta define um objetivo
        quantitativo referente aos resultados esperados.Estes instrumentos estão
        diretamente alinhados com os pilares da política europeia. Assim, não só
        garantem que os investimentos e reformas são implementados de forma
        eficaz, promovendo sustentabilidade, inovação e crescimento inclusivo.
      </p>
    </section>

    <section class="grid grid-cols-2 gap-5">
      <div class="card card2">
        <h3>Marcos e metas por tipo de indicador</h3>
        <div>
          <Bar
            :series="[
              {
                name: 'Marcos e Metas',
                data: [investments, reforms].map((v) => ({
                  x: 'Dados',
                  y: v,
                  fillColor: '#4425ed',
                })),
              },
            ]"
            :labels="['Investimentos', 'Reformas']"
            height="200%"
          />
        </div>
        <p>
          Este gráfico exibe o número total de marcos e metas, divididos entre
          reformas e investimentos. As reformas correspondem a mudanças nas
          políticas públicas, legislação ou funcionamento das instituições,
          enquanto os investimentos dizem respeito a projetos e despesas
          concretas destinados a implementar infraestruturas, serviços ou
          programas.
        </p>
      </div>

      <div class="card card2">
        <h3>Estado de cumprimento de marcos e metas</h3>
        <div>
          <Donut
            :series="[100 - milestonesDone, milestonesDone]"
            :labels="['Não Cumprido', 'Cumprido']"
            :colors="['#beb9b8', '#45b545']"
            height="200%"
          />
        </div>
        <p>
          Este gráfico apresenta a proporção de marcos e metas que foram
          alcançados com sucesso. Um marco ou meta é considerado alcançado
          quando a ação correspondente foi concluída e verificada de acordo com
          os critérios e documentação do projeto.
        </p>
      </div>
    </section>

    <section class="card cardInfo gap-4">
      <h3>Relatórios semestrais por parte dos Estados-Membros</h3>
      <a
        target="_blank"
        class="link text-[30px]!"
        href="https://ec.europa.eu/economy_finance/recovery-and-resilience-scoreboard/assets/thematic_analysis/bi-annual_reporting_factsheet-spring_2025.pdf"
      >
        Latest Bi-annual Reporting Factsheet
      </a>
      <p class="text-[25px]! text-(--subtitle-color) text-justify">
        Apresenta a versão mais recente do factsheet, um documento informativo
        que resume os dados do relatório semestral, com registros de versões
        anteriores disponíveis
      </p>
    </section>

    <section class="card relative! cardInfo">
      <ExportButton :data="exportData" class="absolute top-3 right-3"/>

      <h3>Lista de marcos e metas por indicador</h3>

      <p class="my-6! subtitle text-[14px]! font-semibold">
        Abaixo encontram-se apresentadas todas as medidas incluídas nos Planos
        de Recuperação e Resiliência dos Estados-Membros. Esta listagem reúne
        informação detalhada sobre cada medida, incluindo as áreas de política
        pública para as quais contribui, os marcos e metas associados, bem como
        o respetivo estado de implementação. Este conjunto estruturado de dados
        assegura maior transparência, facilita o acompanhamento da execução dos
        planos e permite uma monitorização sistemática do progresso alcançado
        por cada Estado-Membro, tanto ao nível financeiro como ao nível dos
        resultados concretos obtidos.
      </p>

      <div class="w-full h-px bg-black"></div>

      <div class="grid grid-cols-6 gap-x-3 mt-3">
        <div
          v-for="{ id, title, color, img } in pillarsWithRepower"
          :key="id"
          class="flex flex-row gap-2 items-center flex-1"
        >
          <div v-if="color" class="rounded-full h-3 aspect-square" :style="{ backgroundColor: color }"></div>

          <DynamicImage v-else class="w-3" folder="pillars" :filename="img"/>

          <p class="text-[12px]! m-0!">{{ title }}</p>
        </div>
      </div>

      <div class="px-10 max-h-150 overflow-y-scroll">
        <table class="disbursTable w-full text-center mt-5">
          <thead>
            <tr>
              <th>País</th>
              <th class="w-100">Medida</th>
              <th class="w-30">Reforma/ Investimento</th>
              <th>Prazo</th>
              <th>Estado</th>
              <th class="w-40">Pilares da Política / REPowerEU</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="{
                country,
                deadline,
                measure,
                pillars: pillarsL,
                status,
                type,
              } in paginatedMilestones"
              :key="`${country}-${deadline}-${measure}-${type}`"
            >
              <td>
                {{ CountryData.find((e) => e.id == country)?.translation }}
              </td>

              <td>{{ measure }}</td>
              <td>{{ type }}</td>
              <td>{{ deadline }}</td>
              <td>{{ status }}</td>

              <td>
                <div class="container flex-row! gap-1">
                  <div v-for="pillarId in pillarsL" :key="pillarId">
                    <template v-if="getPillarById(pillarId)">
                      <div
                        v-if="getPillarById(pillarId)?.color"
                        class="rounded-full h-2 aspect-square"
                        :style="{
                          backgroundColor: getPillarById(pillarId)?.color,
                        }"
                      ></div>

                      <DynamicImage
                        v-else
                        class="w-3"
                        folder="pillars"
                        :filename="getPillarById(pillarId)?.img"
                      />
                    </template>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center items-center gap-4 my-5">
          <button class="paginationButton" :disabled="currentPage === 1" @click="previousPage">
            Anterior
          </button>

          <span class="text-[14px] font-semibold">
            Página {{ currentPage }} de {{ totalPages }}
            — {{ totalMilestones }} marcos/metas
          </span>

          <button class="paginationButton" :disabled="currentPage === totalPages" @click="nextPage">
            Seguinte
          </button>
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

.disburCard {
  text-align: center;
}

.disburCard h2 {
  font-size: 25px;
  font-weight: 500;
  color: var(--title-color);
  margin: 1rem 0;
}

.disburCard .desc {
  margin: 1rem 0;
  text-align: justify;
  padding: 0 4rem;
  color: #a2a09f;
  font-weight: 500;
  font-size: 14px;
}

.disbursTable,
.disbursTable th,
.disbursTable td {
  border: 1px solid #aaaaaa;
  border-collapse: collapse;
  padding: 10px;
}

.card2 {
  display: flex;
  gap: 2rem;
}

.card2 h3 {
  text-align: center;
  font-size: 25px;
  font-weight: 600;
  color: var(--title-color);
}

.card2 p {
  padding: 0 1rem;
  text-align: justify;
  font-size: 14px;
  font-weight: 600;
  color: var(--subtitle-color);
}

.selected-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 12px;
  background-color: #f7f7f7;
  border: 1px solid #00000015;
  color: #000000aa;
  font-size: 16px;
}

.selected-filter strong {
  color: var(--title-color);
  font-weight: 700;
}

.selected-filter-flag {
  width: 28px;
  height: 18px;
  object-fit: cover;
  display: block;
}

.selected-filter-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  display: block;
}

.selected-filter-clear {
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--blue-color);
  font-weight: 600;
}

.paginationButton {
  padding: 8px 16px;
  border-radius: 10px;
  background-color: var(--blue-color);
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.paginationButton:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>