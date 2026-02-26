/**
 * Defines all GraphQL schemas.
 */

import { gql } from '@apollo/server'

export const typeDefs = gql`
	type NEO {
		id: ID!
		name: String!
		earth_moid_ld: Float!
		magnitude: Float
		rotation_hours: Float
		pha: Boolean
	}

	type Orbit {
		id: ID!
		class: String!
		eccentricity: Float
		years: Float
	}

	type Close_Approach {
		id: ID!
		date: Date!
		nominal_distance_km: Float!
		minimum_distance_km: Float!
		velocity: Float
		rarity: Int
	}

	type User {
		id: ID!
		username: String!
		created: Date
	}
`