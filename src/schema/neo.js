/**
 * Defines the GraphQL schema for Near-Earth Objects.
 */

import { gql } from '@apollo/server'

export const neo = gql`
	type Neo {
		id: ID!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
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

	type DeleteNeoResponse {
		deletedNeo: Neo
		message: String
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