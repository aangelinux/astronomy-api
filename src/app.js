/**
 * Server configuration and startup.
 */

import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import db from './config/db.js'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './schema/index.js'
import { resolvers } from './resolvers/index.js'
import { verifyToken } from './middleware/auth.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: "Oops! Something went wrong." })
})

const apolloServer = new ApolloServer({ 
	typeDefs, 
	resolvers, 
	context: async ({ req }) => {
		try {
			const user = verifyToken(req)
			return { user }
		} catch (err) {
			return { user: null }
		}
	}
})

await apolloServer.start()
apolloServer.applyMiddleware({ app, path: '/graphql' })

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