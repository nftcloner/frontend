<template>
  <Menu
    as="div"
    class="fixed bottom-0 md:top-0 right-0 m-5"
    v-slot="{ open }"
    v-if="$store.state.web3.connected"
  >
    <MenuButton
      class="bg-white rounded-full px-4 py-3 font-semibold text-gray-800 shadow-md"
    >
      <User :address="$store.state.web3.address" />
    </MenuButton>
    <div v-show="open">
      <MenuItems
        static
        class="absolute w-full right-0 -mt-24 md:mt-2 p-1 bg-white divide-y divide-gray-100 rounded-full shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-black"
      >
        <MenuItem v-slot="{ active }">
          <button
            class="text-red-500 font-semibold w-full rounded-full"
            :class="{ 'bg-red-500 !text-white': active }"
            @click="$store.dispatch('web3/logout')"
          >
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </div>
  </Menu>
</template>

<script>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

export default {
  name: "Wallet",
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  },
};
</script>

<style lang="stylus">
.web3modal-modal-lightbox
  z-index 9999 !important
</style>
