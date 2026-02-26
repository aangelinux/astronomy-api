/**
 * Resolves queries for Near-Earth Objects.
 */

import Neo from '../models/neo.js'

export const neoResolvers = {
	Query: {
		neo: async (_, { id }) => {
			return await Neo.getNeo(id)
		},
		neos: async () => {
			return await Neo.getAllNeos()
		}
	}
}