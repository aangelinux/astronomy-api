/**
 * Defines the GraphQL schema for Users.
 */

export const user = `#graphql
	type User {
		userid: ID!
		username: String!
		created: Date
	}

	type RegisterResponse {
		token: String!
		message: String
	}

	type LoginResponse {
		token: String!
		message: String
	}

	type DeleteResponse {
		deletedUser: String
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

	input OAuthLoginInput {
		username: String!
		provider: String!
		providerID: ID!
	}

	input DeleteInput {
		username: String!
		password: String!
	}

	extend type Query {
		user(userid: ID!): User
	}

	extend type Mutation {
		register(input: RegisterInput!): RegisterResponse
		login(input: LoginInput!): LoginResponse
		loginOAuth(input: OAuthLoginInput!): LoginResponse
		deleteAccount(input: DeleteInput!): DeleteResponse
	}
`