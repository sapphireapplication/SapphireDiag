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
    publicPath: '/SapphireDiag/',                      //'/SapphireNew/',   //SA_CH /SapphireNew
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
      test: /\.(png|svg|jpg|gif|xml)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    },
    ]
  },
  devServer: {
    historyApiFallback: true,
    
      //openPage: ['http://localhost:8080/SapphireNew'],
      openPage:  'SapphireDiag/',       //'SapphireNew/',
      hot:true
   
       
  },
  
  plugins: [
    htmlWebpackPlugin
  ]
};