<template>
<div :class="$style.root" v-if="template">
  <r-icon :type="ICON_TYPES.clear" :size="20"></r-icon>
  <table>
    <tbody>
      <tr
        :class="$style.headerRow"
        :height="DEFAULT_ROW_HEIGHT"
      >
        <td></td>
        <td
          v-for="(column, colIndex) in columnConfigs"
          :key="column.name"
          :class="$style.headerCell"
          :width="column.data.style.width"
          :height="DEFAULT_ROW_HEIGHT"
        >
          <div :class="$style.headerCellContainer">
            <div :class="$style.headerCellContent">{{getHeaderRowCellContent(colIndex)}}</div>
            <CellDragger
              :class="$style.headerCellDragger"
              :onDrag="(offset) => handleColumnDrag(colIndex, offset)"
              :onDragEnd="() => saveTemplate()"
            ></CellDragger>
          </div>
        </td>
      </tr>
      <tr
        v-for="(row, rowIndex) in rowConfigs"
        :key="row.name"
        :class="$style.row"
        :height="row.data.style.height"
        :style="{
          ...row.data.style
        }"
      >
        <td
          :class="$style.headerCell"
          :width="DEFAULT_COLUMN_WIDTH"
          :height="row.data.style.height"
        >
          <div :class="$style.headerCellContainer">
            <div :class="$style.headerCellContent">{{getHeaderColumnCellContent(rowIndex)}}</div>
            <CellDragger
              :class="$style.headerCellDragger"
              :useYAxis="true"
              :onDrag="(offset) => handleRowDrag(rowIndex, offset)"
              :onDragEnd="() => saveTemplate()"
            ></CellDragger>
          </div>
        </td>
        <td
          v-for="(column, colIndex) in columnConfigs"
          :key="colIndex"
          :class="$style.cell"
          :height="row.data.style.height"
          :width="column.data.style.width"
          :style="{
            ...column.data.style,
          }"
        >
          cell
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import VueTypes from 'vue-types'
import { ...mapGetters, ...mapActions } from 'vuex';
import defaultsDeep from 'lodash/defaultsDeep'

import {
  VIEWER_MODES,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_ROW_HEIGHT,
  getDefaultColumnConfig,
  getDefaultRowConfig,
  ACTION_TYPES,
  applyAction,
} from './constants'

import {
  Range,
  Cell,
} from './models'

import {
  CellDragger,
  RIcon,
  ICON_TYPES,
} from './components'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

