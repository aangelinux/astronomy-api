/**
 * Resolves queries for Orbits data.
 */

import Orbit from '../models/orbit.js'

export const orbitResolvers = {
	Query: {
		orbit: async (_, { spkid }) => {
			return await Orbit.getOrbit(spkid)
		},
		orbits: async (_, { input }) => {
			return await Orbit.filterOrbits(input)
		}
	}
}