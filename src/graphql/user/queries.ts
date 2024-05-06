import { Resolvers } from '@generated/graphql'
import { ErrorCode, throwGraphQLError } from '@utils/graphqlError'
import { getUserById } from './service'

export const userQueries: Resolvers['Query'] = {
  me: async (_, __, { user }) => {
    try {
      const currentUser = await getUserById(user)

      if (!currentUser) {
        return throwGraphQLError('User not found', ErrorCode.INTERNAL_SERVER_ERROR)
      }

      return currentUser
    } catch (error) {
      console.error('Failed to fetch user:', error)
      return throwGraphQLError('Failed to fetch user', ErrorCode.INTERNAL_SERVER_ERROR)
    }
  },
}
