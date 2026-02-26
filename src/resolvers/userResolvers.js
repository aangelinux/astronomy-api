/**
 * Resolves queries for Users.
 */

import User from '../models/user.js'

export const userResolvers = {
	Query: {
		user: async (_, { id }) => {
			return await User.getUser(id)
		},
		users: async () => {
			return await User.getAllUsers()
		}
	}
}