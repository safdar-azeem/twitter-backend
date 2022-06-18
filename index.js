require('dotenv').config()

const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const connectDb = require('./config/connectDb.config')

const app = express()

app.use(fileUpload())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors({ origin: '*' }))

app.get('/', (req, res) => {
   res.send('Welcome to the API')
})

app.use('/api/v1/', routes)

const startServer = async () => {
   const port = process.env.PORT || 5050
   try {
      await connectDb()
      app.listen(port, () => {
         console.log(`🚀  Server ready at: http://localhost:${port}`)
      })
   } catch (err) {
      console.error(err.message)
      process.exit(1)
   }
}

startServer()
