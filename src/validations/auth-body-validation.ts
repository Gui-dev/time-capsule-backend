import { z } from 'zod'

export const authBodyValidation = z.object({
  code: z.string(),
})
