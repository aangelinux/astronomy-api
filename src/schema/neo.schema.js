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
		close_approach: Close_Approach
	}

	type DeleteNeoResponse {
		deletedNeo: Neo
		message: String
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
		neos(page: Int!): [Neo!]!
	}

	extend type Mutation {
		addNeo(input: AddNeoInput!, token: String!): Neo
		updateNeo(spkid: ID!, input: UpdateNeoInput!, token: String!): Neo
		deleteNeo(spkid: ID!, token: String!): DeleteNeoResponse
	}
`