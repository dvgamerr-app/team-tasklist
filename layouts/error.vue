<template lang="html">
  <div v-text="error.message" />
</template>

<script>
export default {
  auth: false,
  props: {
    error: {
      type: Object,
      default: () => {},
    }
  },
  mounted () {
    // this.$router.replace('/')
  }
}
</script>

<style lang="scss">
.login-form {
  .custom-control-label {
    font-size: 0.9rem;
  }
  .form-control {
    &.username {
      border-radius: 2px 2px 0 0;
    }
    &.password {
      margin-top: -2px;
      border-radius: 0 0 2px 2px;
    }
    &:hover, &:focus, &:active {
      box-shadow: none;
    }
  }
  .forgot-menu {
    font-size: 0.8rem;
  }
}
</style>
