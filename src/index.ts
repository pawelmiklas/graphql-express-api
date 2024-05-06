import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { employeeResolvers } from './graphql/employee/resolvers'
import { readFileSync } from 'fs'

const employeeTypes = readFileSync('./src/graphql/employee/employee.graphql', 'utf-8')

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

const main = async () => {
  const server = new ApolloServer({
    typeDefs: employeeTypes,
    resolvers: {
      Query: {
        ...employeeResolvers.Query,
      },
      Mutation: {
        ...employeeResolvers.Mutation,
      },
    },
  })

  await server.start()

  app.use(cors())
  app.use(express.json())
  app.use(expressMiddleware(server))
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

main()
