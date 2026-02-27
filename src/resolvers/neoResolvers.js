/**
 * Resolves queries for Near-Earth Objects data.
 */

import Neo from '../models/neo.js'
import { authenticate } from '../middleware/auth.js'

export const neoResolvers = {
	Query: {
		neo: async (_, { id }) => {
			return await Neo.getNeo(id)
		},
		neos: async (_, { page }) => {
			return await Neo.getAllNeos(page)
		}
	},
	Mutation: {
		addNeo: async (_, { input }, context) => {
			authenticate(context)
			return await Neo.addNeo(input)
		},
		updateNeo: async (_, { id, input }, context) => {
			authenticate(context)
			return await Neo.updateNeo(id, input)
		},
		deleteNeo: async (_, { id }, context) => {
			authenticate(context)
			const neo = await Neo.getNeo(id)
			await Neo.deleteNeo(id)

			return {
				deletedNeo: neo,
				message: 'Near-Earth Object deleted successfully'
			}
		}
	}
}