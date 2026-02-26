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

	type DeleteNeoResponse {
		deletedNeo: Neo
		message: String
	}

	extend type Mutation {
		addNeo(
			id: ID!
			name: String
			earth_moid_ld: Float
			magnitude: Float
			rotation_hours: Float
			pha: Boolean
		): Neo

		updateNeo(
			id: ID!
			name: String
			earth_moid_ld: Float
			magnitude: Float
			rotation_hours: Float
			pha: Boolean
		): Neo

		deleteNeo(id: ID!): DeleteNeoResponse
	}
`