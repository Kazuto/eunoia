<template>
  <table class="w-full">
    <thead>
      <tr>
        <th></th>
        <th
          v-for="stop in stops"
          :key="stop"
          class="min-w-10"
        >
          {{ stop }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th class="text-left">Neutral</th>
        <Neutral />
      </tr>
      <tr>
        <th class="text-left">Gray</th>
        <Gray />
      </tr>
      <tr>
        <th class="text-left">Primary</th>
        <Primary />
      </tr>
      <tr>
        <th class="text-left">Blue</th>
        <Blue />
      </tr>
      <tr>
        <th class="text-left">Green</th>
        <Green />
      </tr>
      <tr>
        <th class="text-left">Red</th>
        <Red />
      </tr>
      <tr>
        <th class="text-left">Yellow</th>
        <Yellow />
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import Primary from "./variants/Primary.vue";
import Blue from "./variants/Blue.vue";
import Gray from "./variants/Gray.vue";
import Green from "./variants/Green.vue";
import Neutral from "./variants/Neutral.vue";
import Red from "./variants/Red.vue";
import Yellow from "./variants/Yellow.vue";

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
</script>
