<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import BackLink from "../components/BackLink.vue";
import DynamicImage from "../components/DynamicImage.vue";
import ExportButton from "../components/ExportButton.vue";

import { useDataStore } from "../stores/dataStore";

const store = useDataStore();
const route = useRoute();

const loading = computed(() => store.isLoading);

onMounted(async () => {
  await store.loadCountries();
});

const countryKey = computed(() => route.params.countryKey);

const country = computed(() => {
  return store.getCountryById(countryKey.value);
});

const beneficiaries = computed(() => {
  return country.value?.top100?.beneficiaries ?? [];
});

const backToDisbursements = computed(() => {
  const countryQuery = route.query.country;

  if (!countryQuery) {
    return "/disbursements";
  }

  return `/disbursements?country=${countryQuery}`;
});

const exportData = computed(() => ({
  fields: [
    "Posição",
    "Beneficiário",
    "Montante",
    "Medida",
    "Região",
    "Data de atualização",
  ],
  data: beneficiaries.value.map((beneficiary) => [
    beneficiary.rank,
    beneficiary.name,
    "€" + (beneficiary.amount / 1e6).toFixed(2) + "M",
    beneficiary.measure,
    beneficiary.region,
    country.value?.top100?.date ?? "",
  ]),
}));
</script>

<template>
  <div v-if="!loading" class="page flex flex-col gap-10 relative">
   <BackLink :to="backToDisbursements" text="Voltar aos Desembolsos"/>

    <section v-if="country">
      <div class="flex flex-row items-center gap-3">
        <DynamicImage class="w-18 aspect-video" folder="countries" :filename="country.id"/>

        <div>
          <h1 class="title">
            100 maiores beneficiários finais — {{ country.translation }}
          </h1>

          <p class="subtitle">
            Lista dos beneficiários finais registados para
            {{ country.translation }}, incluindo a posição, o montante recebido,
            a medida associada e a respetiva região.
          </p>
        </div>
      </div>
    </section>

    <section v-if="country" class="card relative">
      <ExportButton
        :data="exportData"
        class="absolute top-3 right-3"
      />

      <div class="flex flex-row items-center justify-between gap-5 pr-30">
        <div>
          <h2 class="title">Lista de beneficiários</h2>

          <p class="subtitle">
            Dados atualizados em {{ country.top100?.date }}.                  
          </p>
        </div>
      </div>

      <div
        v-if="beneficiaries.length > 0"
        class="px-10 max-h-180 overflow-y-scroll"
      >
        <table class="disbursTable w-full text-center mt-5">
          <thead>
            <tr>
              <th>#</th>
              <th>Beneficiário</th>
              <th>Montante</th>
              <th>Medida</th>
              <th>Região</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(beneficiary, index) in beneficiaries" :key="index">
              <td class="font-semibold">
                {{ beneficiary.rank }}
              </td>

              <td>
                {{ beneficiary.name }}
              </td>

              <td class="font-semibold text-(--blue-color)">
                €{{ (beneficiary.amount / 1e6).toFixed(2) }}M
              </td>

              <td>
                {{ beneficiary.measure }}
              </td>

              <td>
                {{ beneficiary.region }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="subtitle mt-5">
        Não existem beneficiários registados para este país.
      </p>
    </section>

    <section v-else class="card">
      <h1 class="title">País não encontrado</h1>

      <p class="subtitle">
        Não foi possível encontrar dados para o país selecionado.
      </p>

    </section>
  </div>
</template>

<style scoped>
.disbursTable,
.disbursTable th,
.disbursTable td {
  border: 1px solid #aaaaaa;
  border-collapse: collapse;
  padding: 10px;
}
</style>