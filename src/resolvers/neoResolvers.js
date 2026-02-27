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
	},
	Mutation: {
		addNeo: async (_, { input }) => {
			return await Neo.addNeo(input)
		},
		updateNeo: async (_, { id, input }) => {
			return await Neo.updateNeo(id, input)
		},
		deleteNeo: async (_, { id }) => {
			return await Neo.deleteNeo(id)
		}
	}
}