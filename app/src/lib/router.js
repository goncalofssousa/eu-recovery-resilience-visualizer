import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import CommonIndicator from "../views/CommonIndicator.vue";
import CommonIndicators from "../views/CommonIndicators.vue";
import Comparator from "../views/Comparator.vue";
import Countries from "../views/Countries.vue";
import Country from "../views/Country.vue";
import Disbursements from "../views/Disbursements.vue";
import Home from "../views/Home.vue";
import Top100Beneficiaries from "../views/Top100Beneficiaries.vue"; 
import Milestones from "../views/Milestones.vue";

export const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        component: Home,
        meta: { icon: "home.svg", title: "Inicio" },
      },
      {
        path: "/countries",
        component: Countries,
        meta: { icon: "mash.svg", title: "Países" },
      },
      {
        path: "/countries/:country",
        component: Country,
        meta: {
          icon: "",
          title: "",
          hide: true,
          parentRoute: "/countries",
        },
      },
      {
        path: "/common-indicators",
        component: CommonIndicators,
        meta: { icon: "stats.svg", title: "Indicadores Comuns" },
      },
      {
        path: "/common-indicators/:indicator",
        component: CommonIndicator,
        meta: {
          icon: "",
          title: "",
          hide: true,
          parentRoute: "/common-indicators",
        },
      },
      {
        path: "/disbursements",
        component: Disbursements,
        meta: { icon: "money.svg", title: "Desembolsos" },
      },
      {
        path: "/disbursements/top100/:countryKey",
        component: Top100Beneficiaries,
        meta: {
          icon: "",
          title: "",
          hide: true,
          parentRoute: "/disbursements",
        },
      },
      {
        path: "/milestones",
        component: Milestones,
        meta: { icon: "bullet.svg", title: "Marcos e Metas" },
      },
      {
        path: "/comparator",
        component: Comparator,
        meta: { icon: "balance.svg", title: "Comparação Países" },
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
