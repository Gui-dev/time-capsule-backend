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
  app.get(
    '/memories',
    async (request: FastifyRequest, response: FastifyReply) => {
      const memories = await prisma.memory.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      })
      return await response.status(200).send(
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
      const { id } = memoriesParamsValidation.parse(request.params)
      const memory = await prisma.memory.findUniqueOrThrow({
        where: { id },
      })
      return await response.status(200).send(memory)
    },
  )

  app.post(
    '/memories',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { content, coverUrl, isPublic } = createMemoryValidation.parse(
        request.body,
      )
      const memory = await prisma.memory.create({
        data: {
          userId: '43443b1b-7bd1-4bfe-949f-9e43ea94756c',
          content,
          coverUrl,
          isPublic,
        },
      })

      return await response.status(201).send(memory)
    },
  )

  app.put(
    '/memories/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { id } = memoriesParamsValidation.parse(request.params)
      const { content, coverUrl, isPublic } = updateMemoryValidation.parse(
        request.body,
      )
      const memory = await prisma.memory.update({
        where: { id },
        data: {
          content,
          coverUrl,
          isPublic,
        },
      })

      return await response.status(201).send(memory)
    },
  )

  app.delete(
    '/memories/:id',
    async (request: FastifyRequest, response: FastifyReply) => {
      const { id } = memoriesParamsValidation.parse(request.params)
      await prisma.memory.findUniqueOrThrow({
        where: { id },
      })
      return await response.status(204).send()
    },
  )
}
