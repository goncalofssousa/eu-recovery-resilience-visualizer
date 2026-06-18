import { defineStore } from "pinia";
import { computed, ref } from "vue";

const API_URL = "http://localhost:3000";

export const useDataStore = defineStore("data", () => {
  // Estado interno da store

  const countries = ref([]);
  const pillars = ref([]);
  const indicators = ref([]);
  const loading = ref(false);

  // Getters para ler o estado.
  // Boa prática para não aceder ao estado diretamente nos componentes.

  const getCountries = computed(() => countries.value);
  const getPillars = computed(() => pillars.value);
  const getIndicators = computed(() => indicators.value);
  const isLoading = computed(() => loading.value);

  // Totais globais

  const totalAllocated = computed(() =>
    countries.value.reduce((acc, c) => acc + c.rrp.allocation, 0),
  );

  const totalInvested = computed(() =>
    countries.value.reduce((acc, c) => acc + c.rrp.total, 0),
  );

  const totalGrantsAllocated = computed(() =>
    countries.value.reduce((acc, c) => acc + c.grants.allocate, 0),
  );

  const totalGrantsPaid = computed(() =>
    countries.value.reduce((acc, c) => acc + c.grants.total, 0),
  );

  const totalLoansAllocated = computed(() =>
    countries.value.reduce((acc, c) => acc + c.loans.allocate, 0),
  );

  const totalLoansPaid = computed(() =>
    countries.value.reduce((acc, c) => acc + c.loans.total, 0),
  );

  const totalGrantsPercentage = computed(() => {
    if (totalGrantsAllocated.value === 0) return 0;

    return (
      (totalGrantsPaid.value / totalGrantsAllocated.value) * 100
    );
  });

  const totalLoansPercentage = computed(() => {
    if (totalLoansAllocated.value === 0) return 0;

    return ((totalLoansPaid.value / totalLoansAllocated.value) * 100);
  });


  // Países

  function getCountryById(id) {
    return countries.value.find((country) => country.id === id);
  }

  function getIndicatorById(id) {
    return indicators.value.find((indicator) => indicator.id === id);
  }

  // Marcos e metas
 // Object.values para tornar os objetos iteráveis, já que os pilaresCount são objetos com chaves dinâmicas (ex: "Pilar 1", "Pilar 2", etc).
  function getCountryMilestonesDone(id) {
    const country = getCountryById(id);

    if (!country || !country.pillarsCount) {
      return 0;
    }

    let totalDone = 0;
   
    for (const pillar of Object.values(country.pillarsCount)) {
      totalDone += pillar.done;
    }

    return totalDone;
  }

  function getCountryMilestonesTotal(id) {
    const country = getCountryById(id);

    if (!country || !country.pillarsCount) {
      return 0;
    }

    let totalMilestones = 0;

    for (const pillar of Object.values(country.pillarsCount)) {
      totalMilestones += pillar.total;
    }

    return totalMilestones;
  }

  function getCountryExecutionRate(id) {
    const total = getCountryMilestonesTotal(id);

    if (total === 0) return 0;

    return (getCountryMilestonesDone(id) / total) * 100;
  }

  function getCountryPillarsTotal(id) {
    const country = getCountryById(id);

    if (!country || !country.pillars) {
      return 0;
    }

    let total = 0;

    for (const value of Object.values(country.pillars)) {
      total += value;
    }

    return total;
  }

  // ir buscar marcos e metas de acordo com o filtro por país agrupando sempre país -> marcos filtrados
  function getMilestonesByFilters(countryId = "all", pillarId = "all") {
    // para cada país vvai buscar os marcos, agrupando num Map país -> milestones, e depois filtra os marcos com base nos filtros selecionados (countryId e pillarId)
    return countries.value.flatMap((country) => country.milestones)
                          .filter((milestone) => {
                            const countryOk = countryId === "all" || milestone.country === countryId;

                            const pillarOk = pillarId === "all" || milestone.pillars.includes(pillarId);

                            return countryOk && pillarOk;
                          });
  }

  function getMilestonesDonePercentage(countryId = "all", pillarId = "all") {
    // vai buscr as millestones filtradas por país e ou pilar
    const milestones = getMilestonesByFilters(countryId, pillarId);

    if (milestones.length === 0) return 0;
    // filtra as que estão concluídas e calcula a percentagem face às totais obtidas com o filtro
    return ((milestones.filter((m) => m.status === "Concluído").length / milestones.length) * 100);
  }

  // numero de millestones do tipo investimento ou reforma, filtrados por país e ou pilar
  function getCountryInvestmentsCount(id = "all", selectedPillar = "all") {
    return getMilestonesByFilters(id, selectedPillar).filter((m) => m.type === "Investimento").length;
  }

  function getCountryReformsCount(id = "all", selectedPillar = "all") {
    return getMilestonesByFilters(id, selectedPillar).filter((m) => m.type === "Reforma").length;
  }

  // Funções que alteram/carregam o estado.
  async function loadCountries() {
    // Só carregar os dados uma vez.
    if (countries.value.length > 0) return;

    // Ativa loading.
    loading.value = true;

    try {
      const response = await fetch(`${API_URL}/countries`);
      countries.value = await response.json();
    } catch (error) {
      console.error("Erro ao carregar países:", error);
    } finally {
      loading.value = false;
    }
  }

  async function loadPillars() {
    if (pillars.value.length > 0) return;

    loading.value = true;

    try {
      const response = await fetch(`${API_URL}/pillars`);
      pillars.value = await response.json();
    } catch (error) {
      console.error("Erro ao carregar pilares:", error);
    } finally {
      loading.value = false;
    }
  }

  async function loadIndicators() {
    if (indicators.value.length > 0) return;

    loading.value = true;

    try {
      const response = await fetch(`${API_URL}/indicators`);
      indicators.value = await response.json();
    } catch (error) {
      console.error("Erro ao carregar indicadores:", error);
    } finally {
      loading.value = false;
    }
  }

  // Uma vez que em muitas situações queremos carregar os dados base (países, pilares e indicadores) em conjunto, 
  // é útil ter uma função que faça isso de forma sequencial, garantindo que os dados estão disponíveis antes de serem usados nos componentes.
  async function loadBaseData() {
    await loadCountries();
    await loadPillars();
  }


  return {
    // getters
    getCountries,
    getPillars,
    getIndicators,
    isLoading,

    totalAllocated,
    totalInvested,
    totalGrantsAllocated,
    totalGrantsPaid,
    totalLoansAllocated,
    totalLoansPaid,
    totalGrantsPercentage,
    totalLoansPercentage,

    getCountryById,
    getIndicatorById,

    getCountryMilestonesDone,
    getCountryMilestonesTotal,
    getCountryExecutionRate,
    getCountryPillarsTotal,

    getCountryInvestmentsCount,
    getCountryReformsCount,

    getMilestonesByFilters,
    getMilestonesDonePercentage,

    // actions
    loadCountries,
    loadPillars,
    loadIndicators,
    loadBaseData,
  };
});