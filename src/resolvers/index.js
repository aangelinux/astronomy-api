/**
 * Combines all resolvers.
 */

import { neoResolvers } from './neoResolvers.js'

export const resolvers = {
	Query: {
		...neoResolvers.Query
	}
}