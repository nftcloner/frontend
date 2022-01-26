<template>
  <div class="px-5 py-10 max-w-3xl mx-auto">
    <BlockHeader />
    <BlockCloner />
    <BlockFaq />
    <BlockFooter />
  </div>
</template>

<script>
export default {
  name: "Home",
  setup() {
    return {};
  },
};
</script>

<style lang="stylus">
html
  @apply bg-purple-100
</style>
