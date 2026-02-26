/**
 * Resolves queries for Orbits.
 */

import Orbit from '../models/orbit.js'

export const orbitResolvers = {
	Query: {
		orbit: async (_, { id }) => {
			return await Orbit.getOrbit(id)
		},
		orbits: async () => {
			return await Orbit.getAllOrbits()
		}
	}
}