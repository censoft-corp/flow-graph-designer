var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  cache: true,
  context: __dirname + "/src",
  entry: "./index.js",
  output: {
    path: "./dist",
    publicPath: "/dist/",
    filename: "flow-graph-designer.js",
    library: "FlowGraphDesigner",
    libraryTarget: "umd"
  },
  plugins: [
    new ExtractTextPlugin("flow-graph-designer.css", { allChunks: true }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  devtool: "source-map",
  externals: {
    react: {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
      amd: "react"
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel"],
      },
      {
        test: /\.css$/,
        loader: "style!css",
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("css-loader!less"),
      },
      {
        test: /\.json$/,
        loader: "json-loader",
        include: [
          path.join(__dirname, "css"),
          path.join(__dirname, "playground"),
          path.join(__dirname, "node_modules"),
        ],
      }
    ]
  }
};
