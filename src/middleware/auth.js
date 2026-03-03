/**
 * Functions for authenticating and authorizing users.
 */

import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function verifyCredentials(username, password) {
	const user = await User.findByUsername(username)
	if (!user) throw new Error('Username or password invalid')

	const match = await bcrypt.compare(password, user.password_hash)
	if (!match) throw new Error('Username or password invalid')

	const token = jwt.sign(
		{ userid: user.userid },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	)

	return token
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		throw new Error('Invalid or expired token')
	}
}