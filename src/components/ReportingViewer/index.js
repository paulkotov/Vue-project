import VueTypes from 'vue-types'

import Comp from './component'


// Monkey patch vue-types for using function and object types without default values
VueTypes.funcOrUndef = VueTypes.oneOfType([
  VueTypes.func,
  VueTypes.oneOf([undefined]),
]).def(undefined)

VueTypes.objectOrUndef = VueTypes.oneOfType([
  VueTypes.object,
  VueTypes.oneOf([undefined]),
]).def(undefined)

VueTypes.stringOrUndef = VueTypes.oneOfType([
  VueTypes.string,
  VueTypes.oneOf([undefined]),
]).def(undefined)

export * from './constants'

export default Comp
