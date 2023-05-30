import { z } from 'zod'

export const updateMemoryValidation = z.object({
  content: z.string(),
  coverUrl: z.string(),
  isPublic: z.coerce.boolean().default(false),
})
