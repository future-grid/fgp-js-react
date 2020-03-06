const nodeExternals = require("webpack-node-externals");
const package = require("./package.json");
var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /(node_modules|bower_components|build)/,
            use: {
                loader: 'babel-loader',
                options: {
                  presets: ['env']
                }
            }
        },
        { 
            test: /\.css$/, 
            use: [ 'style-loader', 'css-loader' ] 
        },
        {
          test: /.(jpg|jpeg|png|svg)$/,
          use: ['file-loader'],
        }
    ]
  },
  externals: [
    nodeExternals({
      whitelist: Object.keys(package.dependencies)
    })
  ]
};