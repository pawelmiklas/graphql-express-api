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
      resolvers: { Mutation: { ...employeeResolvers.Mutation } },
    })
  })

  it('Given employeeId, When deleteEmployee mutation executed, Then return specified details', async () => {
    // GIVEN + WHEN
    prismaMock.employee.delete.mockResolvedValue({ ...fakeEmployee })

    const response = await testServer.executeOperation({
      query: `
        mutation DeleteEmployee($employeeId: ID!) {
          deleteEmployee(id: $employeeId) {
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
    expect(response.body.singleResult.data?.deleteEmployee).toEqual({
      firstName: 'Leroy',
      lastName: 'Bruce',
      id: '1',
    })
  })

  it('Given employee data, When createEmployee mutation executed, Then return specified details', async () => {
    // GIVEN + WHEN
    prismaMock.employee.create.mockResolvedValue({ ...fakeEmployee })

    const response = await testServer.executeOperation({
      query: `
        mutation CreateEmployee($input: EmployeeInput!) {
          createEmployee(input: $input) {
            firstName
            lastName
            id
          }
        }
      `,
      variables: {
        input: {
          firstName: 'Leroy',
          lastName: 'Bruce',
          title: 'Medical Assistant',
          departmentId: '1',
          dateOfBirth: '1961-05-10',
          dateOfJoining: '2023-11-10',
          salary: 24,
        },
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.createEmployee).toEqual({
      firstName: 'Leroy',
      lastName: 'Bruce',
      id: '1',
    })
  })

  it('Given employee data, When updateEmployee mutation executed, Then return specified details', async () => {
    // GIVEN + WHEN
    prismaMock.employee.update.mockResolvedValue({ ...fakeEmployee })

    const response = await testServer.executeOperation({
      query: `
        mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
          updateEmployee(id: $id, input: $input) {
            firstName
            lastName
            id
          }
        }
      `,
      variables: {
        id: 'b108edb8-0f22-4480-bac2-0f8672abd050',
        input: {
          firstName: 'Leroy',
          lastName: 'Bruce',
          title: 'Medical Assistant',
          departmentId: '1',
          dateOfBirth: '1961-05-10',
          dateOfJoining: '2023-11-10',
          salary: 24,
        },
      },
    })

    // THEN
    assert(response.body.kind === 'single')
    expect(response.body.singleResult.data?.updateEmployee).toEqual({
      firstName: 'Leroy',
      lastName: 'Bruce',
      id: '1',
    })
  })
})
