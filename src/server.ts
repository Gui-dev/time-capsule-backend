import Fastify from 'fastify'
import { appRoutes } from './routes'

const app = Fastify()

void app.register(appRoutes)

app.listen({
  port: 3333
}).then(() => {
  console.log('🚀 Server running on http://localhost:3333')
}).catch(error => { console.log(error) })
