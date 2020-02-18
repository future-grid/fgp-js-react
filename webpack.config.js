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
  externals: {
    'react': 'commonjs react',
    'axios': 'axios',
    'FgpGraph': '@future-grid/fgp-graph',
    'moment': 'moment',
    'ol': 'ol',
    "FgpAuth" : "@future-grid/fgp-auth",
    "bootstrap" : "bootstrap",
    "react-bootstrap" : "react-bootstrap",
    "recharts" : "recharts" ,
    "react-datepicker" : "react-datepicker",
    "react-forms" : "react-forms",
    "react-table"  : "react-table",
    "fontAwesomeSvg" : "@fortawesome/fontawesome-svg-core",
    "react-fontAwesome" : "@fortawesome/react-fontawesome",
    "fontAwesomeSvgIcons "  : "@fortawesome/free-solid-svg-icons",
    "react-moment" : "react-moment",
    "react-openlayers" : "react-openlayers",
    "react-dom" : "react-dom",
    "resolve-from" : "resolve-from",
    "react-csv" : "react-csv",
    "fsevents" : "fsevents",
    "i" : "i",
    "webpack-cli" : "webpack-cli",
    "webpack" : "webpack",
    "file-loader" : "file-loader",
    "find-up" : "find-up",
    "react-router-dom" : "react-router-dom",
    "css-loader" : "css-loader",
    "style-loader" : "style-loader",
    "babel-cli"  : "babel-cli",
    "babel-core" : "babel-core",
    "babel-loader" : "babel-loader",
    "babel-plugin-transform-object-rest-spread" : "babel-plugin-transform-object-rest-spread",
    "babel-plugin-transform-react-jsx" : "babel-plugin-transform-react-jsx",
    "babel-preset-env" : "babel-preset-env"
    



  }
};