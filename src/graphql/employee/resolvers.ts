import { GraphQLError } from 'graphql'
import { Resolvers } from '@generated/graphql'
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from './service'

export const employeeResolvers: Resolvers = {
  Query: {
    employees: async (_, { orderBy, where }, ___, info) => {
      try {
        return await getEmployees({ info, orderBy, where })
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        throw new GraphQLError('Failed to fetch employees', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },
    employee: async (_, { id }, __, info) => {
      try {
        return await getEmployeeById({ id, info })
      } catch (error) {
        console.error(`Failed to fetch employee with ID ${id}:`, error)
        throw new GraphQLError('Failed to fetch employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },
  },
  Mutation: {
    createEmployee: async (_, { input }, __, info) => {
      try {
        return await createEmployee({ data: input, info: info })
      } catch (error) {
        console.error('Error creating employee:', error)
        throw new GraphQLError('Failed to create an employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },
    updateEmployee: async (_, { id, input }, __, info) => {
      try {
        return await updateEmployee({ id, data: input, info })
      } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error)
        throw new GraphQLError('Failed to update employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },
    deleteEmployee: async (_, { id }, __, info) => {
      try {
        return await deleteEmployee({ id, info })
      } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error)
        throw new GraphQLError('Failed to delete employee', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        })
      }
    },
  },
}
