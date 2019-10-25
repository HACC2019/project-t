const webpack = require('webpack');
const path = require('path')
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',

  entry:'./src/index.js',

  output: {
    filename: './bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
    watchContentBase: true,
    progress: true
  },
  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new Dotenv()
  ],

  node: {
    fs: 'empty'
  },

};
