import { z } from 'zod'

export const userBodyValidation = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
  avatar_url: z.string().url(),
})
