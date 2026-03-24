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
			const user = await User.getUser(userid)
			const token = createToken(user)
			return {
				token,
				message: 'Account registered successfully'
			}
		},
		login: async (_, { input }) => {
			const user = await verifyUser(input)
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
			const user = await verifyUser(input)
			await User.delete(user.username)
			return {
				deletedUser: user.userid,
				message: 'Account deleted successfully'
			}
		}
	}
}