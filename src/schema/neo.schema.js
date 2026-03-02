/**
 * Defines the GraphQL schema for Near-Earth Objects.
 */

export const neo = `#graphql
	type Neo {
		spkid: ID!
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
		spkid: ID!
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
		neo(spkid: ID!): Neo
		neos: [Neo!]!
	}

	extend type Mutation {
		addNeo(input: AddNeoInput!): Neo
		updateNeo(spkid: ID!, input: UpdateNeoInput!): Neo
		deleteNeo(spkid: ID!): DeleteNeoResponse
	}
`