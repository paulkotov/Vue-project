<template>
  <ReportingViewer
    :mode="VIEWER_MODES.editTemplate"
    :template="reportTemplate"
    :onTemplateChange="(newTemplate) => saveTemplate(newTemplate)"
  />
</template>

<script>
import ReportingViewer, { VIEWER_MODES } from './components/ReportingViewer'

import * as apiMock from './apiMock'


export default {
  name: 'App',
  components: {
    ReportingViewer,
  },
  data() {
    return {
      VIEWER_MODES,

      reportTemplate: undefined,
    }
  },
  methods: {
    saveTemplate(newTemplate) {
      this.reportTemplate = newTemplate
      apiMock.saveTemplate(newTemplate)
    },
  },
  async mounted() {
    this.reportTemplate = await apiMock.getTemplate()
  },
}
</script>

<style src="./styles/reset.css">

</style>
