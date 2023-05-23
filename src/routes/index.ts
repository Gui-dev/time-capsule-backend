import { type FastifyInstance } from 'fastify'

export const appRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get('/', () => {
    return 'Hello World'
  })
}
