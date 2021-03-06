import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import networks from "./networks.json";

export const networkId = process.env.VUE_APP_NETWORK_ID;
export const network = networks[networkId];

/** @type {ethers.providers.JsonRpcProvider} */
export const defaultProvider = new ethers.providers.JsonRpcProvider(
  network.rpc[0]
);

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.VUE_APP_INFURA_ID,
      rpc: {
        // networkId: network.rpc[0],
      },
    },
  },
};

providerOptions.walletconnect.options.rpc[networkId] = network.rpc[0];

export const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
  providerOptions,
  // theme: {
  //   background: "var(--main-bg)",
  //   main: "var(--main-text)",
  //   secondary: "var(--main-link)",
  //   border: "var(--main-border)",
  //   hover: "var(--main-hover)",
  // },
});

export let provider = null;
export let web3Provider = null;

export function changeNetwork() {
  if (!web3Provider) return;
  web3Provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: ethers.utils.hexValue(network.chainId),
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: network.rpc, // FIXME: incorect, must not be the private rpc
        blockExplorerUrls: [network.explorer],
      },
    ],
  });
}

// initial state
const state = () => ({
  connected: false,
  error: null,
  address: "",
  network: "",
  ens: null,
});

// getters
const getters = {};

// actions
const actions = {
  async connect({ commit, dispatch }) {
    web3Provider = await web3Modal.connect();

    web3Provider.on("chainChanged", (chainId) => {
      commit("network", chainId);
      // if (chainId != networkRequired) {
      //   setTimeout(() => {
      //     changeNetwork()
      //   }, 1000)
      // }
      window.location.reload();
    });

    web3Provider.on("accountsChanged", async (accounts) => {
      if (accounts.length === 0) {
        dispatch("logout");
      } else {
        const signer = provider.getSigner(accounts[0]);
        const network = await provider.getNetwork();
        commit("address", await signer.getAddress());
        commit("network", network.chainId);
        commit("connected", true);
      }
    });

    web3Provider.on("connect", (/*connectInfo*/) => {
      // if (connectInfo.chainId != networkRequired) {
      //   setTimeout(() => {
      //     changeNetwork();
      //   }, 1000);
      // }
    });

    web3Provider.on("disconnect", async (error) => {
      console.error(error);
      dispatch("logout");
    });

    provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    commit("address", await signer.getAddress());
    commit("network", network.chainId);
    commit("connected", true);
  },

  logout({ commit }) {
    web3Modal.clearCachedProvider();
    // Web3Modal.cachedProvider = "";
    // Web3Modal.removeLocal(Web3Modal.CACHED_PROVIDER_KEY);
    localStorage.removeItem("walletconnect");
    commit("address", "");
    commit("error", "");
    commit("network", "");
    commit("ens", "");
    commit("connected", false);
    commit("auth", {}, { root: true });
  },

  init({ dispatch }) {
    if (web3Modal.cachedProvider) {
      dispatch("connect");
    }
  },
};

// mutations
const mutations = {
  connected: function (state, value) {
    state.connected = value;
  },
  error: function (state, value) {
    state.error = value;
  },
  address: function (state, value) {
    state.address = value;
  },
  network: function (state, value) {
    state.network = value;
  },
  ens: function (state, value) {
    state.ens = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
