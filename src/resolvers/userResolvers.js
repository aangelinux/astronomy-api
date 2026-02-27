/**
 * Resolves queries for Users data.
 */

import User from '../models/user.js'
import { verifyCredentials } from '../middleware/auth.js'
import bcrypt from 'bcrypt'

export const userResolvers = {
	Query: {
		user: async (_, { id }) => {
			return await User.getUser(id)
		}
	},
	Mutation: {
		register: async (_, { username, password }) => {
			const password_hash = await bcrypt.hash(password, 12)
			return await User.register({ username, password_hash })
		},
		login: async (_, { username, password }, context) => {
			return await verifyCredentials(username, password, context)
		},
		deleteAccount: async (_, { password }) => {
			const user = User.getUser(username)
			await bcrypt.compare(password, user.password_hash)
			await User.delete(username)

			return {
				deletedUser: user,
				message: 'Account deleted successfully'
			}
		}
	}
}