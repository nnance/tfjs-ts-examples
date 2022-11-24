import { createServer, IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'

const port = 8080
const host = 'localhost'

const serverHandler = (req: IncomingMessage): string | string[] => {
    if (req.url) {
        const parsedURL = parse(req.url, true)
        if (parsedURL.pathname == '/echo' && parsedURL.query.message) {
            return parsedURL.query.message
        }
    }
    return 'Page not found'
}

const server = createServer((req, res) => {
    res.end(serverHandler(req))
})

server.listen(port, host, function () {
    console.log(`Web server is running on port ${port}`)
})
