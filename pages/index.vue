<template lang="html">
  <div />
</template> 

<script>
export default {
  name: 'Dashboard',
  data: () => ({
  }),
  async asyncData ({ query, redirect }) {
    return redirect(query.redirect || '/todo/task')
  },
  created () {
    // if (process.client && window.localStorage.getItem('_token.local') !== 'false') this.$router.replace('/')
  },
  methods: {
    onLogin () {
    }
  }
}
</script>

<style>

</style>
