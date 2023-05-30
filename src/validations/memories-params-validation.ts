import { z } from 'zod'

export const memoriesParamsValidation = z.object({
  id: z.string().uuid(),
})
