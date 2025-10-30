const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: { port: 3002 },
  output: { publicPath: "auto" },
  module: {
    rules: [{ test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ }]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfeAnalytics",
      filename: "remoteEntry.js",
      exposes: { "./Analytics": "./src/Analytics.jsx" },
      shared: ["react", "react-dom"]
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" })
  ]
};
