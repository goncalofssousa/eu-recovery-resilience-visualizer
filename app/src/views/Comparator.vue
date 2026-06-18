<script setup>
import { computed, onMounted, ref } from "vue";
import Bar from "../components/charts/Bar.vue";
import Radar from "../components/charts/Radar.vue";
import Dropdown from "../components/Dropdown.vue";
import DynamicImage from "../components/DynamicImage.vue";
import ExportButton from "../components/ExportButton.vue";
import { useDataStore } from "../stores/dataStore";
import FilterChip from "../components/FilterChip.vue";

const colors = ["green-color", "purple-color", "blue-color", "orange-color"];

const store = useDataStore();

const loading = computed(() => store.isLoading);
const CountryData = computed(() => store.getCountries);
const pillars = computed(() => store.getPillars);

const countries = ref([]);
const selectedCountry = ref(null);

onMounted(async () => {
  await store.loadBaseData();
});

const country = computed(() => {
  if (!selectedCountry.value) return null;
  return store.getCountryById(selectedCountry.value);
});

const availableCountries = computed(() =>
  CountryData.value.filter(
    (country) => !countries.value.includes(country.id),
  ),
);

const bestCountry = computed(() => {
  if (countries.value.length === 0) {
    return null;
  }

  let bestCountryId = countries.value[0];
  let bestRate = store.getCountryExecutionRate(bestCountryId);

  for (const countryId of countries.value) {
    const currentRate = store.getCountryExecutionRate(countryId);

    if (currentRate > bestRate) {
      bestCountryId = countryId;
      bestRate = currentRate;
    }
  }

  return bestCountryId;
});

const bestCountryDone = computed(() => {
  if (!bestCountry.value) return 0;
  return store.getCountryMilestonesDone(bestCountry.value);
});

const bestCountryTotal = computed(() => {
  if (!bestCountry.value) return 0;
  return store.getCountryMilestonesTotal(bestCountry.value);
});

const comparedTotals = computed(() => {
  const totals = {
    allocated: 0,
    disbursed: 0,
  };

  for (const countryId of countries.value) {
    const country = store.getCountryById(countryId);

    if (!country) {
      continue;
    }

    totals.allocated += country.rrp.allocation;
    totals.disbursed += country.rrp.total;
  }

  return totals;
});

const exportData = computed(() => ({
  fields: [
    "País",
    "Fundos Atribuídos",
    "Fundos Desembolsados",
    "Marcos Concluídos",
    "Marcos Totais",
    "Taxa de Execução",
  ],
  data: countries.value.map((id) => {
    const country = store.getCountryById(id);

    if (!country) return [];
    
    return [
      country.translation,
      "€" + (country.rrp.allocation / 1e9).toFixed(2) + "B",
      "€" + (country.rrp.total / 1e9).toFixed(2) + "B",
      store.getCountryMilestonesDone(id),
      store.getCountryMilestonesTotal(id),
      store.getCountryExecutionRate(id).toFixed(2) + "%",
    ];
  }),
}));

function selectCountry(country) {
  selectedCountry.value = country.id;
}

function addCountry() {
  if (!selectedCountry.value) return;

  if (!countries.value.includes(selectedCountry.value)) {
    countries.value.push(selectedCountry.value);
  }

  selectedCountry.value = null;
}

function removeCountry(country) {
  countries.value = countries.value.filter((c) => c !== country);
}

</script>

