<template>
  <table class="w-full">
    <thead>
      <tr>
        <th></th>
        <th
          v-for="stop in stops"
          :key="stop"
          class="p-1"
        >
          {{ stop }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="color in colors"
        :key="color.name"
      >
        <th class="text-left">{{ color.name }}</th>
        <td
          v-for="stop in color.stops"
          :key="stop.name"
          class="py-1"
        >
          <ColorBox :color="stop.value" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import ColorBox from "./primitives/ColorBox.vue";

const colors = ref<Array<{ name: string; value: string }>>([]);

const stops = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];

onMounted(() => {
  let styles;

  if ("computedStyleMap" in document.documentElement) {
    // Chrome
    styles = document.documentElement.computedStyleMap();
  } else {
    // Firefox
    styles = getComputedStyle(document.documentElement);
  }

  // Extract all color variables
  const colorVariables = Array.from(styles)
    .filter((prop) => prop.startsWith("--color-"))
    .map((prop) => ({
      name: prop.replace(/^--color-/, ""), // Remove --color- prefix
      value: styles.getPropertyValue(prop).trim(),
    }));

  // Group by color name and create the desired structure
  const groupedColors = {};

  colorVariables.forEach(({ name, value }) => {
    const parts = name.split("-");

    if (parts.length >= 2) {
      const colorName = parts[0];
      const number = parts[1];

      if (!groupedColors[colorName]) {
        groupedColors[colorName] = [];
      }

      groupedColors[colorName].push({
        name: number,
        value: value,
      });
    }
  });

  // Convert to array format and sort stops by numeric value
  colors.value = Object.entries(groupedColors).map(([colorName, stops]) => ({
    name: colorName,
    stops: stops.sort((a, b) => parseInt(a.name) - parseInt(b.name)),
  }));

  console.log(colors.value);
});
</script>
