<template>
  <a
    class="whitespace-nowrap cursor-pointer flex justify-center items-center gap-x-2"
  >
    <img
      class="w-6 rounded-full"
      :src="ens.avatar"
      :alt="ens.name"
      v-if="ens && ens.avatar"
    />
    <Jazzicon
      :address="address"
      :diameter="20"
      class="inline-block align-middle leading-none mt-0.5"
      v-else
    />
    <span>{{ ens ? ens.name : _shorten(address) }}</span>
  </a>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import Jazzicon from "vue3-jazzicon/src/components";

export default {
  name: "User",
  components: {
    Jazzicon,
  },
  props: {
    address: String,
  },
  setup(props) {
    const store = useStore();

    const ens = computed(() => {
      let ens = store.state.ens[props.address.toLowerCase()];
      if (!ens) {
        store.dispatch("getENS", props.address.toLowerCase());
      }
      return ens;
    });

    return {
      ens,
    };
  },
};
</script>
