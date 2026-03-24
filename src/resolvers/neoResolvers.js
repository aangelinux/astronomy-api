/**
 * Resolves queries for Near-Earth Objects data.
 */

import Neo from '../models/neo.js'
import Orbit from '../models/orbit.js'
import Close_Approach from '../models/approach.js'
import { verifyToken } from '../middleware/auth.js'

export const neoResolvers = {
	Query: {
		neo: async (_, { spkid }) => {
			const neo = await Neo.getNeo(spkid)
			const orbit = await Orbit.getOrbit(spkid)
			const close_approaches = await Close_Approach.getApproachBySpkid(spkid)
			return {
				...neo,
				orbit,
				close_approaches
			}
		},
		neos: async (_, { input }) => {
			const neos = await Neo.filterNeos(input)
			return {
				metadata: `${neos.length} entries found`,
				neos
			}
		}
	},

	Mutation: {
		addNeo: async (_, { input }, context) => {
			verifyToken(context)
			await Neo.addNeo(input)
			return await Neo.getNeo(input.spkid)
		},
		updateNeo: async (_, { spkid, input }, context) => {
			verifyToken(context)
			await Neo.updateNeo(spkid, input)
			return await Neo.getNeo(spkid)
		},
		deleteNeo: async (_, { spkid }, context) => {
			verifyToken(context)
			const neo = await Neo.getNeo(spkid)
			await Neo.deleteNeo(spkid)
			return {
				deletedNeo: neo,
				message: 'Near-Earth Object deleted successfully'
			}
		}
	}
}