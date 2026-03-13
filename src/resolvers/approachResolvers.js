/**
 * Resolves queries for Close Approaches data.
 */

import Close_Approach from '../models/approach.js'

export const approachResolvers = {
	Query: {
		close_approach: async (_, { id }) => {
			return await Close_Approach.getApproach(id)
		},
		close_approaches: async (_, { input }) => {
			return await Close_Approach.filterApproaches(input)
		}
	}
}