/**
 * Defines the GraphQL schema for Orbits.
 */

export const orbit = `#graphql
	type Orbit {
		id: ID!
		class: String!
		eccentricity: Float
		years: Float
	}

	extend type Query {
		orbit(id: ID!): Orbit
		orbits: [Orbit!]!
	}
`