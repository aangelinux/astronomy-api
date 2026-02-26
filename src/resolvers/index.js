/**
 * Combines all individual resolvers.
 */

import { neoResolvers } from './neoResolvers.js'
import { approachResolvers } from './approachResolvers.js'
import { orbitResolvers } from './orbitResolvers.js'
import { userResolvers } from './userResolvers.js'

export const resolvers = {
	Query: {
		...neoResolvers.Query,
		...approachResolvers.Query,
		...orbitResolvers.Query,
		...userResolvers.Query
	}
}