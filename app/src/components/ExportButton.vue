<template>
  <div class="w-25 h-8 z-10" @mouseleave="isActive = false">
    <Button @click="onClick" :icon="icon" class="hover:bg-[#1746b8] transition-colors duration-300">Exportar</Button>
    <div :class="['container shadow-1 rounded-[10px]  bg-white w-full gap-1 p-1', isActive ? '' : 'hidden!']">
      <Button
        v-for="[type, func] in [
          ['CSV', exportCSV],
          ['PDF', exportPDF],
          ['Excel', exportExcel],
        ]"
        imageClass="w-3!"
        class="text-[10pt] h-5! hover:bg-[#1746b8] transition-colors duration-300"
        :icon="icon"
        @click="func"
        >{{ type }}</Button
      >
    </div>
  </div>
</template>

<script setup>
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ref } from "vue";
import ExcelJS from "exceljs";
import icon from "../assets/icons/download.svg";
import Button from "./Button.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

function exportCSV() {
  const csvContent = [
    props.data.fields.join(","),
    ...props.data.data.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "export.csv";
  link.click();

  window.URL.revokeObjectURL(url);
}

function exportPDF() {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [props.data.fields],
    body: props.data.data,
  });

  doc.save("export.pdf");
}

async function exportExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Export");

  worksheet.addRows([props.data.fields,...props.data.data,]);

  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer]));

  Object.assign(document.createElement("a"), {href: url, download: "export.xlsx",}).click();

  URL.revokeObjectURL(url);
}

const isActive = ref(false);

const onClick = () => (isActive.value = !isActive.value);
</script>