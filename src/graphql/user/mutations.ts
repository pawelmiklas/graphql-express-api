import { Resolvers } from '@generated/graphql'
import { ErrorCode, throwGraphQLError } from '@utils/graphqlError'
import { login, register } from './service'
import { RegisterSchema, registerSchema } from '@schema/register'
import { ZodError } from 'zod'

export const userMutations: Resolvers['Mutation'] = {
  login: async (_, { email, password }) => {
    try {
      return await login({ email, password })
    } catch (error) {
      console.error('Failed to login', error)
      return throwGraphQLError('Invalid credentials', ErrorCode.BAD_USER_INPUT)
    }
  },
  register: async (_, { email, password }) => {
    let credentials: RegisterSchema

    try {
      credentials = registerSchema.parse({ email, password })
    } catch (error) {
      const message = (error as ZodError).errors[0].message

      console.error('Invalid credentials', error)
      return throwGraphQLError(message, ErrorCode.BAD_USER_INPUT)
    }

    try {
      return await register({ ...credentials })
    } catch (error) {
      console.error('Failed to register', error)
      return throwGraphQLError('Failed to create an employee', ErrorCode.INTERNAL_SERVER_ERROR)
    }
  },
}
