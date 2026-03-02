/**
 * Combines all individual resolvers.
 */

import { neoResolvers } from './neoResolvers.js'
import { approachResolvers } from './approachResolvers.js'
import { orbitResolvers } from './orbitResolvers.js'
import { userResolvers } from './userResolvers.js'
import { dateResolvers } from './dateResolvers.js'

// Merge nested resolver maps (Query, Mutation, scalars, etc.) so fields
// from multiple modules are combined instead of overwritten.
export const resolvers = {
	...(dateResolvers.Date ? { Date: dateResolvers.Date } : {}),

	Query: {
		...(neoResolvers.Query || {}),
		...(approachResolvers.Query || {}),
		...(orbitResolvers.Query || {}),
		...(userResolvers.Query || {})
	},

	Mutation: {
		...(neoResolvers.Mutation || {}),
		...(userResolvers.Mutation || {})
	}
}