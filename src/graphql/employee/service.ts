import { GraphQLResolveInfo } from 'graphql'
import { db } from '@lib/prismaClient'
import { Prisma } from '@prisma/client'
import { PrismaSelect } from '@paljs/plugins'
import {
  EmployeeInput,
  QueryEmployeesArgs,
  ResolversTypes,
  SortOrder,
  SortableField,
} from '@generated/graphql'

export const getEmployees = async ({
  info,
  orderBy,
  where,
}: {
  orderBy: QueryEmployeesArgs['orderBy']
  where: QueryEmployeesArgs['where']
  info: GraphQLResolveInfo
}) => {
  const { select } = new PrismaSelect(info).value as {
    select: Prisma.EmployeeFindManyArgs['select']
  }

  const orderByParams = (orderBy ?? [])
    .map((elements) => {
      if (!elements?.field || !elements?.order) {
        return null
      }

      return { [elements.field]: elements.order }
    })
    .filter((element): element is Record<SortableField, SortOrder> => element !== null)

  const employees = await db.employee.findMany({
    where: {
      title: where?.title ? { contains: where.title } : undefined,
      departmentId: where?.departmentId ? { equals: where.departmentId } : undefined,
      salary: {
        gte: where?.salary?.min ?? undefined,
        lte: where?.salary?.max ?? undefined,
      },
    },
    orderBy: orderByParams,
    select: { ...select },
  })

  return employees as unknown as ResolversTypes['Employee'][]
}

export const getEmployeeById = async ({ info, id }: { info: GraphQLResolveInfo; id: string }) => {
  const { select } = new PrismaSelect(info).value as {
    select: Prisma.EmployeeFindUniqueArgs['select']
  }

  const employee = await db.employee.findUnique({
    where: { id },
    select: { ...select },
  })

  return employee as unknown as ResolversTypes['Employee']
}

export const deleteEmployee = async ({ id, info }: { id: string; info: GraphQLResolveInfo }) => {
  const { select } = new PrismaSelect(info).value as { select: Prisma.EmployeeDeleteArgs['select'] }

  const deletedEmployee = await db.employee.delete({
    where: { id },
    select: { ...select },
  })

  return deletedEmployee as unknown as ResolversTypes['Employee']
}

export const createEmployee = async ({
  data,
  info,
}: {
  data: EmployeeInput
  info: GraphQLResolveInfo
}) => {
  const { firstName, lastName, dateOfBirth, dateOfJoining, salary, title, departmentId } = data
  const { select } = new PrismaSelect(info).value as { select: Prisma.EmployeeCreateArgs['select'] }

  const createdEmployee = await db.employee.create({
    data: {
      firstName,
      lastName,
      dateOfBirth,
      dateOfJoining,
      salary,
      title,
      department: { connect: { id: departmentId } },
    },
    select: { ...select },
  })

  return createdEmployee as unknown as ResolversTypes['Employee']
}

export const updateEmployee = async ({
  id,
  data,
  info,
}: {
  id: string
  data: EmployeeInput
  info: GraphQLResolveInfo
}) => {
  const { firstName, lastName, dateOfBirth, dateOfJoining, salary, title, departmentId } = data
  const { select } = new PrismaSelect(info).value as { select: Prisma.EmployeeUpdateArgs['select'] }

  const updatedEmployee = await db.employee.update({
    where: { id },
    data: {
      firstName,
      lastName,
      dateOfBirth,
      dateOfJoining,
      salary,
      title,
      department: { connect: { id: departmentId } },
    },
    select: { ...select },
  })

  return updatedEmployee as unknown as ResolversTypes['Employee']
}
