export default {
  id: 1,
  name: 'Template 1',
  columns: 2,
  rows: null,
  ranges: [
    {
      startColumn: 0,
      endColumn: 0,
      startRow: 0,
      endRow: null,
      name: 'First column',
      data: null,
    },
    {
      startColumn: 1,
      endColumn: 1,
      startRow: 0,
      endRow: null,
      name: 'Second column',
      data: null,
    },
    {
      startColumn: 0,
      endColumn: null,
      startRow: 0,
      endRow: 0,
      name: 'Header row',
      data: {
        style: {
          backgroundColor: '#f00',
        },
      },
    },
    {
      startColumn: 0,
      endColumn: null,
      startRow: 1,
      endRow: 1,
      name: 'First row',
      data: null,
    },
    {
      startColumn: 0,
      endColumn: null,
      startRow: 2,
      endRow: 2,
      name: 'Second row',
      data: null,
    },
  ],
  cells: [
    {
      rangeName: 'First column',
      rangePos: 0,
      data: {
        value: '1',
        type: 'TEXT',
      },
    },
    {
      rangeName: 'First column',
      rangePos: 1,
      data: {
        value: '2',
        type: 'TEXT',
      },
    },
    {
      rangeName: 'Second column',
      rangePos: 2,
      data: {
        value: '1',
        type: 'TEXT',
      },
    },
  ],
}
