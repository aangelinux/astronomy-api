/**
 * Generates schemas for a database.
 */

import db from '../src/config/db.js'

const astronomyQuery = `USE astronomy_api`
await db.query(astronomyQuery)

const neoQuery = `
	CREATE TABLE near_earth_objects (
		spkid INT NOT NULL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		earth_moid_ld FLOAT NOT NULL,
		magnitude FLOAT,
		rotation_hours FLOAT,
		pot_hazardous_asteroid BOOLEAN
	)`

await db.query(neoQuery)

const orbitQuery = `
	CREATE TABLE orbits (
		spkid INT NOT NULL PRIMARY KEY,
		orbital_class VARCHAR(3) NOT NULL,
		eccentricity FLOAT,
		years FLOAT,
		FOREIGN KEY (spkid) REFERENCES near_earth_objects(spkid)
	)`

await db.query(orbitQuery)

const approachQuery = `
	CREATE TABLE close_approaches (
		id INT AUTO_INCREMENT PRIMARY KEY,
		spkid INT NOT NULL,
		date DATETIME NOT NULL,
		nominal_distance_km FLOAT NOT NULL,
		minimum_distance_km FLOAT NOT NULL,
		relative_velocity_km_s FLOAT,
		rarity INT,
		FOREIGN KEY (spkid) REFERENCES near_earth_objects(spkid)
	)`

await db.query(approachQuery)

const userQuery = `
	CREATE TABLE users (
		userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(100) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		created DATETIME
	)`

await db.query(userQuery)