/**
 * Express app serving a GraphQL API.
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
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Oops! Something went wrong.' })
})

app.use(helmet({  // Need these options for Apollo Server to work
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
      scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
      frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
    },
  },
}))

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

const typeDefs = await loadTypeDefs()
const apolloServer = new ApolloServer({ 
	typeDefs,
	resolvers,
	introspection: true,
	plugins: [
		ApolloServerPluginLandingPageLocalDefault()
	]
})

await apolloServer.start()
app.use(expressMiddleware(apolloServer, {
	context: async ({ req }) => { return req }
}))

try {
	await db.getConnection()
	console.log('Database connected succesfully!')
} catch (error) {
	console.error('Database failed to connect: ', error)
	process.exit(1)
}

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)	
})