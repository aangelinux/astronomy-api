/**
 * Parses data from CSV files to populate a database.
 */

import db from '../src/config/db.js'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import * as format from './formattingUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const batchSize = 500

const NEOS = {
	filePath: path.join(__dirname, '../data/near_earth_objects.csv'),
	table: 'near_earth_objects',
	query: 
	`INSERT INTO near_earth_objects  
	(spkid, name, earth_moid_ld, magnitude, rotation_hours, pot_hazardous_asteroid) 
	VALUES ?`,

	/**
	 * Extract CSV data and modify it where needed,
	 * so it can be safely inserted into the DB
	 */
 	transform: (row) => [  
		row['spkid'],
		format.name(row['full_name']),
		format.float(row['moid_ld']),
		format.float(row['H']),
		format.float(row['rot_per']),
		format.pha(row['pha']),
	]
}

const ORBITS = {
	filePath: path.join(__dirname, '../data/orbits.csv'),
	table: 'orbits',
	query: 
	`INSERT INTO orbits 
	(spkid, orbital_class, eccentricity, years) VALUES ?`,

	transform: (row) => [
		row['spkid'],
		row['class'],
		format.float(row['e']),
		format.float(row['per_y']),
	]
}

const APPROACHES = {
	filePath: path.join(__dirname, '../data/close_approaches.csv'),
	table: 'close_approaches',
	query: 
	`INSERT INTO close_approaches  
	(spkid, date, nominal_distance_km, minimum_distance_km, relative_velocity_km_s, rarity) 
	VALUES ?`,

  transform: (row, { spkids }) => {
		// The file of Approaches only has the names of the NEOs,
		// not their spkids (unique IDs), so before inserting spkid,
		// we have to get it from the NEO dataset
		const spkid = spkids.get(row['Object'])
		if (!spkid) return null

		return [
			spkid,
			format.date(row['Close-Approach (CA) Date']),
			format.float(row['CA DistanceNominal (km)']),
			format.float(row['CA DistanceMinimum (km)']),
			format.float(row['V relative(km/s)']),
			format.int(row['Rarity'])
		]
	} 
}

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

		console.log('CSV files processed successfully')
	} catch (error) {
		await connection.rollback()
	} finally {
		connection.release()
	}
}

/**
 * Deletes all data in the DB to prevent duplicates
 */
async function emptyDatabase(connection) {
	await connection.query(`DELETE FROM ${ORBITS.table}`)

	// Must be TRUNCATE, not DELETE, to reset 'id' to 0
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
	.catch((error) => {
		console.error('Error populating database: ', error.message)
		process.exit(1)
	})