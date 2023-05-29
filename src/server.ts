import Fastify from 'fastify'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'

const app = Fastify()
const PORT = 3333 || process.env.PORT

app.register(cors, {
  origin: true,
})
app.register(memoriesRoutes)

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 Server running on http://localhost:3333')
  })
  .catch((error) => {
    console.log(error)
  })
