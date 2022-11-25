import express from 'express'
import cors from 'cors'
import * as EchoAPI from '../api/Echo'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const echoHandler = (req: EchoAPI.Request): EchoAPI.Response => {
    const { message } = req
    return { echo: message }
}

app.post(EchoAPI.URL, (req, res) => {
    res.json(echoHandler(req.body))
})

app.listen(8080)
