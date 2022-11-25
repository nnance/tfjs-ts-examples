import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

app.post('/echo', (req, res) => {
    const { message } = req.body
    res.json({ echo: message })
})

app.listen(8080)
