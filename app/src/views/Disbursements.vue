<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BackLink from "../components/BackLink.vue";
import Bar from "../components/charts/Bar.vue";
import Button from "../components/Button.vue";
import Dropdown from "../components/Dropdown.vue";
import DynamicImage from "../components/DynamicImage.vue";
import ExportButton from "../components/ExportButton.vue";
import FilterChip from "../components/FilterChip.vue";
import Gauge from "../components/charts/Gauge.vue";

import { useDataStore } from "../stores/dataStore";

const store = useDataStore();
const route = useRoute();
const router = useRouter();

const selectedCountry = ref("all");
const showBackButton = ref(false);

const loading = computed(() => store.isLoading);
const CountryData = computed(() => store.getCountries);

const country = computed(() => {
  if (selectedCountry.value === "all") return null;

  return store.getCountryById(selectedCountry.value);
});

onMounted(async () => {
  await store.loadCountries();

  const countryKey = route.query.country;

  if (countryKey && store.getCountryById(countryKey)) {
    selectedCountry.value = countryKey;
    showBackButton.value = true;
  }
});

const countryOptions = computed(() => [
  // Concatena a primeira entrada "Todos os Países da UE" com os países obtidos da store
  {
    id: "all",
    translation: "Todos os Países da UE",
    abreviation: "all",
  },
  ...CountryData.value,
]);

const pillarItems = [
  {
    id: "green_transition",
    img: "green",
    name: "Transição Verde",
    color: "green-color",
  },
  {
    id: "digital_transformation",
    img: "digital",
    name: "Transição Digital",
    color: "purple-color",
  },
  {
    id: "smart_growth",
    img: "growth",
    name: "Crescimento inteligente, inclusivo e sustentável",
    color: "blue-color",
  },
  {
    id: "social_cohesion",
    img: "map",
    name: "Coesão social e territorial",
    color: "orange-color",
  },
  {
    id: "health_resilience",
    img: "health",
    name: "Saúde e resiliência económica, social e institucional",
    color: "red-color",
  },
  {
    id: "next_generation",
    img: "help",
    name: "Políticas para a nova geração",
    color: "yellow-color",
  },
];

// Cria uma lista de todas as distribuições de fundos, associando cada uma ao respetivo país 
const distributionsOriginal = computed(() =>
  CountryData.value.flatMap((country) =>
    country.disturbutions.map((distribution) => [
      country.translation,
      distribution[0],
      distribution[1],
      Number((distribution[2] / 1e9).toFixed(2)),
      country.id,
    ]),
  ),
);

const countriesLinksOriginal = computed(() =>
  CountryData.value.map((country) => ({
    ...country.top100,
    country: country.translation,
    countryKey: country.id,
  })),
);

const distributions = computed(() => {
  if (selectedCountry.value === "all") return distributionsOriginal.value;

  return distributionsOriginal.value.filter(
    (distribution) => distribution[4] === selectedCountry.value,
  );
});

const countriesLinks = computed(() => {
  if (selectedCountry.value === "all") return countriesLinksOriginal.value;

  return countriesLinksOriginal.value.filter(
    ({ countryKey }) => countryKey === selectedCountry.value,
  );
});

const totalGrantsPaid = computed(() => store.totalGrantsPaid);
const totalLoansPaid = computed(() => store.totalLoansPaid);
const totalGrantsAllocated = computed(() => store.totalGrantsAllocated);
const totalLoansAllocated = computed(() => store.totalLoansAllocated);
const totalGrantsPercentage = computed(() => store.totalGrantsPercentage);
const totalLoansPercentage = computed(() => store.totalLoansPercentage);

const grantsGaugeValue = computed(() => {
  if (!country.value) return totalGrantsPercentage.value;

  if (country.value.grants.allocate === 0) return 0;

  return (country.value.grants.total / country.value.grants.allocate) * 100;
});

const loansGaugeValue = computed(() => {
  if (!country.value) return totalLoansPercentage.value;

  if (country.value.loans.allocate === 0) return 0;

  return (country.value.loans.total / country.value.loans.allocate) * 100;
});

const grantsPaidValue = computed(() => {
  if (country.value) {
    return (country.value.grants.total / 1e9).toFixed(2);
  }

  return (totalGrantsPaid.value / 1e9).toFixed(2);
});

const loansPaidValue = computed(() => {
  if (country.value) {
    return (country.value.loans.total / 1e9).toFixed(2);
  }

  return (totalLoansPaid.value / 1e9).toFixed(2);
});