<template>
  <div v-if="!loading" class="page flex flex-col gap-10 relative">
    <ExportButton :data="exportData" v-if="countries.length > 1" class="absolute top-10 right-10"/>

    <section class="w-full">
      <h1 class="title">Comparação entre Países</h1>
      <p class="subtitle">
        Compare o desempenho e investimento entre Estados-Membros.
      </p>
    </section>

    <section class="card">
      <h2 class="title">Países Selecionados</h2>
      <p class="subtitle">Selecione até 4 países para comparação. (Mínimo 2)</p>

      <div v-if="countries.length > 0" class="flex flex-row gap-3 mt-5">
        <FilterChip
          v-for="country in countries"
          :key="country"
          type="country"
          folder="countries"
          :filename="country"
          :label="store.getCountryById(country)?.translation"
          @remove="removeCountry(country)"
        />
     </div>

      <div class="flex flex-row gap-3 mt-5">
        <Dropdown menuClass="dropdownCustom" class="w-75" :items="availableCountries" @select="selectCountry">
          <template #button v-if="countries.length <= 3">
            <div class="dropdownCustomBar">
              <p>
                {{
                  selectedCountry && country ? country.translation : "Adicionar país..."
                }}
              </p>
              <img src="../assets/icons/arrow.svg" alt="" />
            </div>
          </template>

          <template #item="{ item }">
            <p class="dropdownCustomItem">
              {{ item.translation }}
            </p>
          </template>
        </Dropdown>

        <button
          v-if="countries.length <= 3"
          @click="addCountry"
          class="button cursor-pointer flex flex-row gap-2 items-center text-white rounded-[10px] px-3 py-1.5"
          :style="{
            backgroundColor: selectedCountry ? 'black' : '#00000040',
          }"
        >
          <img class="h-3 aspect-square" src="../assets/icons/plus.svg" alt=""/>
          Adicionar
        </button>
      </div>
    </section>

    <section v-if="countries.length > 1" class="flex flex-row gap-5 flex-wrap">
      <div class="card space-y-5 w-50" v-for="country in countries" :key="country">
        <div class="flex flex-row gap-2 items-center">
          <div class="h-3 -mt-0.5 aspect-video">
            <DynamicImage folder="countries" :filename="country" />
          </div>
          <p>
            {{ store.getCountryById(country)?.translation }}
          </p>
        </div>

        <div class="space-y-1">
          <h2 class="subsubtitle">Fundos Atribuídos</h2>
          <p class="info text-(--blue-color)">
            €{{(store.getCountryById(country)?.rrp.allocation / 1e9).toFixed(2)}}B
          </p>
        </div>

        <div class="space-y-1">
          <h2 class="subsubtitle">Desembolsados</h2>
          <p class="info text-(--green-color)">
            €{{(store.getCountryById(country)?.rrp.total / 1e9).toFixed(2)}}B
          </p>
        </div>

        <div class="space-y-1">
          <h2 class="subsubtitle">Marcos Concluídos</h2>
          <p class="info">
            {{ store.getCountryMilestonesDone(country) }}/{{ store.getCountryMilestonesTotal(country) }}
          </p>
        </div>

        <div class="space-y-1">
          <h2 class="subsubtitle">Taxa de Execução</h2>
          <p class="bg-black w-fit text-white px-3 py-1 rounded-[10px]">
            {{ store.getCountryExecutionRate(country).toFixed() }}%
          </p>
        </div>
      </div>
    </section>

    <section v-if="countries.length > 1" class="card">
      <h2 class="title">Comparação da Taxa de Execução</h2>
      <p class="subtitle">Percentagem de marcos e metas já alcançados</p>

      <Bar
        :series="[
          {
            name: 'Taxa de execução',
            data: countries.map((c, i) => ({
              x: 'Percentagem (%)',
              y: store.getCountryExecutionRate(c).toFixed(2),
              fillColor: 'var(--' + colors[i] + ')',
            })),
          },
        ]"
        :labels="countries.map((c) => store.getCountryById(c)?.translation)"
        height="100%"
        class="flex-1"
      />
    </section>

    <section v-if="countries.length > 1" class="card">
      <h2 class="title">Fundos Desembolsados Por Pilar</h2>
      <p class="subtitle">
        Comparação dos valores já desembolsados em cada área estratégica
      </p>

      <Bar
        :series="
          countries.map((c, i) => ({
            name: store.getCountryById(c)?.translation,
            data: pillars.map(({ id }) => ({
              x: 'Milhões De Euros',
              y: ((store.getCountryById(c)?.pillarsPaid[id] || 0) / 1e6).toFixed(),
              fillColor: 'var(--' + colors[i] + ')',
            })),
          }))
        "
        :labels="pillars.map((p) => p.title.split(',')[0])"
        height="200%"
        class="flex-1"
      />
    </section>

    <section class="flex flex-row gap-5">
  <div v-if="countries.length > 1" class="card w-full">
    <h2 class="title">Distribuição dos Marcos e Metas por Pilar</h2>
    <p class="subtitle">
      Percentagem de marcos e metas associados a cada pilar estratégico, por país.
    </p>

    <Radar
      :series="
        countries.map((c, i) => {
          const totalMilestones = pillars.reduce(
            (sum, { id }) =>
              sum + (store.getCountryById(c)?.pillarsCount?.[id]?.total || 0),
            0,
          );

          return {
            name: store.getCountryById(c)?.translation,
            color: 'var(--' + colors[i] + ')',
            data: pillars.map(({ id }) => ({
              x: 'Percentagem',
              y: totalMilestones === 0 ? 0 : Number((((store.getCountryById(c)?.pillarsCount?.[id]?.total || 0) / totalMilestones) * 100).toFixed(2),),
            })),
          };
        })
      "
      :labels="pillars.map((p) => p.title.split(',')[0])"
      height="300px"
    />
  </div>
      <!-- div que ira conter toda a analise comparativa do paises. Usa-se condicional para só mostrar esta secção quando houver mais do que 1 país selecionado, uma vez que não faz sentido comparar apenas um pais -->
      <div v-if="bestCountry && countries.length > 1" class="card space-y-5 w-full">
        <div class="flex flex-row gap-3 items-center">
          <img src="../assets/icons/update.svg" alt="" />
          <h2 class="title">Análise Comparativa</h2>
        </div>

        <div class="card3 bg-[#F1FDF4] space-y-1">
          <div class="flex flex-row gap-1 items-center text-[#19532E] font-bold text-[20px]">
            <p>Melhor Desempenho:</p>
            <DynamicImage class="w-4 h-4" folder="countries" :filename="bestCountry"/>
            <p>{{ store.getCountryById(bestCountry)?.translation }}</p>
          </div>
          <p class="text-[#16813B]">
            Taxa de execução dos marcos e metas de
            {{ store.getCountryExecutionRate(bestCountry).toFixed() }}% com
            {{ bestCountryDone }}/{{ bestCountryTotal }} marcos concluídos.
          </p>
        </div>

        <div class="card3 bg-[#EFF6FE] space-y-3 text-[#1D398B] font-bold">
          <p class="text-[20px]">Totais Comparados</p>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-[#1348E1] font-normal">Total Atribuído</p>
              <p>€{{ (comparedTotals.allocated / 1e9).toFixed(2) }}B</p>
            </div>

            <div class="space-y-1">
              <p class="text-[#1348E1] font-normal">Total Desembolsado</p>
              <p>€{{ (comparedTotals.disbursed / 1e9).toFixed(2) }}B</p>
            </div>
          </div>
        </div>

        <div class="card3 bg-[#FAF5FF] space-y-3">
          <p class="font-bold text-[20px] text-[#561B88]">Marcos e Metas</p>

          <div class="flex flex-col gap-1">
            <div
              v-for="country in countries" :key="country" class="flex flex-row items-center gap-2 text-[#8A1AD7]">
              <DynamicImage class="w-3 h-3" folder="countries" :filename="country"/>

              <p class="flex-1">
                {{ store.getCountryById(country)?.translation }}
              </p>

              <p>
                {{ store.getCountryMilestonesDone(country) }}
                concluídos,
                {{
                  store.getCountryMilestonesTotal(country) -
                  store.getCountryMilestonesDone(country)
                }}
                pendentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card3 {
  padding: 1rem 1rem;
  border-radius: 15px;
}

.card .title {
  font-size: 20px;
  font-weight: bold;
  color: var(--title-color);
}

.card .subtitle {
  font-size: 14px;
  color: var(--subtitle-color);
}

.card .subsubtitle {
  font-size: 15px;
  color: #00000055;
}

.card .info {
  font-weight: bold;
  font-size: 25px;
}

.button:hover {
  background-color: #0000006e !important;
  transition: background-color 0.3s ease;
}
</style>