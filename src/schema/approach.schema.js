/**
 * Defines the GraphQL schema for Close Approaches.
 */

export const approach = `#graphql
	type Close_Approach {
		id: ID!
		spkid: String!
		date: Date!
		nominal_distance_km: Float!
		minimum_distance_km: Float!
		relative_velocity_km_s: Float
		rarity: Int
	}

	input FilterInput {
		limit: Int
		page: Int
		rarity: Int
	}

	extend type Query {
		close_approach(id: ID!): Close_Approach
		close_approaches(input: FilterInput): [Close_Approach!]!
	}
`