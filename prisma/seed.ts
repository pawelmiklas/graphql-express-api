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
        dateOfJoining: new Date(2023, 6, 13).toISOString(),
        dateOfBirth: new Date(1961, 4, 22).toISOString(),
        salary: 70000,
      },
      {
        firstName: 'Bettie',
        lastName: 'George',
        title: 'Dog Trainer',
        departmentId: department.id,
        dateOfJoining: new Date(2023, 9, 25).toISOString(),
        dateOfBirth: new Date(1953, 4, 5).toISOString(),
        salary: 80000,
      },
      {
        firstName: 'Hannah',
        lastName: 'Jared',
        title: 'Librarian',
        departmentId: department.id,
        dateOfJoining: new Date(2015, 4, 6).toISOString(),
        dateOfBirth: new Date(1968, 4, 15).toISOString(),
        salary: 30000,
      },
      {
        firstName: 'Ralph',
        lastName: 'Lilly',
        title: 'Project Manager',
        departmentId: department2.id,
        dateOfJoining: new Date(2018, 5, 8).toISOString(),
        dateOfBirth: new Date(1976, 4, 14).toISOString(),
        salary: 110000,
      },
      {
        firstName: 'Landon',
        lastName: 'Vincent',
        title: 'Account Executive',
        departmentId: department2.id,
        dateOfJoining: new Date(2015, 8, 18).toISOString(),
        dateOfBirth: new Date(1954, 4, 22).toISOString(),
        salary: 230000,
      },
      {
        firstName: 'Curtis',
        lastName: 'Woods',
        title: 'Medical Assistant',
        departmentId: department.id,
        dateOfJoining: new Date(2014, 10, 6).toISOString(),
        dateOfBirth: new Date(1964, 2, 8).toISOString(),
        salary: 68175,
      },
      {
        firstName: 'Jesus',
        lastName: 'Reid',
        title: 'Dog Trainer',
        departmentId: department.id,
        dateOfJoining: new Date(2016, 3, 4).toISOString(),
        dateOfBirth: new Date(1963, 2, 19).toISOString(),
        salary: 145987,
      },
      {
        firstName: 'Martha',
        lastName: 'Rice',
        title: 'Librarian',
        departmentId: department.id,
        dateOfJoining: new Date(2023, 11, 21).toISOString(),
        dateOfBirth: new Date(1985, 6, 19).toISOString(),
        salary: 42823,
      },
      {
        firstName: 'Mary',
        lastName: 'Lewis',
        title: 'Project Manager',
        departmentId: department2.id,
        dateOfJoining: new Date(2023, 2, 18).toISOString(),
        dateOfBirth: new Date(1989, 9, 23).toISOString(),
        salary: 76734,
      },
      {
        firstName: 'Roy',
        lastName: 'Chapman',
        title: 'Account Executive',
        departmentId: department2.id,
        dateOfJoining: new Date(2020, 1, 19).toISOString(),
        dateOfBirth: new Date(1957, 9, 11).toISOString(),
        salary: 61805,
      },
      {
        firstName: 'Gerald',
        lastName: 'Pratt',
        title: 'Medical Assistant',
        departmentId: department.id,
        dateOfJoining: new Date(2010, 10, 13).toISOString(),
        dateOfBirth: new Date(1968, 3, 15).toISOString(),
        salary: 104887,
      },
      {
        firstName: 'Vera',
        lastName: 'Delgado',
        title: 'Dog Trainer',
        departmentId: department.id,
        dateOfJoining: new Date(2011, 3, 22).toISOString(),
        dateOfBirth: new Date(1963, 3, 11).toISOString(),
        salary: 37436,
      },
      {
        firstName: 'Eric',
        lastName: 'Johnson',
        title: 'Librarian',
        departmentId: department.id,
        dateOfJoining: new Date(2019, 7, 24).toISOString(),
        dateOfBirth: new Date(1985, 10, 4).toISOString(),
        salary: 69777,
      },
      {
        firstName: 'Etta',
        lastName: 'Floyd',
        title: 'Project Manager',
        departmentId: department2.id,
        dateOfJoining: new Date(2020, 4, 17).toISOString(),
        dateOfBirth: new Date(1976, 9, 9).toISOString(),
        salary: 33998,
      },
      {
        firstName: 'Isabel',
        lastName: 'Farmer',
        title: 'Account Executive',
        departmentId: department2.id,
        dateOfJoining: new Date(2022, 6, 24).toISOString(),
        dateOfBirth: new Date(1983, 7, 20).toISOString(),
        salary: 126339,
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
