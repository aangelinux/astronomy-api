/**
 * Functions for authenticating and authorizing users.
 */

import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export function authenticate(context) {
	if (!context.user) {
		throw new Error('Authentication required')
	}
}

export async function verifyCredentials(username, password, context) {
	const user = await User.getUser(username)
	if (!user) throw new Error('Username or password invalid')

	const match = await bcrypt.compare(password, user.password_hash)
	if (!match) throw new Error('Username or password invalid')

	const token = jwt.sign(
		context.user, 
		process.env.JWT_SECRET, 
		{ expiresIn: '1h' }
	)

	return token
}

export function verifyToken(req) {
	const authHeader = req.headers.authorization
	if (authHeader) {
		const token = authHeader.split(' ')[1]
		try {
			return jwt.verify(token, process.env.JWT_SECRET)
		} catch (error) {
			throw new Error('Invalid or expired token')
		}
	}
}