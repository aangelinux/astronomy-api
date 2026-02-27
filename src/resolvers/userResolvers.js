/**
 * Resolves queries for Users data.
 */

import User from '../models/user.js'
import { authenticate } from '../middleware/auth.js'
import { request } from 'express'
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
		login: async (_, { username, password }) => {
			return await authenticate(username, password, request)
		},
		deleteAccount: async (_, { password }) => {
			const username = request.session.user
			const user = User.getUser(username)
			await bcrypt.compare(password, user.password_hash)

			return await User.delete(username)
		}
	}
}