/**
 * Parses data from a CSV file and populates the database.
 */

import db from '../src/config/db.js'
import csvParser from 'csv-parser'
import { createReadStream } from 'fs'
import { parse, format } from 'date-fns'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
	table: 'Close_Approaches',
	filePath: path.join(__dirname, '../scripts/neo_close_approaches.csv'),
	batchSize: 500,
	headers: {
		object: 'Object',
    date: 'Close-Approach (CA) Date',
    nominalDistance: 'CA DistanceNominal (km)',
    minDistance: 'CA DistanceMinimum (km)',
    relVelocity: 'V relative(km/s)',
    infVelocity: 'V infinity(km/s)',
    mag: 'H(mag)',
    diameter: 'Diameter',
    rarity: 'Rarity'
	}
}

async function populateDB() {
	const connection = await db.getConnection()
	try {
		await connection.beginTransaction()
		await connection.query('DELETE FROM Close_Approaches') // Prevent duplicated data
		await streamData(connection)
		await connection.commit()
		console.log('CSV file processed successfully')
	} catch (error) {
		await connection.rollback()
		console.error('Error populating database: ', error.message)
	} finally {
		connection.release()
		process.exit()
	}
}

async function streamData(connection) {
	const batch = []
	const batchSize = 500
	const bulkQuery = `
	INSERT INTO Close_Approaches 
	(neo_name, ca_date, nominal_distance_km, minimum_distance_km, 
	relative_velocity_km_s, infinity_velocity_km_s, abs_magnitude, 
	diameter_min_km, diameter_max_km, rarity) 
	VALUES ?`

	const fileStream = createReadStream('./scripts/neo_close_approaches.csv')
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = getValues(row)
		batch.push(values)
		if (batch.length >= batchSize) {
			await connection.query(bulkQuery, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(bulkQuery, [batch])
	}
}

function getValues(row) {
	const formattedDate = formatDate(row['Close-Approach (CA) Date'])
	const { minDiameter, maxDiameter } = splitDiameter(row['Diameter'])

	const values = [
		row['Object'],
		formattedDate,
		safeFloat(row['CA DistanceNominal (km)']),
		safeFloat(row['CA DistanceMinimum (km)']),
		safeFloat(row['V relative(km/s)']),
		safeFloat(row['V infinity(km/s)']),
		safeFloat(row['H(mag)']),
		safeFloat(minDiameter),
		safeFloat(maxDiameter),
		safeInt(row['Rarity'])
	]

	return values
}

function formatDate(date) {
	const parsedDate = parse(
		date.split('±')[0].trim(), 'yyyy-MMM-dd HH:mm', new Date())
	const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss')

	return formattedDate
}

function splitDiameter(diameter) {
	const parsedDiameter = diameter.replace('m', '')

	let minDiameter, maxDiameter
	if (parsedDiameter.includes('±')) {
		[minDiameter, maxDiameter] = parsedDiameter.split('±')
	} else if (parsedDiameter.includes('-')) {
		[minDiameter, maxDiameter] = parsedDiameter.split('-')
	} else {
		minDiameter = parsedDiameter
		maxDiameter = parsedDiameter
	}

	return { minDiameter, maxDiameter }
}

const safeFloat = (val) => {
	const parsedFloat = parseFloat(val)
	return Number.isNaN(parsedFloat) ? null : parsedFloat
}

const safeInt = (val) => {
	const parsedInt = parseInt(val)
	return Number.isNaN(parsedInt) ? null : parsedInt
}

populateDB().catch(console.error)