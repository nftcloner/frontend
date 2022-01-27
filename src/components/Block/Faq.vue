<template>
  <div class="flex flex-col sm:flex-row gap-5 items-center">
    <div
      class="w-full bg-gray-100 rounded-lg drop-shadow overflow-auto text-sm sm:text-base p-5 text-gray-800"
    >
      <h3 class="font-bold mb-5">How it works?</h3>
      <p>
        NFT Cloner allows you to mint a free NFT and update the metadata
        indefinitively. Simply provide the OpenSea NFT you want to clone and you
        only have to pay for the gas the first time.
      </p>
      <h3 class="font-bold mt-10 mb-5">How get mine?</h3>
      <ol>
        <li>1. Select your favourite NFT on OpenSea and copy the URL;</li>
        <li>2. Paste the URL in NFT Cloner and check out the result;</li>
        <li>3. Connect your wallet;</li>
        <li>4. Sign the cloning request with your wallet;</li>
        <li>
          5. If it's your first time, mint the token for free (pay only the gas
          fees);
        </li>
        <li>6. Use your new super shiny NFT on Twitter NFT.</li>
      </ol>
      <h3 class="font-bold mt-10 mb-5">Can I use it on Twitter NFT?</h3>
      <p>
        Yes! NFT Cloner is a ERC721 token compatible with OpenSea and Twitter.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Faq",
};
</script>
