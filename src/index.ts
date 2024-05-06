import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { employeeResolvers } from '@graphql/employee/resolvers'
import { userResolvers } from '@graphql/user/resolvers'
import { readFileSync } from 'fs'
import { context } from '@graphql/context'
import '@utils/parseEnv'

const employeeTypes = readFileSync('./src/graphql/employee/employee.graphql', 'utf-8')
const userTypes = readFileSync('./src/graphql/user/user.graphql', 'utf-8')

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

const main = async () => {
  const server = new ApolloServer({
    typeDefs: `${employeeTypes} ${userTypes}`,
    resolvers: {
      Query: {
        ...employeeResolvers.Query,
        ...userResolvers.Query,
      },
      Mutation: {
        ...employeeResolvers.Mutation,
        ...userResolvers.Mutation,
      },
    },
    includeStacktraceInErrorResponses: false,
  })

  await server.start()

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, { context })
  )
  app
    .listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
    .on('error', (error) => {
      console.error('Failed to start server:', error)
    })
}

main()
