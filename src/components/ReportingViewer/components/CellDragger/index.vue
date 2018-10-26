<template>
<div
  :class="[className, $style.root]"
  @mousedown="handleMouseDown"
  @mouseup="handleMouseUp"
>
</div>
</template>

<script>
export default {
  name: 'CellDragger',
  props: [
    'className',
    'useYAxis',
    'onDrag',
    'onDragEnd',
  ],
  methods: {
    handleMouseDown(e) {
      this.mousePressed = true
      document.addEventListener('mouseup', this.handleMouseUp)
      document.addEventListener('mousemove', this.handleMouseMove)
      this.clientCoord = this.useYAxis ? e.clientY : e.clientX
    },
    handleMouseUp() {
      this.mousePressed = false
      document.removeEventListener('mouseup', this.handleMouseUp)
      document.removeEventListener('mousemove', this.handleMouseMove)
      this.onDragEnd()
    },
    handleMouseMove(e) {
      if (this.mousePressed) {
        const newCoord = this.useYAxis ? e.clientY : e.clientX
        const offset = newCoord - this.clientCoord
        this.clientCoord = newCoord
        this.onDrag(offset)
      }
    },
  },
}
</script>

<style lang="scss" module>
.root {

}
</style>
