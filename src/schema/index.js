/**
 * Merges and exports all GraphQL schemas.
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const types = loadFilesSync(path.join(__dirname, '*.schema.js'),)

/**
 * Checks if each module is a GraphQL schema,
 * and stores the schema type in the array if true
 */
const typesArray = types.map(module => {
	if (module && typeof module === 'object' && !('kind' in module)) {
		const values = Object.values(module)
		return values[0]
	}
	return module
})

export const typeDefs = mergeTypeDefs(typesArray)