import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { resolve } from 'node:path'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

const app = Fastify()
const PORT = 3333 || process.env.PORT

app.register(multipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, '..', 'uploads'),
  prefix: '/uploads',
})
app.register(cors, {
  origin: true,
})
app.register(jwt, {
  secret: 'timecapsule',
})
app.register(authRoutes)
app.register(uploadRoutes)
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
