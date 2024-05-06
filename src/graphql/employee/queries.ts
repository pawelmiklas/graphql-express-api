import { Resolvers } from '@generated/graphql'
import { getEmployeeById, getEmployees } from './service'
import { Pagination, paginationSchema } from '@schema/pagination'
import { throwGraphQLError, ErrorCode } from '@utils/graphqlError'

export const employeeQueries: Resolvers['Query'] = {
  employees: async (_, { orderBy, where, limit, page }, ___, info) => {
    let paginationParams: Pagination

    try {
      paginationParams = paginationSchema.parse({ limit, page })
    } catch (error) {
      console.error('Error parsing pagination:', error)
      return throwGraphQLError('Invalid pagination parameters', ErrorCode.BAD_USER_INPUT)
    }

    try {
      return await getEmployees({ info, orderBy, where, ...paginationParams })
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      return throwGraphQLError('Failed to fetch employees', ErrorCode.INTERNAL_SERVER_ERROR)
    }
  },
  employee: async (_, { id }, __, info) => {
    try {
      return await getEmployeeById({ id, info })
    } catch (error) {
      console.error(`Failed to fetch employee with ID ${id}:`, error)
      return throwGraphQLError('Failed to fetch employee', ErrorCode.INTERNAL_SERVER_ERROR)
    }
  },
}
