const express = require('express')
const app = express()

require('dotenv').config()

const { connectToElastic, elasticClient } = require('./utils/elastic');
const query = require('./filters/query')
const cors = require('cors')
app.use(express.json())

app.use(cors({
    origin: "*"
}))

app.use('/', query)

app.listen(process.env.PORT, () => {
    console.log('Running on', process.env.PORT)
})

module.exports = app