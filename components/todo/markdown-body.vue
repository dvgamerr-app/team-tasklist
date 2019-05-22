<template>
  <div class="markdown-body" v-html="body" />
</template>
<script>
import MarkdownIt from 'markdown-it'

export default {
  props: {
    content: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      body: ''
    }
  },
  mounted () {
    let md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: true,
      quotes: '“”‘’',
      langPrefix: 'language-',
      highlight: (str, lang) => '<pre class="hljs" data-lang="' + lang + '"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
    })
    this.body = md.render(this.content)
  }
}
</script>

<style lang="scss">
.markdown-body {
  width: 100%;
}
</style>
