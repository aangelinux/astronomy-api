/**
 * Resolves queries for Close Approaches.
 */

import Close_Approach from '../models/close_approach.js'

export const approachResolvers = {
	Query: {
		close_approach: async (_, { id }) => {
			return await Close_Approach.getApproach(id)
		},
		close_approaches: async () => {
			return await Close_Approach.getAllApproaches()
		}
	}
}