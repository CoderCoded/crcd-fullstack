import React from 'react'
import { render } from 'react-dom'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'

const DevTools = createDevTools(
  <LogMonitor theme='solarized' />
)

export function showDevTools (store) {
  const title = 'Redux DevTools'
  const popup = window.open(null, title, 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no')
  // Reload in case it already exists
  popup.location.reload()

  function tryToRender () {
    if (popup.document) { // if loaded
      popup.document.title = title // set title
      popup.document.write('<div id="react-devtools-root"></div>')
      render(
        <DevTools store={store} />,
        popup.document.getElementById('react-devtools-root')
      )
    } else { // if not loaded yet
      setTimeout(tryToRender, 10)
    }
  }

  tryToRender()

  let forceTitle = setInterval(() => {
    if (popup.document.title !== title) popup.document.title = title
    else clearInterval(forceTitle)
  }, 100)
}

export default DevTools