const grantsAllocatedValue = computed(() => {
  if (country.value) {
    return (country.value.grants.allocate / 1e9).toFixed(2);
  }

  return (totalGrantsAllocated.value / 1e9).toFixed(2);
});

const loansAllocatedValue = computed(() => {
  if (country.value) {
    return (country.value.loans.allocate / 1e9).toFixed(2);
  }

  return (totalLoansAllocated.value / 1e9).toFixed(2);
});

const pillarsPaidTotals = computed(() => {
  const totals = {
    green_transition: 0,
    digital_transformation: 0,
    smart_growth: 0,
    social_cohesion: 0,
    health_resilience: 0,
    next_generation: 0,
  };

  for (const country of CountryData.value) {
    for (const pillar of pillarItems) {
      totals[pillar.id] += country.pillarsPaid?.[pillar.id] ?? 0;
    }
  }

  return totals;
});

const selectedPillarsPaid = computed(() => {
  if (country.value?.pillarsPaid) return country.value.pillarsPaid;

  return pillarsPaidTotals.value;
});

const pillarsPaidChartData = computed(() =>
  pillarItems.map((pillar) => ({
    x: "Bilhões de Euros",
    y: Number((selectedPillarsPaid.value[pillar.id] / 1e9).toFixed(2)),
    fillColor: `var(--${pillar.color})`,
  })),
);

// ordena os desembolsos por data, do mais recente para o mais antigo
const distributionsSorted = computed(() =>
  [...distributions.value].sort(
    (a, b) => new Date(b[1]).getTime() - new Date(a[1]).getTime(),
  ),
);

const pillarsPaidExportData = computed(() => ({
  fields: pillarItems.map((pillar) => pillar.name),
  data: [
    pillarItems.map((pillar) => Number((selectedPillarsPaid.value[pillar.id] / 1e9).toFixed(2))),
  ],
}));

const selectedCountriesData = computed(() => {
  if (selectedCountry.value === "all") return CountryData.value;

  return CountryData.value.filter(
    (country) => country.id === selectedCountry.value
  );
});

const disbursementsExportData = computed(() => ({
  fields: ["País", "Data", "Tipo de Pagamento", "Valor (€B)"],
  data: distributions.value.map(([country, date, type, value]) => [
    country,
    new Date(date).toLocaleDateString("pt-PT"),
    type,
    Number(value).toLocaleString("pt-PT"),
  ]),
}));

const allBeneficiariesExportData = computed(() => ({
  fields: [
    "País",
    "Posição",
    "Beneficiário",
    "Montante",
    "Medida",
    "Região",
    "Data de atualização",
  ],
  data: selectedCountriesData.value.flatMap((country) =>
    (country.top100?.beneficiaries ?? []).map((beneficiary) => [
      country.translation,
      beneficiary.rank,
      beneficiary.name,
      "€" + (beneficiary.amount / 1e6).toFixed(2) + "M",
      beneficiary.measure,
      beneficiary.region,
      country.top100?.date ?? "",
    ]),
  ),
}));

function setSelectedCountry(countryKey) {
  selectedCountry.value = countryKey;
  showBackButton.value = false;

  router.replace({
    path: "/disbursements",
    query: countryKey === "all" ? {} : { country: countryKey },
  });
}
</script>

