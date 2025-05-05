import { Hono } from 'hono'
import {logger} from 'hono/logger'
import {timing} from 'hono/timing'

const app = new Hono()

app.use("*",logger())
app.use("*",timing())

app.get('/', (c) => {
    return c.json('Hello Hono!')
})  

app.get('/users', (c) => {
    return c.json({
        users: [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
        ],
    })
})

export default app
