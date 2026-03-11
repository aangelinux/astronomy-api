/**
 * Server configuration and startup.
 */

import dotenv from 'dotenv'
import express from 'express'
import db from './config/db.js'
import cors from 'cors'
import helmet from 'helmet'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServer } from '@apollo/server'
import { loadTypeDefs } from './schema/index.js'
import { resolvers } from './resolvers/index.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Oops! Something went wrong.' })
})
app.use(cors())
app.use(helmet())

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

const apolloServer = async () => {
	new ApolloServer({ 
		typeDefs: await loadTypeDefs(), 
		resolvers
	})
}

await apolloServer.start()
app.use(expressMiddleware(apolloServer))

try {
	await db.getConnection()
	console.log('Database connected succesfully!')
} catch (error) {
	console.error('Database failed to connect: ', error)
	process.exit(1)
}

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)	
})