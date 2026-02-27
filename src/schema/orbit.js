/**
 * Defines the GraphQL schema for Orbits.
 */

import { gql } from '@apollo/server'

export const orbit = gql`
	type Orbit {
		id: ID!
		class: String!
		eccentricity: Float
		years: Float
	}

	extend type Query {
		orbit(id: ID!): Orbit
		orbits: [Orbit!]!
	}
`