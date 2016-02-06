var Express = require('express')
var webpack = require('webpack')

var webpackConfig = require('./webpack.config')
var compiler = webpack(webpackConfig)

var host = process.env.HOST || 'localhost'
var port = process.env.PORT || 3031
var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
  aggregateTimeout: 10000
}

console.info('Webpack dev server opts:')
console.info(JSON.stringify(serverOptions, null, 2))

var app = new Express()

app.use(require('webpack-dev-middleware')(compiler, serverOptions))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, function onAppListening (err) {
  if (err) {
    console.error(err)
  } else {
    console.info('----\nWebpack development server listening on port %s', port)
  }
})
