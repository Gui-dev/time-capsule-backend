import Fastify from 'fastify'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'

const app = Fastify()

void app.register(cors, {
  origin: true
})
void app.register(memoriesRoutes)

app.listen({
  port: 3333
}).then(() => {
  console.log('🚀 Server running on http://localhost:3333')
}).catch(error => { console.log(error) })
