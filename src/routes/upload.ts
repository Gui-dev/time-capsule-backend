import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { promisify } from 'node:util'
import { pipeline } from 'node:stream'

export const uploadRoutes = async (app: FastifyInstance): Promise<void> => {
  app.post(
    '/upload',
    async (request: FastifyRequest, response: FastifyReply) => {
      const upload = await request.file({
        limits: {
          fileSize: 5_242_880, // 5MB
        },
      })
      const pump = promisify(pipeline)

      if (!upload) {
        return response.status(400).send({ error: 'File is invalid' })
      }
      const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
      const isValidFileFOrmat = mimeTypeRegex.test(upload.mimetype)

      if (!isValidFileFOrmat) {
        return response.status(400).send({ error: 'File is invalid' })
      }

      const fileId = randomUUID()
      const extension = extname(upload.filename)
      const fileName = fileId.concat(extension)
      const writeStream = createWriteStream(
        resolve(__dirname, '..', '..', 'uploads', fileName),
      )

      await pump(upload.file, writeStream)
      const fullUrl = request.protocol.concat('://').concat(request.hostname)
      const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()
      console.log(fileUrl)
      return response.status(201).send()
    },
  )
}
