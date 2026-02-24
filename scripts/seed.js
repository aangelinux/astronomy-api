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
		await connection.query(`DELETE FROM ${config.table}`) // Prevent duplicated data
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
	const bulkQuery = `
	INSERT INTO Close_Approaches 
	(neo_name, ca_date, nominal_distance_km, minimum_distance_km, 
	relative_velocity_km_s, infinity_velocity_km_s, abs_magnitude, 
	diameter_min_km, diameter_max_km, rarity) 
	VALUES ?`

	const fileStream = createReadStream(config.filePath)
		.pipe(csvParser())

	for await (const row of fileStream) {
		const values = getValues(row)
		batch.push(values)
		if (batch.length >= config.batchSize) {
			await connection.query(bulkQuery, [batch])
			batch.length = 0
		}
	}
	if (batch.length > 0) {  // If there are remaining values
		await connection.query(bulkQuery, [batch])
	}
}

function getValues(row) {
	const formattedDate = formatDate(row[config.headers.date])
	const { minDiameter, maxDiameter } = splitDiameter(row[config.headers.diameter])

	const values = [
		row[config.headers.object],
		formattedDate,
		safeFloat(row[config.headers.nominalDistance]),
		safeFloat(row[config.headers.minDistance]),
		safeFloat(row[config.headers.relVelocity]),
		safeFloat(row[config.headers.infVelocity]),
		safeFloat(row[config.headers.mag]),
		safeFloat(minDiameter),
		safeFloat(maxDiameter),
		safeInt(row[config.headers.rarity])
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