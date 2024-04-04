const app = require('./express-app')

const indexname = require('./filters/query')

app.use(indexname)