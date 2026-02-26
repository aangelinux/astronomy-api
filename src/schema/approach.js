/**
 * Defines the GraphQL schema for Close Approaches.
 */

import { gql } from '@apollo/server'

export const approach = gql`
	type Close_Approach {
		id: ID!
		date: Date!
		nominal_distance_km: Float!
		minimum_distance_km: Float!
		velocity: Float
		rarity: Int
	}
`