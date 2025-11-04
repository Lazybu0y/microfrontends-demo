const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3000,
  },
  output: {
    publicPath: "http://localhost:3000/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules(?!\/@acme\/mfe-reports)/,
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        mfeHome: "mfeHome@http://localhost:3001/remoteEntry.js",
        mfeAnalytics: "mfeAnalytics@http://localhost:3002/remoteEntry.js",
        mfeDataBus: "mfeDataBus@http://localhost:3004/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
  ],
};
