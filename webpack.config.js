const HtmlWebPackPlugin = require("html-webpack-plugin");
var path = require('path');
var mode = process.env.NODE_ENV || 'development';

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});


module.exports = {
  entry: "./src/SapphireDiagrammer.js",
  devtool: (mode === 'development') ? 'inline-source-map' : false,
  mode: mode,
  output: {
    path: path.resolve(__dirname ,"dist"),
    filename: "[name].bundle.js",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  },
  plugins: [
    htmlWebpackPlugin
  ]
};