export default {
  name: 'ReportingViewer',
  props: {
    mode: VueTypes.oneOf(Object.keys(VIEWER_MODES)),
    template: VueTypes.objectOrUndef,

    onTemplateChange: VueTypes.func,
  },
  components: {
    CellDragger,
    RIcon,
  },
  data() {
    return {
      ICON_TYPES,

      DEFAULT_COLUMN_WIDTH,
      DEFAULT_ROW_HEIGHT,

      pendingActions: [],
    }
  },
  computed: {
	...mapGetters(['getContent']);
    /**
     * Prop for accessning table template.
     * This template applies all pending actions, so the data is up to date
     */
    patchedTemplate() {
      let result = this.template
      this.pendingActions.forEach(action => {
        result = applyAction(action, this.template)
      })
      return result
    },
    /**
     * Prop for accessning table ranges.
     * Concats template and data ranges(if neccessary), wraps all pure range objects from api to classes
     */
    tableRanges() {
      return this.patchedTemplate.ranges.map(range => new Range(range))
    },

    /**
     * Prop for accessning table cells.
     * Concats template and data cells(if neccessary), wraps all pure cells objects from api to classes
     */
    tableCells() {
      return this.patchedTemplate.cells.map(cell => new Cell(cell))
    },

    /**
     * Ranges dict by name for easy access
     */
    rangesMap() {
      return this.tableRanges.reduce((memo, range) => ({
        ...memo,
        [range.name]: range,
      }), {})
    },

    /**
     * Cells nested dict by row and column indecies(cells from ranges are also mapped to table coords)
     */
    cellsMap() {
      return this.tableCells.reduce((memo, cell) => { /* eslint-disable no-param-reassign */
        // If cell has range, than it's more important, than it's coordinates
        if (cell.rangeName) {
          const currentRange = this.rangesMap[cell.rangeName]
          // If cell's range is not registered, just ignore this cell
          if (!currentRange) return memo
          const coords = currentRange.getCoordsInTable(cell.rangePos)
          memo[currentRange.startRow + coords.row] = memo[currentRange.startRow + coords.row] || {}
          memo[currentRange.startRow + coords.row][currentRange.startColumn + coords.column] = cell
          return memo
        }
        // If cell has now range defined, we can look for it's coordinates
        memo[cell.row] = memo[cell.row] || {}
        // Range cells are priority, so we check, if we didn't place range cell to this place already
        if (!(memo[cell.row][cell.column] || {}).rangeName) {
          memo[cell.row][cell.column] = cell
        }
        return memo
      }, {})
    },

    /**
     * Calculates rows count, based on defined cells and template settings
     */
    tableRowsCount() {
      return this.patchedTemplate.rows || Math.max(0, ...Object.keys(this.cellsMap).map(key => Number(key) + 1))
    },

    /**
     * Calculates columns count, based on defined cells and template settings
     */
    tableColumnsCount() {
      return this.patchedTemplate.columns || 0
    },

    /**
     * Render-freindly row definitions
     */
    rowConfigs() {
      // Find all row ranges and map them by their row index
      const rowRanges = this
        .findRanges(range => range.isRow)
        .reduce((memo, range) => ({
          ...memo,
          [range.startRow]: range,
        }), {})


      // Now we create render-friendly array of row configs
      const rowsArray = (new Array(this.tableRowsCount)).fill(0).map((_, index) => {
        // Merge default row values with config
        return defaultsDeep({}, rowRanges[index], getDefaultRowConfig(index))
      })
      return rowsArray
    },

    /**
     * Render-freindly column definitions
     */
    columnConfigs() {
      // Find all column ranges and map them by their column index
      const columnRanges = this
        .findRanges(range => range.isColumn)
        .reduce((memo, range) => ({
          ...memo,
          [range.startColumn]: range,
        }), {})
      // Now we create render-friendly array of column configs
      const columnsArray = (new Array(this.tableColumnsCount)).fill(0).map((_, index) => {
        // Merge default column values with config
        return defaultsDeep({}, columnRanges[index], getDefaultColumnConfig(index))
      })
      return columnsArray
    },
  },
	mounted(){
	this.getContent();	
}
  methods: {
	...mapActions(['fetchData']);
    /**
     * Finds cell ranges, that satisfy testing function
     *
     * @param {function} testing function. Has same prototype, as for Array.filter
     */
    findRanges(testing) {
      return this.tableRanges.filter(testing)
    },
    /**
     * Calculates header row cell content by column index
     *
     * @param {number} index. Index of the column
     * @returns {string}
     */
    getHeaderRowCellContent(index) {
      let remainder = index
      let divisionRes
      const digits = []
      while (divisionRes = Math.floor(remainder / alphabet.length)) {
        // Division results starting from 1, indecies from 0
        digits.push(divisionRes - 1)
        remainder %= alphabet.length
      }
      digits.push(remainder)
      return digits.map(d => alphabet[d]).join('').toUpperCase()
    },
    /**
     * Calculates header column cell content by column index
     *
     * @param {number} index. Index of the column
     * @returns {string}
     */
    getHeaderColumnCellContent(index) {
      return (index + 1).toString()
    },

    /**
     * Dispatches action to update external data
     *
     * @param {object} action. Action object
     */
    dispatch(action) {
      const newTemplate = applyAction(action, this.template)
      this.onTemplateChange(newTemplate)
    },

    /**
     * Dispatches pending action, not updating external data, just modifying inner state
     *
     * @param {object} action. Action object
     */
    dispatchPending(action) {
      const sameTypeActionIndex = this.pendingActions.findIndex(a => a.type === action.type)
      // Use array mutation methods to trigger reactivity
      if (sameTypeActionIndex >= 0) {
        this.pendingActions.splice(sameTypeActionIndex, 1, action)
      } else {
        this.pendingActions.push(action)
      }
    },

    /**
     * Handles column drag, dispatches column width change action
     *
     * @param {number} columnIndex. Index of the column from columnConfigs
     * @param {number} offset. Drgat offset(in pixels)
     */
    handleColumnDrag(columnIndex, offset) {
      const currentPendingAction = this.pendingActions.find(a => a.type === ACTION_TYPES.changeWidth)
      this.dispatchPending({
        type: ACTION_TYPES.changeWidth,
        range: this.columnConfigs[columnIndex].name,
        offset: currentPendingAction ? currentPendingAction.offset + offset : offset,
      })
    },

    handleRowDrag(rowIndex, offset) {
      const currentPendingAction = this.pendingActions.find(a => a.type === ACTION_TYPES.changeHeight)
      this.dispatchPending({
        type: ACTION_TYPES.changeHeight,
        range: this.rowConfigs[rowIndex].name,
        offset: currentPendingAction ? currentPendingAction.offset + offset : offset,
      })
    },

    saveTemplate() {
      this.onTemplateChange(this.patchedTemplate)
      this.pendingActions = []
    },
  },
}
</script>

<style lang="scss" module>
// Colors
$black: #000;
$borderGray: #999;

// Sizes
$draggerSize: 8px;

.root {
}

.row {
  .headerCellDragger {
    cursor: row-resize;
    bottom: 0;
    left: 0;
    right: 0;
    height: $draggerSize;
  }
}

.headerRow {
  .headerCellDragger {
    cursor: col-resize;
    top: 0;
    bottom: 0;
    right: 0;
    width: $draggerSize;
  }
}

.cell {
  border: 1px solid $borderGray;
  vertical-align: middle;
  text-align: center;
}

.headerCell {
  @extend .cell;
  background-color: $borderGray;
}

.headerCellContainer {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
}

.headerCellContent {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.headerCellDragger {
  position: absolute;
  background-color: $black;
}
</style>
