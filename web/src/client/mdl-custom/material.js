// We use a customized entry for material-design-lite,
// instead of original build tools, we have webpack

// These are from MDL 1.1.1
// When updated, check for conflicts with customized components

// Component handler
import 'material-design-lite/src/mdlComponentHandler.js'
// Polyfills/dependencies
import 'material-design-lite/src/third_party/rAF.js'
// Base components
import 'material-design-lite/src/button/button.js'
import 'material-design-lite/src/checkbox/checkbox.js'
import 'material-design-lite/src/icon-toggle/icon-toggle.js'
import 'material-design-lite/src/menu/menu.js'
import 'material-design-lite/src/progress/progress.js'
import 'material-design-lite/src/radio/radio.js'
import 'material-design-lite/src/slider/slider.js'
import 'material-design-lite/src/snackbar/snackbar.js'
import 'material-design-lite/src/spinner/spinner.js'
import 'material-design-lite/src/switch/switch.js'
import 'material-design-lite/src/tabs/tabs.js'
import 'material-design-lite/src/textfield/textfield.js'
import 'material-design-lite/src/tooltip/tooltip.js'
// Complex components (which reuse base components)
import './layout/layout.js'
import 'material-design-lite/src/data-table/data-table.js'
// And finally, the ripples
import 'material-design-lite/src/ripple/ripple.js'
