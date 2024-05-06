import { db } from '@lib/prismaClient'

const main = async () => {
  const department = await db.department.create({
    data: {
      name: 'Engineering',
    },
  })

  const department2 = await db.department.create({
    data: {
      name: 'Marketing',
    },
  })

  await db.employee.createMany({
    data: [
      {
        firstName: 'Leroy',
        lastName: 'Bruce',
        title: 'Medical Assistant',
        departmentId: department.id,
        dateOfJoining: new Date(2023, 10, 10).toISOString(),
        dateOfBirth: new Date(1961, 4, 10).toISOString(),
        salary: 70000,
      },
      {
        firstName: 'Bettie',
        lastName: 'George',
        title: 'Dog Trainer',
        departmentId: department.id,
        dateOfJoining: new Date(2023, 10, 10).toISOString(),
        dateOfBirth: new Date(1953, 4, 10).toISOString(),
        salary: 80000,
      },
      {
        firstName: 'Hannah',
        lastName: 'Jared',
        title: 'Librarian',
        departmentId: department.id,
        dateOfJoining: new Date(2015, 10, 10).toISOString(),
        dateOfBirth: new Date(1968, 4, 10).toISOString(),
        salary: 30000,
      },
      {
        firstName: 'Ralph',
        lastName: 'Lilly',
        title: 'Project Manager',
        departmentId: department2.id,
        dateOfJoining: new Date(2018, 10, 10).toISOString(),
        dateOfBirth: new Date(1976, 4, 10).toISOString(),
        salary: 110000,
      },
      {
        firstName: 'Landon',
        lastName: 'Vincent',
        title: 'Account Executive',
        departmentId: department2.id,
        dateOfJoining: new Date(2015, 10, 10).toISOString(),
        dateOfBirth: new Date(1954, 4, 10).toISOString(),
        salary: 230000,
      },
    ],
  })
}
const runSeed = async () => {
  try {
    await main()
    await db.$disconnect()
  } catch (error) {
    console.error(error)
    await db.$disconnect()
    process.exit(1)
  }
}

runSeed()
