/**
 * Resolves queries for Near-Earth Objects data.
 */

import Neo from '../models/neo.js'
import { verifyToken } from '../middleware/auth.js'

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
		addNeo: async (_, { input, token }) => {
			verifyToken(token)
			await Neo.addNeo(input)
			return await Neo.getNeo(input.spkid)
		},
		updateNeo: async (_, { spkid, input, token }) => {
			verifyToken(token)
			await Neo.updateNeo(spkid, input)
			return await Neo.getNeo(spkid)
		},
		deleteNeo: async (_, { spkid, token }) => {
			verifyToken(token)
			const neo = await Neo.getNeo(spkid)
			await Neo.deleteNeo(spkid)

			return {
				deletedNeo: neo,
				message: 'Near-Earth Object deleted successfully'
			}
		}
	}
}