import bunyan from 'browser-bunyan'

const log = bunyan.createLogger({
  name: 'crcd-web-client',
  streams: [
    {
      level: __DEVELOPMENT__ ? 'debug' : 'info',
      stream: __DEVELOPMENT__ ? new bunyan.ConsoleFormattedStream() : new bunyan.ConsoleRawStream()
    }
  ]
})

export default log
