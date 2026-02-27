/**
 * Defines the base GraphQL schema.
 */

import { gql } from '@apollo/server'

export const base = gql`
	type Query {
		_: String
	}

	type Mutation {
		_: String
	}
`