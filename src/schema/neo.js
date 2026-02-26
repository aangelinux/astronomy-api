/**
 * Defines the GraphQL schema for Near-Earth Objects.
 */

import { gql } from '@apollo/server'

export const neo = gql`
	type NEO {
		id: ID!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
	}
`