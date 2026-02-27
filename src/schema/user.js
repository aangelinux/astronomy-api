/**
 * Defines the GraphQL schema for Users.
 */

import { gql } from '@apollo/server'

export const user = gql`
	type User {
		id: ID!
		username: String!
		created: Date
	}

	type DeleteUserResponse {
		deletedUser: User
		message: String
	}

	input RegisterInput {
		username: String!
		password: String!
	}

	input LoginInput {
		username: String!
		password: String!
	}

	input DeleteInput {
		username: String!
		password: String!
	}

	extend type Mutation {
		register(input: RegisterInput!): User
		login(input: LoginInput!): User
		deleteAccount(input: DeleteInput!): DeleteUserResponse
	}
`