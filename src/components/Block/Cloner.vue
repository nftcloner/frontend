<template>
  <div class="space-y-10 mt-10">
    <div class="flex items-center">
      <input
        v-model="openseaURL"
        type="text"
        class="bg-white text-xl sm:text-base w-full px-3 pr-0 py-2 border-4 border-yellow-300 border-r-0 rounded-lg rounded-r-none focus:outline-none"
        placeholder="https://opensea.io/assets/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/316"
      />
      <div
        @click="loadNFT"
        class="bg-purple-500 text-xl sm:text-base hover:bg-fuchsia-500 cursor-pointer text-white font-bold px-4 py-2 border-4 border-yellow-300 border-l-0 rounded-lg rounded-l-none"
      >
        GO
      </div>
    </div>
    <div class="flex justify-center gap-5 items-center px-5">
      <img :src="nftImageURL" :alt="nftName" class="w-2/5 rounded-full" />
      <div class="w-1/5 text-7xl text-purple-300">
        <ChevronDoubleRightIcon class="w-16 sm:w-full mx-auto animate-pulse" />
      </div>
      <img
        :src="nftImageURL"
        :alt="nftName"
        class="w-2/5 rounded-lg"
        style="clip-path: url(#hex-hw-shapeclip-clipconfig)"
      />
    </div>
    <div
      class="flex flex-col justify-center gap-5 items-center"
      v-if="nftLoaded"
    >
      <div
        v-if="!$store.state.web3.connected"
        @click="
          !$store.state.web3.connected ? $store.dispatch('web3/connect') : null
        "
        class="bg-purple-500 hover:bg-fuchsia-500 text-white font-bold text-2xl w-full sm:w-auto px-10 py-3 border-4 border-yellow-300 rounded-lg text-center cursor-pointer"
      >
        Connect Wallet
      </div>
      <div v-else>
        <div v-if="tokenID == -1" class="flex flex-col items-center gap-5">
          <div
            class="flex gap-x-5 items-center w-full bg-gray-100 rounded-lg drop-shadow overflow-auto p-5 py-3 text-gray-800"
          >
            <ExclamationIcon class="w-20 text-amber-500" />
            <p class="flex-initial text-sm sm:text-base">
              You don't have the NFT Cloner token yet, you can mint it for free
              but you still have to pay for the gas. Once your token is minted,
              you can update metadata indefinitively.<br>
            </p>
          </div>
          <div
            @click="mintNFT"
            class="bg-purple-500 hover:bg-fuchsia-500 text-white font-bold text-2xl w-full sm:w-auto px-10 py-3 border-4 border-yellow-300 rounded-lg text-center cursor-pointer"
          >
            Mint the token
          </div>
          <i class="text-xs text-gray-600 text-center block -mt-4">You can set a low gas price to save your money.</i>
        </div>
        <div
          v-else
          @click="updateMetadata"
          class="bg-purple-500 hover:bg-fuchsia-500 text-white font-bold text-2xl w-full sm:w-auto px-10 py-3 border-4 border-yellow-300 rounded-lg text-center cursor-pointer"
        >
          Clone {{ nftName }}
        </div>
      </div>
    </div>

    <svg height="0" width="0">
      <defs>
        <clipPath
          clipPathUnits="objectBoundingBox"
          id="hex-hw-shapeclip-clipconfig"
          transform="scale(0.005 0.005319148936170213)"
        >
          <path
            d="M193.248 69.51C185.95 54.1634 177.44 39.4234 167.798 25.43L164.688 20.96C160.859 15.4049 155.841 10.7724 149.998 7.3994C144.155 4.02636 137.633 1.99743 130.908 1.46004L125.448 1.02004C108.508 -0.340012 91.4873 -0.340012 74.5479 1.02004L69.0879 1.46004C62.3625 1.99743 55.8413 4.02636 49.9981 7.3994C44.155 10.7724 39.1367 15.4049 35.3079 20.96L32.1979 25.47C22.5561 39.4634 14.0458 54.2034 6.74789 69.55L4.39789 74.49C1.50233 80.5829 0 87.2441 0 93.99C0 100.736 1.50233 107.397 4.39789 113.49L6.74789 118.43C14.0458 133.777 22.5561 148.517 32.1979 162.51L35.3079 167.02C39.1367 172.575 44.155 177.208 49.9981 180.581C55.8413 183.954 62.3625 185.983 69.0879 186.52L74.5479 186.96C91.4873 188.32 108.508 188.32 125.448 186.96L130.908 186.52C137.638 185.976 144.163 183.938 150.006 180.554C155.85 177.17 160.865 172.526 164.688 166.96L167.798 162.45C177.44 148.457 185.95 133.717 193.248 118.37L195.598 113.43C198.493 107.337 199.996 100.676 199.996 93.93C199.996 87.1841 198.493 80.5229 195.598 74.43L193.248 69.51Z"
          ></path>
        </clipPath>
      </defs>
    </svg>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { ethers } from "ethers";
