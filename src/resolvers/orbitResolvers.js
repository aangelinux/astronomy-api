/**
 * Resolves queries for Orbits data.
 */

import Orbit from '../models/orbit.js'

export const orbitResolvers = {
	Query: {
		orbit: async (_, { id }) => {
			return await Orbit.getOrbit(id)
		},
		orbits: async (_, { page }) => {
			return await Orbit.getAllOrbits(page)
		}
	}
}