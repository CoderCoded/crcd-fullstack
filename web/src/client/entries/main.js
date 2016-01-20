// Don't include entry route in development, due to hot reload problem
if (!__DEVELOPMENT__) require('../routes/main.js') // 'require' since babel es2015 requires top-level imports
import '../app'
