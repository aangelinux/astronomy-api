/**
 * Merges and exports all GraphQL schemas.
 */

import { mergeTypeDefs } from '@graphql-tools/merge'
import { loadFiles } from '@graphql-tools/load-files'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Checks if each module is a GraphQL schema,
 * and stores the schema type in the array if true
 */
export const loadTypeDefs = async () => {
	const types = await loadFiles(path.join(__dirname, '*.schema.js'))

	const typesArray = types.map(module => {
		if (module && typeof module === 'object' && !('kind' in module)) {
			const values = Object.values(module)
			return values[0]
		}
		return module
	})

	return mergeTypeDefs(typesArray)
}