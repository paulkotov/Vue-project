import templateApiMockData from './templateApiMockData'


const templateDataKey = 'agima-template-mock'
const reportDataKey = 'agima-report-mock'


const mockGetWithLocalstorage = key => async () => {
  return JSON.parse(window.localStorage.getItem(key))
}

const mockSaveWithLocalstorage = key => async (data) => {
  window.localStorage.setItem(key, JSON.stringify(data))
  return data
}

export const getTemplate = mockGetWithLocalstorage(templateDataKey)
export const saveTemplate = mockSaveWithLocalstorage(templateDataKey)

export const getReportData = mockGetWithLocalstorage(reportDataKey)
export const saveReportData = mockSaveWithLocalstorage(reportDataKey)


// eslint-disable-next-line no-underscore-dangle
window.__RESET_REPORTING_API_MOCK__ = () => {
  saveTemplate(templateApiMockData)
}
