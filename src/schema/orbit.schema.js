/**
 * Defines the GraphQL schema for Orbits.
 */

export const orbit = `#graphql
	type Orbit {
		spkid: ID!
		orbital_class: String!
		eccentricity: Float
		years: Float
	}

	extend type Query {
		orbit(spkid: ID!): Orbit
		orbits: [Orbit!]!
	}
`