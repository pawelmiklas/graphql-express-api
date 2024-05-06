import { GraphQLError } from 'graphql'
import { Resolvers } from '@generated/graphql'
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from './service'
import { Pagination, paginationSchema } from '@schema/pagination'
import { throwGraphQLError, ErrorCode } from '@utils/graphqlError'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const employeeResolvers: Resolvers = {
  Query: {
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
  },
  Mutation: {
    createEmployee: async (_, { input }, __, info) => {
      try {
        return await createEmployee({ data: input, info: info })
      } catch (error) {
        console.error('Error creating employee:', error)

        if (error instanceof PrismaClientKnownRequestError) {
          return throwGraphQLError(
            'Failed to create an employee. Please check your input and try again.',
            ErrorCode.BAD_USER_INPUT
          )
        }

        return throwGraphQLError('Failed to create an employee', ErrorCode.INTERNAL_SERVER_ERROR)
      }
    },
    updateEmployee: async (_, { id, input }, __, info) => {
      try {
        return await updateEmployee({ id, data: input, info })
      } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error)

        if (error instanceof PrismaClientKnownRequestError) {
          return throwGraphQLError(
            'Failed to update employee. Please check your input and try again.',
            ErrorCode.BAD_USER_INPUT
          )
        }

        return throwGraphQLError('Failed to update employee', ErrorCode.INTERNAL_SERVER_ERROR)
      }
    },
    deleteEmployee: async (_, { id }, __, info) => {
      try {
        return await deleteEmployee({ id, info })
      } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error)
        return throwGraphQLError('Failed to delete employee', ErrorCode.INTERNAL_SERVER_ERROR)
      }
    },
  },
}