<template>
  <div v-if="!loading" class="page flex flex-col gap-10 relative">
    <BackLink
      v-if="showBackButton"
      :to="`/countries/${route.query.country}`"
      text="Voltar ao País"
    />

    <section>
      <h1 class="title">Desembolsos</h1>

      <p class="subtitle">
        Pagamentos realizados aos Estados Membros no âmbito do MRR, após
        verificação do cumprimento dos marcos e metas definidos nos Planos de
        Recuperação e Resiliência nacionais.
      </p>
    </section>

    <section>
      <div class="grid grid-cols-2 gap-5">
        <div class="card cardInfo">
          <h3>Como funcionam?</h3>

          <p>
            Assim que um Estado-Membro cumpre todos os marcos e metas relevantes
            para desbloquear um pagamento, pode submeter um pedido de
            desembolso. Após uma avaliação positiva por parte da Comissão, tendo
            em conta o parecer do Conselho, o montante associado ao cumprimento
            desse conjunto de marcos e metas é libertado.
          </p>
        </div>

        <div class="card">
          <p class="text-[20px]">Selecionar País</p>

          <div
            v-if="selectedCountry !== 'all'"
            class="flex flex-row gap-3 mt-5"
          >
            <FilterChip
              type="country"
              folder="countries"
              :filename="selectedCountry"
              :label="country?.translation"
              @remove="setSelectedCountry('all')"
            />
          </div>

          <Dropdown
            class="w-3/4 mt-5"
            menuClass="dropdownCustom"
            :items="countryOptions"
            @select="(item) => setSelectedCountry(item.id)"
          >
            <template #button>
              <div class="dropdownCustomBar">
                <p class="text-[20px] flex-1">
                  {{
                    selectedCountry === "all"
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
                  v-if="item.id !== 'all'"
                  class="h-7! aspect-video"
                  folder="countries"
                  :filename="item.id"
                />

                <p class="text-[20px]">
                  {{ item.translation }}
                </p>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-5">
      <div class="card disburCard">
        <h2>Desembolsos em Subvenções</h2>

        <div class="gauge-wrapper">
          <Gauge
            :series="[grantsGaugeValue]"
            :labels="['Progresso']"
            :colors="['var(--purple-color)']"
            :height="390"
          />
        </div>

        <h3 class="title text-(--purple-color)!">
          €{{ grantsPaidValue }}B
        </h3>

        <h4 class="subtitle subtitle2">
          De €{{ grantsAllocatedValue }}B alocados em subvenções
        </h4>

        <p v-if="country" class="desc">
          Este gráfico apresenta o progresso do desembolso das subvenções
          atribuídas a {{ country.translation }} no âmbito do Plano de
          Recuperação e Resiliência (PRR), evidenciando a relação entre o
          montante já recebido e o total de fundos aprovados para o país.
        </p>

        <p v-else class="desc">
          As subvenções desembolsadas no âmbito do Mecanismo de Recuperação e
          Resiliência (MRR) da União Europeia ascendem a €{{ grantsPaidValue }}B,
          correspondendo a apoios financeiros não reembolsáveis atribuídos aos
          Estados-Membros para financiar reformas e investimentos previstos nos
          seus planos nacionais.
        </p>
      </div>

      <div class="card disburCard">
        <h2>Desembolsos em Empréstimos</h2>

        <div class="gauge-wrapper">
          <Gauge
            :series="[loansGaugeValue]"
            :labels="['Progresso']"
            :colors="['var(--yellow-color)']"
            :height="390"
          />
        </div>

        <h3 class="title text-(--yellow-color)!">
          €{{ loansPaidValue }}B
        </h3>

        <h4 class="subtitle subtitle2">
          De €{{ loansAllocatedValue }}B alocados em empréstimos
        </h4>

        <p v-if="country" class="desc">
          Este gráfico apresenta o progresso do desembolso dos empréstimos
          atribuídos a {{ country.translation }} no âmbito do Plano de
          Recuperação e Resiliência (PRR), evidenciando a relação entre o
          montante já recebido e o total de fundos aprovados para o país.
        </p>

        <p v-else class="desc">
          Os empréstimos desembolsados no âmbito do Mecanismo de Recuperação e
          Resiliência (MRR) da União Europeia totalizam €{{ loansPaidValue }}B,
          correspondendo a apoios financeiros reembolsáveis concedidos aos
          Estados-Membros para financiar reformas e investimentos previstos nos
          seus planos nacionais.
        </p>
      </div>
    </section>

    <section class="card relative">
      <ExportButton
        :data="pillarsPaidExportData"
        class="absolute top-3 right-3"
      />

      <h2 class="title">Desembolsos por Pilar</h2>

      <div class="flex flex-row h-150">
        <div class="pillars-labels flex flex-col pt-7 pb-10">
          <div
            v-for="pillar in pillarItems"
            :key="pillar.id"
            class="pillar-label"
          >
            <DynamicImage
              class="pillar-icon"
              :class="{
                'pillar-icon-smaller':
                  pillar.img === 'growth' || pillar.img === 'help',
              }"
              folder="pillars"
              format="svg"
              :filename="pillar.img"
            />

            <p>{{ pillar.name }}</p>
          </div>
        </div>

        <Bar
          :series="[
            {
              name: 'Desembolsado',
              data: pillarsPaidChartData,
            },
          ]"
          :labels="['', '', '', '', '', '']"
          :horizontal="true"
          height="100%"
          class="flex-1"
        />
      </div>

      <p class="subtitle">
        O gráfico apresenta a distribuição dos desembolsos do Mecanismo de
        Recuperação e Resiliência (MRR) pelos seis pilares de política. Os
        valores refletem os pagamentos brutos, incluindo a compensação do
        pré-financiamento. Os resultados estão apresentados em bilhões de euros.
      </p>
    </section>

    <section class="card relative">
      <ExportButton
        :data="disbursementsExportData"
        class="absolute top-3 right-3"
      />

      <h2 class="title">Lista de desembolsos efetuados por País</h2>

      <p class="subtitle">
        A seguinte lista apresenta os registos dos desembolsos efetuados,
        segundo o Mecanismo de Recuperação e Resiliência (RRF) por cada
        Estado-Membro.
      </p>

      <div class="px-20 max-h-150 overflow-y-scroll">
        <table class="disbursTable w-full text-center mt-5">
          <thead>
            <tr>
              <th>País</th>
              <th>Data</th>
              <th>Tipo Pagamento</th>
              <th>Valores (€B)</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="[countryName, date, type, value] in distributions"
              :key="`${countryName}-${date}-${type}`"
            >
              <td>{{ countryName }}</td>

              <td>
                {{ new Date(date).toLocaleDateString("pt-PT") }}
              </td>

              <td>{{ type }}</td>

              <td>
                €{{ Number(value).toLocaleString("pt-PT") }}B
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card relative">
      <ExportButton :data="allBeneficiariesExportData" class="absolute top-3 right-3"/>

      <h1 class="title">100 maiores beneficiários finais por país</h1>

      <p class="subtitle">
        Esta tabela apresenta, por Estado-Membro, a data de atualização, o portal
        nacional oficial e o acesso à lista dos 100 maiores beneficiários finais
        dos fundos do MRR. Clique no botão "Exportar" para obter toda a
        informação num determinado formato.
      </p>

      <div class="px-20 max-h-150 overflow-y-scroll">
        <table class="disbursTable w-full text-center mt-5">
          <thead>
            <tr>
              <th>País</th>
              <th>Data de atualização</th>
              <th>Portal nacional</th>
              <th>Lista</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="{ country, date, link, countryKey } in countriesLinks" :key="countryKey">
              <td class="font-semibold">
                {{ country }}
              </td>

              <td>
                {{ date }}
              </td>

              <td>
                <Button :link="link" :external="true" class="w-32! h-9! hover:brightness-90 transition duration-300">
                  Portal oficial
                </Button>
              </td>

              <td>
                <router-link
                  :to="{
                    path: `/disbursements/top100/${countryKey}`,
                    query:
                      selectedCountry === 'all'
                        ? {}
                        : { country: selectedCountry },
                  }"
                  class="inline-block"
                >
                  <Button class="w-28! h-9! hover:brightness-90 transition duration-300">
                    Ver lista
                  </Button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2 class="title">Lista de desembolsos previstos por País</h2>

      <p class="subtitle">
        Esta linha temporal apresenta os desembolsos previstos do Mecanismo de
        Recuperação e Resiliência (MRR) aos Estados-Membros. Cada entrada indica
        a data estimada do pagamento, o país beneficiário, o montante previsto e
        o tipo de financiamento (subvenções ou empréstimos). As datas baseiam-se
        no calendário indicativo de pagamentos e podem estar sujeitas a
        alterações.
      </p>

      <div :key="selectedCountry" class="max-h-200 overflow-y-auto flex flex-col items-center">
        <div
          v-for="[countryName, date, type, value, key] in distributionsSorted"
          :key="`${key}-${date}-${type}-${value}`"
          class="flex flex-row items-center gap-5 font-medium text-[20px] w-100"
        >
          <span class="date">{{ date }}</span>

          <div class="relative h-25 w-1 bg-black">
            <div
              class="absolute top-1/2 left-1/2 -translate-1/2 h-6 aspect-square bg-white border-[5px] border-[#fad872] rounded-full"
            ></div>
          </div>

          <div class="text-[17px] font-semibold">
            <div class="flex flex-row gap-1">
              <DynamicImage class="w-8! aspect-video" folder="countries" :filename="key"/>

              <p>{{ countryName }}</p>
            </div>

            <p>
              €{{ Number(value).toLocaleString("pt-PT") }}B - {{ type }}
            </p>
          </div>
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
  margin: 0.5rem 0 0;
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

.pillars-labels {
  width: 260px;
  flex-shrink: 0;
}

.pillar-label {
  flex: 1;
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
  max-width: 190px;
}

.gauge-wrapper {
  width: 100%;
  height: 230px;
  margin: -1.5rem auto -2.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: visible;
}

.disburCard h3 {
  margin-top: -1rem;
}
</style>