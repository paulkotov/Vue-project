const camelToSnake = s => s.replace(/([a-z])([A-Z]+)/g, '$1_$2')
export const camelToLowerSnake = s => camelToSnake(s).toLowerCase()
export const camelToUpperSnake = s => camelToSnake(s).toUpperCase()
// Using camel to snake for exclude camelCase parts from converting to lower case
export const snakeToCamel = s => camelToSnake(s).toLowerCase().replace(/_(.)/g, (match, group) => group.toUpperCase())
