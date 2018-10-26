import Coords from './Coords'


/**
 * Table cell representation
 *
 * @class
 * @constructor
 * @param {object} config Cell api resource(link to api docs)
 */
class Cell {
  constructor({
    row,
    column,
    rangeName,
    rangePos,
    data,
  }) {
    this.coords = new Coords(row, column)
    this.rangeName = rangeName
    this.rangePos = rangePos || 0
    this.data = data || undefined
  }

  get row() {
    return this.coords.row
  }

  get column() {
    return this.coords.column
  }
}

export default Cell
