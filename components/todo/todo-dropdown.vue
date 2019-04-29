<template lang="html">
  <div class="todo-dropdown border-bottom f-sm pb-2 mb-3">
    <div class="d-flex align-items-center">
      <b v-text="label" />
      <button type="button" class="btn btn-xs ml-auto" @click.prevent="onToggle">
        <fa :icon="!toggleIcon ? 'cog' : 'times'" />
      </button>
    </div>
    <div class="d-flex align-items-center">
      <div v-if="!toggleIcon">
        <span v-if="!$slots.value || !labelValue" v-text="labelValue ? labelValue : labelDefault" />
        <slot v-else name="value" />
      </div>
      <div v-else class="pt-2 todo-items">
        <slot />
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Title'
    },
    toggleIcon: {
      type: Boolean,
      default: false
    },
    labelDefault: {
      type: String,
      default: 'None yet'
    },
    labelValue: {
      type: String,
      default: null
    },
    onClick: {
      type: Function,
      default: () => null
    },
  },
  data: () => ({
  }),
  methods: {
    onToggle () {
      this.$emit('update:toggleIcon', !this.toggleIcon)
      if (this.onClick) this.onClick()
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-dropdown {
  .todo-items {
    font-size: .85rem;
    width: 100%;
  }
  .badge {
    padding-right: 0px;
    font-size: .75rem;
    .btn-close {
      padding-right: 5px;
      cursor: pointer;
    }
  }
  .btn-xs {
    color: #586069;
    box-shadow: none;
    .svg-inline--fa {
      width: 16px;
    }
  }
  .btn-xs:hover {
    color: #0366d6;
  }

}
</style>
