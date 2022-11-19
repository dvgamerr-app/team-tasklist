<template lang="html">
  <div />
</template>

<script>
export default {
  name: 'Dashboard',
  asyncData({ query, redirect }) {
    return redirect(query.redirect || '/todo/task')
  },
  data: () => ({}),
  created() {
    // if (process.client && window.localStorage.getItem('_token.local') !== 'false') this.$router.replace('/')
  },
  methods: {
    onLogin() {},
  },
}
</script>
