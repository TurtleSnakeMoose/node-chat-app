const express = require('express')
const _log = require('./common/log')
const app = express()

app.use(express.static('public'))
app.use(express.json())

app.listen( process.env.PORT , () => {
    _log.success(' SUCCESS ',`Server is up and running on port ${process.env.PORT}!`)
})

module.exports = app