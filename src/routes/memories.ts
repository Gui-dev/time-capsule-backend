import {
  type FastifyRequest,
  type FastifyInstance,
  type FastifyReply,
} from 'fastify'
import { prisma } from '../lib/prisma'
import { memoriesParamsValidation } from '../validations/memories-params-validation'
import { createMemoryValidation } from '../validations/create-memory-validation'
import { updateMemoryValidation } from '../validations/update-memory-validation'

export const memoriesRoutes = async (app: FastifyInstance): Promise<void> => {
  app.addHook('preHandler', async (request: FastifyRequest) => {
    await request.jwtVerify()
  })

  app.get(
    '/memories',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { sub } = request.user
      const memories = await prisma.memory.findMany({
        where: {
          userId: sub,
        },
        orderBy: {
          createdAt: 'asc',
        },
      })
      return response.status(200).send(
        memories.map((memory) => {
          return {
            id: memory.id,
            coverUdl: memory.coverUrl,
            excerpt: memory.content.substring(0, 115).concat('...'),
          }
        }),
      )
    },
  )

  app.get(
    '/memories/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { sub } = request.user
      const { id } = memoriesParamsValidation.parse(request.params)
      const memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (!memory.isPublic && memory.userId !== sub) {
        return response.status(401).send({ error: 'User unauthorized' })
      }

      return response.status(200).send(memory)
    },
  )

  app.post(
    '/memories',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { sub } = request.user
      const { content, coverUrl, isPublic } = createMemoryValidation.parse(
        request.body,
      )
      const memory = await prisma.memory.create({
        data: {
          userId: sub,
          content,
          coverUrl,
          isPublic,
        },
      })

      return response.status(201).send(memory)
    },
  )

  app.put(
    '/memories/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { sub } = request.user
      const { id } = memoriesParamsValidation.parse(request.params)
      const { content, coverUrl, isPublic } = updateMemoryValidation.parse(
        request.body,
      )
      let memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (memory.userId !== sub) {
        return response.status(401).send({ error: 'User unauthorized' })
      }

      memory = await prisma.memory.update({
        where: {
          id,
        },
        data: {
          content,
          coverUrl,
          isPublic,
        },
      })

      return response.status(201).send(memory)
    },
  )

  app.delete(
    '/memories/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { sub } = request.user
      const { id } = memoriesParamsValidation.parse(request.params)
      const memory = await prisma.memory.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (memory.userId !== sub) {
        return response.status(401).send({ error: 'User unauthorized' })
      }

      await prisma.memory.delete({
        where: { id },
      })
      return response.status(204).send()
    },
  )
}
