import { Resolvers } from '@generated/graphql'
import { userQueries } from './queries'
import { userMutations } from './mutations'

export const userResolvers: Resolvers = {
  Query: { ...userQueries },
  Mutation: { ...userMutations },
}
