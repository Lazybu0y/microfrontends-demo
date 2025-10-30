const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: { port: 3001 },
  output: { publicPath: "auto" },
  module: {
    rules: [{ test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ }]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfeHome",
      filename: "remoteEntry.js",
      exposes: { "./Home": "./src/Home.jsx" },
      shared: ["react", "react-dom"]
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" })
  ]
};
