import { envSchema } from '@schema/env'
import z, { TypeOf } from 'zod'

try {
  envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    const { fieldErrors } = error.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => (errors ? `${field}: ${errors.join(', ')}` : field))
      .join('\n  ')

    throw new Error(`Missing environment variables:\n  ${errorMessage}`)
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof envSchema> {}
  }
}
