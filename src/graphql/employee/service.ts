import { GraphQLResolveInfo } from 'graphql'
import { db } from '@lib/prismaClient'
import { Prisma } from '@prisma/client'
import { PrismaSelect } from '@paljs/plugins'
import {
  EmployeeInput,
  PaginatedEmployee,
  Pagination,
  QueryEmployeesArgs,
  ResolversTypes,
  SortOrder,
  SortableField,
} from '@generated/graphql'

export const getEmployees = async ({
  info,
  orderBy,
  where,
  limit = 10,
  page = 1,
}: {
  orderBy: QueryEmployeesArgs['orderBy']
  where: QueryEmployeesArgs['where']
  info: GraphQLResolveInfo
  limit: Pagination['limit']
  page: Pagination['page']
}) => {
  const {
    select: { data },
  } = new PrismaSelect(info).value as {
    select: { data: { select: Prisma.EmployeeFindManyArgs['select'] } }
  }

  const orderByParams = (orderBy ?? [])
    .map((elements) => {
      if (!elements?.field || !elements?.order) {
        return null
      }

      return { [elements.field]: elements.order }
    })
    .filter((element): element is Record<SortableField, SortOrder> => element !== null)

  const whereArgs: Prisma.EmployeeFindManyArgs['where'] = {
    title: where?.title ? { contains: where.title, mode: 'insensitive' } : undefined,
    departmentId: where?.departmentId ? { equals: where.departmentId } : undefined,
    salary: {
      gte: where?.salary?.min ?? undefined,
      lte: where?.salary?.max ?? undefined,
    },
  }

  const [employees, count] = await db.$transaction([
    db.employee.findMany({
      where: { ...whereArgs },
      orderBy: orderByParams.length > 0 ? orderByParams : undefined,
      select: { ...data.select },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.employee.count({ where: { ...whereArgs } }),
  ])

  return {
    data: employees as unknown as PaginatedEmployee['data'],
    pagination: {
      limit: limit,
      page: page ?? 1,
      totalPages: Math.ceil(count / limit),
    },
  }
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
