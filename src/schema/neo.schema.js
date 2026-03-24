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
		pot_hazardous_asteroid: Boolean
		orbit: Orbit
		close_approaches: [Close_Approach]
	}

	type FilterResponse {
		metadata: String!
		neos: [Neo!]!
	}

	type AddNeoResponse {
		addedNeo: Neo
		message: String
	}

	type UpdateNeoResponse {
		updatedNeo: Neo
		message: String
	}

	type DeleteNeoResponse {
		deletedNeo: Neo
		message: String
	}

	input FilterInput {
		limit: Int
		offset: Int
		name: String
	}

	input AddNeoInput {
		spkid: Int!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pot_hazardous_asteroid: Boolean
	}

	input UpdateNeoInput {
		name: String
		earth_moid_ld: Float
		magnitude: Float
		rotation_hours: Float
		pot_hazardous_asteroid: Boolean
	}

	extend type Query {
		neo(spkid: ID!): Neo
		neos(input: FilterInput): FilterResponse
	}

	extend type Mutation {
		addNeo(input: AddNeoInput!): AddNeoResponse
		updateNeo(spkid: ID!, input: UpdateNeoInput!): UpdateNeoResponse
		deleteNeo(spkid: ID!): DeleteNeoResponse
	}
`