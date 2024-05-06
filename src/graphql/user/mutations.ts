import { Resolvers } from '@generated/graphql'
import { ErrorCode, throwGraphQLError } from '@utils/graphqlError'
import { login, register } from './service'

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
    try {
      return await register({ email, password })
    } catch (error) {
      console.error('Failed to register', error)
      return throwGraphQLError('Failed to create an employee', ErrorCode.INTERNAL_SERVER_ERROR)
    }
  },
}
