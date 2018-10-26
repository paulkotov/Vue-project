<template>
<div
  :class="[className, $style.root]"
>
  <div
    :class="$style.svgWrapper"
    :style="inlineStyle"
  >
    <clear class="item" @click="clearHandler"/>
    <list class="item" @click="listHandler"/>
    <clear class="item"/>
    <clear class="item"/>
    <list class="item"/>
    <clear class="item"/>
    <clear class="item"/>
    <list class="item"/>
    <clear class="item"/>
    <clear class="item"/>
    <clear class="item"/>
    <list class="item"/>
    <clear class="item"/>
    <list class="item"/>
    <clear class="item"/>
    <button>Сравнить отчеты</button>
    <button>Заполнить из</button>
  </div>
  <div v-if="label" :class="[$style[labelPosition], labelClassName]">
    {{label}}
  </div>
</div>
</template>

<script>
import VueTypes from 'vue-types'

import {
  ICON_TYPES,
  ICON_COMPS,
  LABEL_POSITION_TYPES,
  ROTATE_TYPES,
  ROTATE_VALUES,
} from './constants'

import List from './components/List'
import Clear from './components/Clear'

export default {
  name: 'r-icon',
  components: {
    List,
    Clear,
  },
  props: {
    className: VueTypes.string,
    type: VueTypes.oneOf(Object.values(ICON_TYPES)).isRequired,
    size: null,
    rotate: VueTypes.oneOfType([
      VueTypes.oneOf(Object.values(ROTATE_TYPES)),
      VueTypes.number,
    ]).def(ROTATE_TYPES.up),
    label: null,
    labelPosition: VueTypes.string.def(LABEL_POSITION_TYPES.tooltip),
    labelClassName: VueTypes.string.def(''),
    disabled: VueTypes.bool.def(false),
    onClick: VueTypes.func.def(() => {}),
  },
  data() {
    return {
      ICON_COMPS,
    }
  },
  computed: {
    inlineStyle() {
      return {
        transform: `rotate(${typeof this.rotate === 'string' ? ROTATE_VALUES[this.rotate] : this.rotate}deg)`,
        height: `${this.size}px`,
      }
    },
  },
  methods: {
    handleOnClick(e) {
      if (!this.disabled) {
        this.$emit('onClick', e)
      }
    },
    clearHandler() {
      console.log('clear')
    },
    listHandler() {
      console.log('list')
    },
  },
}
</script>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row nowrap;
}

.svgWrapper {
  order: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
}

.svgWrapper {
  padding: 10px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 100%;
  width: 100%;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  width: 1475px;
  border-radius: 3px;
  background-color: #f3f3f3;

  &:hover + .tooltip {
    visibility: visible;
    opacity: 1;
    transition: opacity 500ms cubic-bezier(0.23, 1, 0.32, 1) 500ms;
  }
}

.svgWrapper > svg {
  height: 100%;
  width: 100%;
  fill: currentColor;
  cursor: pointer;
}

.svgWrapper >.item {
  padding: 10px;
}

.left {
  display: inline-block;
  order: 1;
  margin-right: 10px;
}

.right {
  display: inline-block;
  order: 3;
  margin-left: 10px;
}

.tooltip {
  position: absolute;
  z-index: 9999;
  display: flex;
  visibility: hidden;
  opacity: 0;
  top: 50%;
  left: 50%;
  padding: 2px 8px;
  background-color: #fff;
  border: 1px solid #424242;
  border-radius: 4px;
  transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 300ms;
}

</style>
