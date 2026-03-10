/**
 * Merges all individual resolvers.
 */

import { neoResolvers } from './neoResolvers.js'
import { approachResolvers } from './approachResolvers.js'
import { orbitResolvers } from './orbitResolvers.js'
import { userResolvers } from './userResolvers.js'
import { dateResolvers } from './dateResolvers.js'

/**
 * Merges multiple resolvers into a single one,
 * before exporting it to the server
 */
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