<template lang="html">
  <div>
    <navigation />
    <div class="container container-main">
      <nuxt />
    </div>
    <nav-footer />
  </div>
</template>
<script>
import navigation from '~/components/navigation.vue'
import navFooter from '~/components/nav-footer.vue'

export default {
  components: {
    navigation,
    navFooter,
  },
}
</script>
