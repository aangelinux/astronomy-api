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
			const orbits = await Orbit.filterOrbits(input)
			return {
				metadata: `${orbits.length} entries found`,
				orbits
			}
		}
	}
}