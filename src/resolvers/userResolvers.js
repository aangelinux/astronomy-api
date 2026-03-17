/**
 * Resolves queries for Users data.
 */

import User from '../models/user.js'
import { verifyUser, createToken, verifyOAuthUser } from '../middleware/auth.js'
import bcrypt from 'bcrypt'

export const userResolvers = {
	Query: {
		user: async (_, { userid }) => {
			return await User.getUser(userid)
		}
	},

	Mutation: {
		register: async (_, { input }) => {
			const { username, password } = input
			const password_hash = await bcrypt.hash(password, 12)
			const userid = await User.register({ username, password_hash })
			return await User.getUser(userid)
		},
		login: async (_, { input }) => {
			const { username, password } = input
			const user = await verifyUser(username, password)
			const token = createToken(user)
			return {
				token,
				message: 'Login successful'
			}
		},
		loginOAuth: async (_, { input }) => {
			const user = verifyOAuthUser(input)
			const token = createToken(user)
			return {
				token,
				message: 'Login successful'
			}
		},
		deleteAccount: async (_, { input }) => {
			const { username, password } = input
			const user = await verifyUser(username, password)
			await User.delete(username)
			return {
				deletedUser: user,
				message: 'Account deleted successfully'
			}
		}
	}
}