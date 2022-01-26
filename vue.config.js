const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  transpileDependencies: ["vuex-persist"],
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: process.env.VUE_APP_NAME || "AppName",
    },
  },
};
