/**
 * Creates a custom scalar type, Date.
 */

import { GraphQLScalarType, Kind } from 'graphql'

export const dateResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'ISO 8601 date scalar',
    serialize(value) {
      // Database -> Client
      return (value instanceof Date) ? value.toISOString() : new Date(value).toISOString()
    },
    parseValue(value) {
      // Client (variables) -> Database
      const date = new Date(value)
      if (isNaN(date)) throw new Error('Date format is invalid')

      return date
    },
    parseLiteral(ast) {
      // Client (inline query) -> Database
      if (ast.kind === Kind.STRING) {
        const date = new Date(ast.value)
        if (isNaN(date)) throw new Error('Date format is invalid')

        return date
      }
      return null  // no inline query
    }
  })
}