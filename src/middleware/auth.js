/**
 * Functions for authenticating and authorizing users.
 */

import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function authenticate(username, password, req) {
	const user = await User.getUser(username)
	if (!user) throw new Error('Username or password invalid')

	const match = await bcrypt.compare(password, user.password_hash)
	if (!match) throw new Error('Username or password invalid')

	req.session.user = username
	const token = jwt.sign(req.session.user, process.env.JWT_SECRET, { expiresIn: '1h' })

	return token
}

export function verifyToken(req, res, next) {
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