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
		register: async (_, { input }) => {
			const { username, password } = input
			const password_hash = await bcrypt.hash(password, 12)
			return await User.register({ username, password_hash })
		},
		login: async (_, { input }, context) => {
			const { username, password } = input
			return await verifyCredentials(username, password, context)
		},
		deleteAccount: async (_, { input }) => {
			const { username, password } = input
			const user = await User.getUser(username)
			await bcrypt.compare(password, user.password_hash)
			await User.delete(username)

			return {
				deletedUser: user,
				message: 'Account deleted successfully'
			}
		}
	}
}