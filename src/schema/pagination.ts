import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z
    .union([z.literal(5), z.literal(10), z.literal(15)])
    .optional()
    .default(10),
  page: z.number().int().positive().optional().default(1),
})

export type Pagination = z.infer<typeof paginationSchema>
