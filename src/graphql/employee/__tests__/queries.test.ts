import { assert, beforeAll, describe, expect, it, vi } from 'vitest'
import { prismaMock } from '@lib/prismaMock'
import { ApolloServer } from '@apollo/server'
import { readFileSync } from 'fs'
import { employeeResolvers } from '@graphql/employee/resolvers'

const employeeTypes = readFileSync(`${__dirname}/../employee.graphql`, 'utf-8')

vi.mock('@lib/prismaClient', async () => {
  const actual = await vi.importActual('@lib/prismaMock')

  return { db: actual.prismaMock }
})

const fakeEmployee = {
  firstName: 'Leroy',
  lastName: 'Bruce',
  title: 'Medical Assistant',
  departmentId: '1',
  id: '1',
  createdAt: new Date(2021, 10, 10),
  dateOfJoining: new Date(2023, 10, 10),
  dateOfBirth: new Date(1961, 4, 10),
  salary: 24 as any,
  updatedAt: new Date(2021, 10, 10),
}

describe('employeeResolvers', () => {
  let testServer: ApolloServer

  beforeAll(() => {
    testServer = new ApolloServer({
      typeDefs: employeeTypes,
      resolvers: { Query: { ...employeeResolvers.Query } },
    })
  })

  it('Given employeeId, When query for employee executed, Then return specified details', async () => {
    // GIVEN + WHEN
    prismaMock.employee.findUnique.mockResolvedValue({ ...fakeEmployee })

    const response = await testServer.executeOperation({
      query: `
        query Employee($employeeId: ID!) {
          employee(id: $employeeId) {
            firstName
            lastName
            id
          }
        }
      `,
      variables: {
        employeeId: 'b108edb8-0f22-4480-bac2-0f8672abd050',
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.employee).toEqual({
      firstName: 'Leroy',
      lastName: 'Bruce',
      id: '1',
    })
  })

  it('Given page and limit, When query for employees executed, Then return list of employees', async () => {
    // GIVEN + WHEN
    prismaMock.employee.findMany.mockResolvedValue([
      { ...fakeEmployee },
      {
        ...fakeEmployee,
        firstName: 'Jack',
        lastName: 'Ma',
        id: '2',
      },
    ])

    prismaMock.employee.count.mockResolvedValue(2)

    prismaMock.$transaction.mockResolvedValue([
      [
        { ...fakeEmployee },
        {
          ...fakeEmployee,
          firstName: 'Jack',
          lastName: 'Ma',
          id: '2',
        },
      ],
      2,
    ])

    const response = await testServer.executeOperation({
      query: `
        query Employees($limit: Int, $page: Int) {
          employees(limit: $limit, page: $page) {
            data {
              id
              firstName
              lastName
            }
            pagination {
              limit
              page
              totalPages
            }
          }
        }
      `,
      variables: {
        limit: 10,
        page: 1,
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.employees).toEqual({
      data: [
        {
          firstName: 'Leroy',
          lastName: 'Bruce',
          id: '1',
        },
        {
          firstName: 'Jack',
          lastName: 'Ma',
          id: '2',
        },
      ],
      pagination: {
        limit: 10,
        page: 1,
        totalPages: 1,
      },
    })
  })

  it('Given invalid pagination parameters, When query for employees executed, Then return error', async () => {
    // GIVEN + WHEN
    const response = await testServer.executeOperation({
      query: `
        query Employees($limit: Int, $page: Int) {
          employees(limit: $limit, page: $page) {
            data {
              id
              firstName
              lastName
            }
            pagination {
              limit
              page
              totalPages
            }
          }
        }
      `,
      variables: {
        limit: -1,
        page: 1,
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toMatchObject([
      {
        message: 'Invalid pagination parameters',
        extensions: { code: 'BAD_USER_INPUT' },
      },
    ])
  })

  it('Given orderBy and where, When query for employees executed, Then return list of employees', async () => {
    // GIVEN + WHEN
    prismaMock.employee.findMany.mockResolvedValue([{ ...fakeEmployee }])
    prismaMock.employee.count.mockResolvedValue(2)
    prismaMock.$transaction.mockResolvedValue([[{ ...fakeEmployee }], 2])

    const response = await testServer.executeOperation({
      query: `
        query Employees($orderBy: [OrderByInput], $where: EmployeeWhereInput) {
          employees(orderBy: $orderBy, where: $where) {
            data {
              id
              firstName
              lastName
            }
            pagination {
              limit
              page
              totalPages
            }
          }
        }
      `,
      variables: {
        orderBy: [{ field: 'salary', order: 'asc' }],
        where: { title: 'medical' },
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.employees).toEqual({
      data: [
        {
          firstName: 'Leroy',
          lastName: 'Bruce',
          id: '1',
        },
      ],
      pagination: {
        limit: 10,
        page: 1,
        totalPages: 1,
      },
    })
  })
})
