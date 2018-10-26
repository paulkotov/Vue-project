import Coords from './Coords'


/**
 * Table cells range
 *
 * @class
 * @constructor
 * @param {object} config Cells range api resource(link to api docs)
 */
class Range {
  constructor({
    name,
    startColumn,
    endColumn,
    startRow,
    endRow,
    data,
  }) {
    this.name = name
    this.startColumn = startColumn
    this.endColumn = endColumn
    this.startRow = startRow
    this.endRow = endRow
    // We should not store null, cause it is harder to process
    this.data = data || undefined
  }

  /**
   * Here we heuristically define, if range is a column
   */
  get isColumn() {
    return this.startColumn === this.endColumn && this.startRow === 0 && this.endRow === null
  }

  /**
   * Here we heuristically define, if range is a row
   */
  get isRow() {
    return this.startRow === this.endRow && this.startColumn === 0 && this.endColumn === null
  }

  /**
   * Number of columns, covered by range
   */
  get columnsCount() {
    return (this.endColumn - this.startColumn) + 1
  }

  /**
   * Number of rows, covered by range
   */
  get rowsCount() {
    return (this.endRow - this.startRow) + 1
  }

  /**
   * Returns table cell coordinates by cell range position(end-to-end indexing from top-left to bottom-right)
   *
   * @param {number} end-to-end index in range.
   * @returns {Coords}
   */
  getCoordsInTable(rangePosition) {
    return new Coords(Math.floor(rangePosition / this.columnsCount), rangePosition % this.columnsCount)
  }
}

export default Range
