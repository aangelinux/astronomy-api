/**
 * Defines the GraphQL schema for Users.
 */

export const user = `#graphql
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

	extend type Query {
		user(id: ID!): User
	}

	extend type Mutation {
		register(input: RegisterInput!): User
		login(input: LoginInput!): User
		deleteAccount(input: DeleteInput!): DeleteUserResponse
	}
`