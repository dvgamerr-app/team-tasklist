<template lang="html">
  <div />
</template> 

<script>
export default {
  name: 'Dashboard',
  data: () => ({
  }),
  async asyncData ({ redirect }) {
    redirect('/todo/task')
    return {}
  },
  created () {
    // console.log(this.$auth.$storage.$state)
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
