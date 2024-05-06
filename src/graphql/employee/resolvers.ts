import { Resolvers } from '@generated/graphql'
import { employeeQueries } from './queries'
import { employeeMutations } from './mutations'

export const employeeResolvers: Resolvers = {
  Query: { ...employeeQueries },
  Mutation: { ...employeeMutations },
}
