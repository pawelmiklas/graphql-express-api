import { Resolvers } from '@generated/graphql'
import { createEmployee, deleteEmployee, updateEmployee } from './service'
import { throwGraphQLError, ErrorCode } from '@utils/graphqlError'
import { PrismaClientValidationError } from '@prisma/client/runtime/library'

export const employeeMutations: Resolvers['Mutation'] = {
  createEmployee: async (_, { input }, __, info) => {
    try {
      return await createEmployee({ data: input, info: info })
    } catch (error) {
      console.error('Error creating employee:', error)

      if (error instanceof PrismaClientValidationError) {
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

      if (error instanceof PrismaClientValidationError) {
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
}
