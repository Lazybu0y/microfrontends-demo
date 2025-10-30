const path = require("path");

module.exports = {
  entry: "./src/Reports.jsx",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "commonjs2",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
  },
};
