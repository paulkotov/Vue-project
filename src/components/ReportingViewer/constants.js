import lodashGet from 'lodash/get'


export const VIEWER_MODE_EDIT_TEMPLATE = 'editTemplate'
export const VIEWER_MODE_EDIT_DATA = 'editData'
export const VIEWER_MODE_VIEW = 'view'

export const VIEWER_MODES = {
  [VIEWER_MODE_EDIT_TEMPLATE]: VIEWER_MODE_EDIT_TEMPLATE,
  [VIEWER_MODE_EDIT_DATA]: VIEWER_MODE_EDIT_DATA,
  [VIEWER_MODE_VIEW]: VIEWER_MODE_VIEW,
}

export const DEFAULT_COLUMN_WIDTH = 84
export const DEFAULT_ROW_HEIGHT = 24

export const getDefaultColumnConfig = (columnIndex) => ({
  name: columnIndex,
  data: {
    style: {
      width: DEFAULT_COLUMN_WIDTH,
    },
  },
})

export const getDefaultRowConfig = (rowIndex) => ({
  name: rowIndex,
  data: {
    style: {
      height: DEFAULT_ROW_HEIGHT,
    },
  },
})


const ACTION_CHANGE_WIDTH = 'changeWidth'
const ACTION_CHANGE_HEIGHT = 'changeHeight'

export const ACTION_TYPES = {
  [ACTION_CHANGE_WIDTH]: ACTION_CHANGE_WIDTH,
  [ACTION_CHANGE_HEIGHT]: ACTION_CHANGE_HEIGHT,
}

// Тут надо сделать хелпер по типу const getStyleReplaceAction (fieldName, defaultValue) => (action, template) => {}
const ACTIONS_REDUCERS = {
  [ACTION_CHANGE_WIDTH]: (action, template) => {
    const currentRangeIndex = template.ranges.findIndex(r => r.name === action.range)
    const newRanges = [...template.ranges]
    newRanges.splice(currentRangeIndex, 1, {
      ...lodashGet(template.ranges, [currentRangeIndex]),
      data: {
        ...lodashGet(template.ranges, [currentRangeIndex, 'data']),
        style: {
          ...lodashGet(template.ranges, [currentRangeIndex, 'data', 'style']),
          width: (lodashGet(
            template.ranges,
            [currentRangeIndex, 'data', 'style', 'width'],
          ) || DEFAULT_COLUMN_WIDTH) + action.offset,
        },
      },
    })
    return {
      ...template,
      ranges: newRanges,
    }
  },
  [ACTION_CHANGE_HEIGHT]: (action, template) => {
    const currentRangeIndex = template.ranges.findIndex(r => r.name === action.range)
    const newRanges = [...template.ranges]
    newRanges.splice(currentRangeIndex, 1, {
      ...lodashGet(template.ranges, [currentRangeIndex]),
      data: {
        ...lodashGet(template.ranges, [currentRangeIndex, 'data']),
        style: {
          ...lodashGet(template.ranges, [currentRangeIndex, 'data', 'style']),
          height: (lodashGet(
            template.ranges,
            [currentRangeIndex, 'data', 'style', 'height'],
          ) || DEFAULT_ROW_HEIGHT) + action.offset,
        },
      },
    })
    return {
      ...template,
      ranges: newRanges,
    }
  },
}

export const applyAction = (action, template, data) => ACTIONS_REDUCERS[action.type](action, template, data)
