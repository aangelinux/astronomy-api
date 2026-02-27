/**
 * Combines all individual resolvers.
 */

import { neoResolvers } from './neoResolvers.js'
import { approachResolvers } from './approachResolvers.js'
import { orbitResolvers } from './orbitResolvers.js'
import { userResolvers } from './userResolvers.js'
import { dateResolvers } from './dateResolvers.js'

export const resolvers = {
	...dateResolvers,
	...neoResolvers,
	...approachResolvers,
	...orbitResolvers,
	...userResolvers
}