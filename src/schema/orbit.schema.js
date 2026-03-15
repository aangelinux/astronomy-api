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

	type FilterResponse {
		metadata: String!
		orbits: [Orbit!]!
	}

	input FilterInput {
		limit: Int
		page: Int
		orbital_class: String
	}

	extend type Query {
		orbit(spkid: ID!): Orbit
		orbits(input: FilterInput!): FilterResponse
	}
`