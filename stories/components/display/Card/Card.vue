<template>
  <CardPrimitive
    v-bind="$attrs"
    :dense
  >
    <CardHeader
      v-if="$slots.header || title"
      :dense
    >
      <CardTitle
        v-if="title"
        :dense
      >
        {{ title }}
      </CardTitle>
      <slot name="header" />
    </CardHeader>
    <CardBody :dense>
      <slot />
    </CardBody>
    <CardFooter
      v-if="$slots.footer"
      :dense
    >
      <slot name="footer" />
    </CardFooter>
  </CardPrimitive>
</template>

<script lang="ts" setup>
import CardPrimitive from "./primitives/Card.vue";
import CardHeader from "./primitives/CardHeader.vue";
import CardTitle from "./primitives/CardTitle.vue";
import CardBody from "./primitives/CardBody.vue";
import CardFooter from "./primitives/CardFooter.vue";

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    title?: string;
    dense?: boolean;
  }>(),
  {
    title: undefined,
  }
);
</script>
