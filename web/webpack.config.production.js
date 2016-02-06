// Webpack config for creating the production bundle.
var path = require('path')
var webpack = require('webpack')
var CleanPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
var strip = require('strip-loader')

var relativeOutputPath = './build/static/dist'
var outputPath = path.join(__dirname, relativeOutputPath)

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: {
    'login': './src/client/entries/login.js',
    'main': './src/client/entries/main.js'
  },
  output: {
    path: outputPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [strip.loader('debug'), 'babel']
      }, {
        test: require.resolve('./src/client/mdl-custom/material'),
        loader: 'exports?componentHandler'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.html$/,
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'html'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url?limit=10000?hash=sha512&digest=hex&name=[hash].[ext]'
      }, {
        test: /\.woff(2)?(\?.*)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src/client',
      'node_modules'
    ],
    extensions: ['', '.json', '.js'],
    alias: {
      'i18next': 'i18next/lib/index.js',
      'i18next-xhr-backend': 'i18next-xhr-backend/lib/index.js'
    }
  },
  plugins: [

    new webpack.ProvidePlugin({
      riot: 'riot'
    }),

    new CleanPlugin([relativeOutputPath]),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })

  ],
  postcss: [
    require('precss')(),
    require('autoprefixer')({browsers: 'last 2 versions'})
  ]
}
