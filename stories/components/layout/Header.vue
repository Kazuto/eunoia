<template>
  <header
    class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 font-sans dark:border-neutral-700 dark:bg-neutral-800"
  >
    <div class="flex items-center gap-3">
      <slot name="left" />
    </div>
    <div class="flex items-center gap-3">
      <slot name="right" />
    </div>
  </header>
</template>
