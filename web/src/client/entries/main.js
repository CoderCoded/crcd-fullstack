import '../app'
// Don't include entry route in development, due to hot reload problem
if (!__DEVELOPMENT__) require('../routes/dashboard.js')
