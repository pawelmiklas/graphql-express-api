import z from 'zod'

export const jwtSchema = z.object({
  userId: z.string(),
})
