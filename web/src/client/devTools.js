import React from 'react'
import { render } from 'react-dom'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'

const DevTools = createDevTools(
  <LogMonitor theme='solarized' />
)

export function showDevTools (store) {
  const popup = window.open(null, 'Redux DevTools', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no')
  // Reload in case it already exists
  popup.location.reload()

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>')
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root')
    )
  }, 10)
}

export default DevTools
