import { GraphQLScalarType, Kind } from 'graphql'

export const dateResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'ISO 8601 date scalar',
    serialize(value) {
      // outgoing -> client
      return (value instanceof Date) ? value.toISOString() : new Date(value).toISOString()
    },
    parseValue(value) {
      // incoming from variables
      const d = new Date(value)
      if (isNaN(d)) throw new TypeError('Date cannot represent an invalid date-string')
      return d
    },
    parseLiteral(ast) {
      // incoming from inline query
      if (ast.kind === Kind.STRING) {
        const d = new Date(ast.value)
        if (isNaN(d)) throw new TypeError('Date cannot represent an invalid date-string')
        return d
      }
      return null
    }
  })
}