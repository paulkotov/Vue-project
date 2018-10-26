import { snakeToCamel, camelToLowerSnake } from '../../helpers/namingNotation'


const context = require.context('./components', true, /\.(vue|js)$/)

export const ICON_COMPS = context.keys().reduce((memo, key) => ({
  ...memo,
  [snakeToCamel(camelToLowerSnake(key.replace(/\.\/|\.(vue|js)/g, '')))]: context(key).default || context(key),
}), {})
export const ICON_TYPES = {}
Object.keys(ICON_COMPS).forEach(item => { (ICON_TYPES[item] = item) })
const UP = 'up'
const RIGHT = 'right'
const DOWN = 'down'
const LEFT = 'left'
const TOOLTIP = 'tooltip'

export const LABEL_POSITION_TYPES = {
  [TOOLTIP]: TOOLTIP,
  [RIGHT]: RIGHT,
  [LEFT]: LEFT,
}

export const ROTATE_TYPES = {
  [UP]: UP,
  [RIGHT]: RIGHT,
  [DOWN]: DOWN,
  [LEFT]: LEFT,
}

export const ROTATE_VALUES = {
  [UP]: 0,
  [RIGHT]: 90,
  [DOWN]: 180,
  [LEFT]: 270,
}
