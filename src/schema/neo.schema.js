/**
 * Defines the GraphQL schema for Near-Earth Objects.
 */

export const neo = `#graphql
	type Neo {
		id: ID!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
		orbit: Orbit
		close_approaches: [Close_Approach]
	}

	type DeleteNeoResponse {
		deletedNeo: Neo
		message: String
	}

	input AddNeoInput {
		id: ID!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
	}

	input UpdateNeoInput {
		name: String
		earth_moid_ld: Float
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
	}

	extend type Query {
		neo(id: ID!): Neo
		neos: [Neo!]!
	}

	extend type Mutation {
		addNeo(input: AddNeoInput!): Neo
		updateNeo(id: ID!, input: UpdateNeoInput!): Neo
		deleteNeo(id: ID!): DeleteNeoResponse
	}
`