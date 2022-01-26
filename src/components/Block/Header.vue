<template>
  <div>
    <h1
      class="title text-6xl sm:text-8xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-400"
    >
      {{ $name }}
    </h1>
    <p class="text-center mt-5 text-gray-700">
      Clone your favourite NFT and display it as your profile picture for free.
    </p>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>
