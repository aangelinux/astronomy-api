/**
 * Resolves queries for Near-Earth Objects data.
 */

import Neo from '../models/neo.js'
import { verifyToken } from '../middleware/auth.js'

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
		addNeo: async (_, { input }) => {
			verifyToken()
			return await Neo.addNeo(input)
		},
		updateNeo: async (_, { id, input }) => {
			verifyToken()
			return await Neo.updateNeo(id, input)
		},
		deleteNeo: async (_, { id }) => {
			verifyToken()
			return await Neo.deleteNeo(id)
		}
	}
}