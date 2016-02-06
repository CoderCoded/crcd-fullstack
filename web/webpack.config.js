var path = require('path')
var webpack = require('webpack')
var outputPath = path.resolve(__dirname, './.tmp/static/dist')
var host = process.env.HOST || 'localhost'
var port = parseInt(process.env.PORT, 10) || 3001

module.exports = {
  target: 'web',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'login': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client/entries/login.js'
    ],
    'main': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client/entries/main.js'
    ]
  },
  debug: true,
  output: {
    path: outputPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: path.join(__dirname, 'node_modules'),
        loaders: ['babel']
      }, {
        test: require.resolve('./src/client/mdl-custom/material'),
        loader: 'exports?componentHandler'
      }, {
        test: /\.html$/,
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'html'
      }, {
        test: /\.json$/,
        include: path.join(__dirname, 'node_modules', 'pixi.js'),
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style!css!postcss'
      }, {
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
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

    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/\.json$/),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true
    }),
    new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js')

  ],
  postcss: [
    require('precss')(),
    require('autoprefixer')({browsers: 'last 2 versions'})
  ]
}
