import { ExpressMiddlewareOptions } from '@apollo/server/express4'
import { getUserFromToken } from './user/service'
import { ErrorCode, throwGraphQLError } from '@utils/graphqlError'

export const context: ExpressMiddlewareOptions<any>['context'] = async ({ req }) => {
  if (req.body.query.includes('login') || req.body.query.includes('register')) {
    return {}
  }

  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''

  if (!token) {
    return throwGraphQLError('User is not authenticated', ErrorCode.UNAUTHENTICATED)
  }

  const user = getUserFromToken(token)

  if (!user) {
    return throwGraphQLError('User is not authenticated', ErrorCode.UNAUTHENTICATED)
  }

  return { user }
}
