/**
 * Server configuration and startup.
 */

import dotenv from 'dotenv'
import express from 'express'
import db from './config/db.js'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './schema/index.js'
import { resolvers } from './resolvers/index.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: "Oops! Something went wrong." })
})

const apolloServer = new ApolloServer({ 
	typeDefs, 
	resolvers
})

await apolloServer.start()
app.use(expressMiddleware(apolloServer))

try {
	await db.getConnection()
	console.log('Database connected succesfully!')
} catch (error) {
	console.error('Database failed to connect: ', error)
	process.exit(1)
}

app.listen(process.env.PORT, () => {
	console.log(`Server running on PORT ${process.env.PORT}`)	
})