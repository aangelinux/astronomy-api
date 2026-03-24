/**
 * Functions for authenticating and authorizing users.
 */

import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function verifyOAuthUser({ username, provider, providerID }) {
	let user = await User.getByUsername(username)
	if (!user) {
		await User.registerWithOAuth({
			username,
			provider,
			providerID
		})
		user = await User.getByUsername(username)
	}

	return user
}

export async function verifyUser({ username, password }) {
	const user = await User.getByUsername(username)
	if (!user) throw new Error('Username or password invalid')

	const passwordMatch = await bcrypt.compare(password, user.password_hash)
	if (!passwordMatch) throw new Error('Username or password invalid')

	return user
}

export function createToken(user) {
	const token = jwt.sign(
		{ userid: user.userid },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	)

	return token
}

export function verifyToken(req) {
	const authHeader = req.headers.authorization
	const token = authHeader.replace('Bearer', '')
	
	try {
		return jwt.verify(token, process.env.JWT_SECRET)
	} catch (error) {
		console.log('Error verifying token: ', error.message)
	}
}