import { defaultProvider, provider } from "../../store/modules/web3";
import { ChevronDoubleRightIcon, ExclamationIcon } from "@heroicons/vue/solid";
import NFTClonerABI from "./NFTCloner.abi.json";

export default {
  name: "Cloner",
  components: {
    ChevronDoubleRightIcon,
    ExclamationIcon,
  },
  setup() {
    const store = useStore();
    store.dispatch("web3/init");

    const openseaURL = ref("");
    const nftLoaded = ref(false);
    const nftName = ref("Doodles #316");
    const nftImageURL = ref(
      "https://lh3.googleusercontent.com/MrhYY_f69qlQ4f100z-PNotZ2E0jRKPKn7OpkB_BxieXC6dOOO0AUYyVRaloFrUF7kW64s45TgiY8KM1-ccvMZveWVVR2_i4kC3P=w600"
    );
    const nftContract = ref("");
    const nftID = ref(0);
    const tokenID = ref(-1);

    const NFTCloner = new ethers.Contract(
      process.env.VUE_APP_NFT_ADDRESS,
      NFTClonerABI,
      defaultProvider
    );

    const loadNFT = async () => {
      const regex =
        /https:\/\/opensea\.io\/assets\/(0x[a-fA-F0-9]{40})\/(\d+)/gm;

      const match = regex.exec(openseaURL.value);

      if (match.length !== 3) {
        alert("Invalid URL");
        return;
      }
      axios
        .get(`https://api.opensea.io/api/v1/asset/${match[1]}/${match[2]}`)
        .then((res) => {
          // console.log(res.data);

          nftContract.value = match[1];
          nftID.value = match[2];

          nftName.value = res.data.name;
          nftImageURL.value = res.data.image_url;
          nftLoaded.value = true;
        });
    };

    const mintNFT = async () => {
      const signer = provider.getSigner();
      NFTCloner.connect(signer)
        .mint()
        .then((tx) => {
          tx.wait()
            .then(() => {
              NFTCloner.tokenByOwner(store.state.web3.address)
                .then((tokenId) => {
                  tokenID.value = tokenId.toNumber();
                })
                .catch((err) => {
                  tokenID.value = -1;
                  console.log(err);
                });
            })
            .catch(console.log);
        })
        .catch(console.log);
    };

    const updateMetadata = async () => {
      const signer = provider.getSigner();

      const domain = {
        name: "NFTCloner",
        version: "1",
        chainId: 1,
        verifyingContract: process.env.VUE_APP_NFT_ADDRESS,
      };

      const types = {
        UpdateMetadata: [
          { name: "contract", type: "address" },
          { name: "tokenId", type: "uint256" },
        ],
      };

      const value = {
        contract: ethers.utils.getAddress(nftContract.value),
        tokenId: nftID.value,
      };

      const signature = await signer._signTypedData(domain, types, value);

      NFTCloner.tokenByOwner(store.state.web3.address)
        .then(() => {
          sendRequest(nftContract.value, nftID.value, signature);
        })
        .catch(console.log);
      // .catch(() => {
      // // sendRequest(nftContract.value, nftID.value, signature); // FIXME: remove
      // NFTCloner.connect(signer)
      //   .mint()
      //   .then((tx) => {
      //     tx.wait()
      //       .then(() => {
      //         sendRequest(nftContract.value, nftID.value, signature);
      //       })
      //       .catch(console.log);
      //   })
      //   .catch(console.log);
      // });
    };

    const sendRequest = async (contract, tokenId, signature) => {
      const params = new URLSearchParams();
      params.append("contract", contract);
      params.append("tokenId", tokenId);
      params.append("signature", signature);

      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      axios
        .post(
          "https://us-east1-nftcloner.cloudfunctions.net/v1/metadata/update",
          // "http://localhost:8090/hello",
          params,
          config
        )
        .then(console.log)
        .catch(console.log);
    };

    store.subscribe(async (mutation, state) => {
      if (mutation.type === "web3/connected" && mutation.payload === true) {
        // console.log(
        //   (await NFTCloner.tokenByOwner(state.web3.address)).toNumber()
        // );
        NFTCloner.tokenByOwner(state.web3.address)
          .then((tokenId) => {
            tokenID.value = tokenId.toNumber();
          })
          .catch(() => {
            tokenID.value = -1;
          });
      }
    });

    onMounted(async () => {
      // console.log(
      //   (await NFTCloner.tokenByOwner(store.state.web3.address)).toNumber()
      // );
      // console.log(await NFTCloner.tokenByOwner("0x0000000000000000000000000000000000000000"));
      // NFTCloner.tokenByOwner("0x0000000000000000000000000000000000000000")
      //   .then(console.log)
      //   .catch(console.log);
      // setTimeout(() => {
      //   NFTCloner.connect(provider.getSigner())
      //     .mint()
      //     .then(console.log)
      //     .catch(console.log);
      // }, 5000);
    });

    return {
      openseaURL,
      nftLoaded,
      nftName,
      nftImageURL,
      nftContract,
      nftID,
      tokenID,
      loadNFT,
      mintNFT,
      updateMetadata,
    };
  },
};
</script>
