/**
 * Resolves queries for Near-Earth Objects data.
 */

import Neo from '../models/neo.js'
import { authenticate } from '../middleware/auth.js'

export const neoResolvers = {
	Query: {
		neo: async (_, { spkid }) => {
			return await Neo.getNeo(spkid)
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
		updateNeo: async (_, { spkid, input }, context) => {
			authenticate(context)
			return await Neo.updateNeo(spkid, input)
		},
		deleteNeo: async (_, { spkid }, context) => {
			authenticate(context)
			const neo = await Neo.getNeo(spkid)
			await Neo.deleteNeo(spkid)

			return {
				deletedNeo: neo,
				message: 'Near-Earth Object deleted successfully'
			}
		}
	}
}