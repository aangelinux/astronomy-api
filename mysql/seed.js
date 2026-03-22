/**
 * Parses data from CSV files to populate a database.
 */

import db from '../src/config/db.js'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'
import { NEOS, ORBITS, APPROACHES } from './config.js'

async function seed() {
	const connection = await db.getConnection()
	try {
		await connection.beginTransaction()
		await emptyDatabase(connection)
		await streamData(connection, NEOS)
		await streamData(connection, ORBITS)
		await streamData(connection, APPROACHES, 
			{ spkids: await getSpkids(connection) })
		await connection.commit()

		console.log('CSV files processed successfully!')
	} catch (error) {
		await connection.rollback()
		console.error('Error populating DB: ', error.message)
	} finally {
		connection.release()
	}
}

/**
 * Deletes all data in the DB to prevent duplicates
 */
async function emptyDatabase(connection) {
	await connection.query(`DELETE FROM ${ORBITS.table}`)

	// Must be TRUNCATE, not DELETE, to reset id to 1
	await connection.query(`TRUNCATE TABLE ${APPROACHES.table}`)

	// Must be last because the other tables reference it
	await connection.query(`DELETE FROM ${NEOS.table}`)
}

/**
 * Reads data line-by-line from a CSV file,
 * then inserts the data into the DB in batches
 */
async function streamData(connection, dataset, context = {}) {
	const batch = []
	const batchSize = 500
	const fileStream = createReadStream(dataset.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = dataset.transform(row, context)
		if (!values) continue

		batch.push(values)
		if (batch.length >= batchSize) {
			await connection.query(dataset.query, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) { // Inserts any remaining values
		await connection.query(dataset.query, [batch])
	}
}

/**
 * Creates a map of name -> spkid for each NEO
 */
async function getSpkids(connection) {
	const [rows] = await connection.query(
		`SELECT spkid, name FROM near_earth_objects`)
	
	const map = new Map()
	for (const row of rows) {
		map.set(row.name, row.spkid)
	}

	return map
}

seed()
	.then(() => process.exit(0))
	.catch((e) => process.exit(1))