<template lang="html">
  <b-card no-body>
    <div class="tabs">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li role="presentation" class="nav-item">
            <span class="nav-link" :class="!preview ? 'active' : ''" @click.prevent="onWrite">Write</span>
          </li>
          <li class="nav-item">
            <span class="nav-link" :class="preview ? 'active' : ''" @click.prevent="onPreview">Preview</span>
          </li>
        </ul>
        <div v-if="!preview" class="v-md-toolbar">
          <div v-for="(group, i) in groupButtons()" :key="i" class="btn-group ml-1" role="group">
            <button
              v-for="btn in group" :key="btn.cmd" type="button" :data-cmd="btn.cmd" :title="btn.title" 
              :class="[ 'btn-md-icon', 'btn-sm', 'btn', btn.btnClass || '' ]" @click.prevent="command(btn.cmd)"
            >
              <fa :icon="btn.faIcon" />
            </button>
          </div>
        </div>
      </div>
      <div class="tab-content mt-3">
        <div class="tab-pane v-md-container card-body is-loading" :class="!preview ? 'active' : ''">
          <textarea 
            ref="txt" v-model="txtValue" placeholder="Leave comment" class="v-md-wrapper form-control" 
            :style="styles" @change="onTextChange"
          />
        </div>
        <div class="tab-pane v-md-preview card-body" :class="preview ? 'active' : ''">
          <div v-if="txtHtmlRender" class="markdown-body" :style="styles" v-html="txtHtmlRender" />
          <div v-else class="markdown-body" :style="styles">
            Nothing to preview.
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pl-3 pr-3 pb-3">
        <div class="f-xs">
          <fa :icon="['fab','markdown']" /> <span class="d-none d-sm-inline">Styling with Markdown is supported</span>
        </div>
        <div class="ml-auto">
          <slot name="button" />
          <button v-if="!$slots.button" type="submit" class="btn btn-success" @click.prevent="onSubmit">
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
  // import Markdown from 'markdownparser'
  import MarkdownIt from 'markdown-it'

  export default {
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '280px'
      },
      toolbar: {
        type: String,
        default: 'bold italic strikethrough heading | image link | numlist bullist code quote | preview fullscreen'
      },
      name: {
        type: String,
        default: 'editor'
      },
      value: {
        type: String,
        default: '',
        required: false
      },
      buttonText: {
        type: String,
        default: 'Submit new Task'
      },
      autoSave: {
        type: Boolean,
        default: false
      },
      onSubmit: {
        type: Function,
        default: () => (() => {})
      }
    },
    data() {
      return {
        id: 'v-md-editor',
        preview: false,
        fullscreen: false,
        buttons: {
          'bold': {
            title: 'Bold',
            className: 'bold',
            cmd: 'bold',
            hotkey: 'Ctrl-B'
          },
          'italic': {
            title: 'Italic',
            className: 'italic',
            cmd: 'italic',
            hotkey: 'Ctrl-I'
          },
          'heading': {
            title: 'Heading',
            className: 'heading',
            cmd: 'heading',
            hotkey: 'Ctrl-H'
          },
          'code': {
            title: 'Code',
            className: 'code',
            cmd: 'code'
          },
          // 'quote': {
          //   title: 'Quote',
          //   className: 'quote-left',
          //   cmd: 'quote',
          //   hotkey: 'Ctrl-Q'
          // },
          'link': {
            title: 'Link',
            className: 'link',
            btnClass: 'd-none d-sm-inline',
            cmd: 'link',
            hotkey: 'Ctrl-K'
          },
          'clipboard': {
            cmd: 'clipboard',
            className: 'clipboard',
            title: 'Copy & Markdown Format',
            // hotkey: 'Ctrl-V'
          },
          'bullist': {
            cmd: 'bullist',
            className: 'list-ul',
            btnClass: 'd-none d-sm-inline',
            title: 'Generic List',

          },
          'numlist': {
            cmd: 'numlist',
            className: 'list-ol',
            btnClass: 'd-none d-sm-inline',
            title: 'Numbered List'
          }
        },
        txtValue: '',
        txtHtmlRender: '',
        shortcuts: {}
      }
    },
    computed: {
      styles () {
        return {
          width: isNaN(this.width) ? this.width : this.width + '%',
          'min-height': isNaN(this.height) ? this.height : this.height + '%'
        }
      },
      txtId () {
        return `${this.id}-${this.name}`
      }
    },

    watch: {
      txtValue (val) {
        if (val != this.value) this.$emit('input', val)
      },
      value (val) {
        if (val != this.txtValue) this.txtValue = val
      }
    },
    mounted () {
      this.build()
    },
    // destroyed() {
    //   this.editor = null;
    // },
    methods: {
      groupButtons () {
        let vm = this
        let groups = []
        let btns = []
        for (const e of vm.toolbar.toLowerCase().split(/(\s)/).filter(w => !vm.isEmpty(w))) {
          if (e === '|') {
            if (btns.length > 0) groups.push(btns)
            btns = []
          } else {
            let btn = vm.buttons[e]
            if (!btn) continue
            btns.push({
              id: `${vm.id}-${e}`,
              cmd: btn.cmd,
              title: btn.title,
              btnClass: btn.btnClass,
              className: [ vm.buttonClass, btn.ready ? 'ready' : '' ],
              faIcon: btn.className
            })
          }
        }
        if (btns.length > 0) groups.push(btns)
        return groups.length === 0 ? [ btns ] : groups
      },
      isEmpty: s => s === null || s === undefined ? true : /^[\s\xa0]*$/.test(s),
      isUrl: s => this.isEmpty(s) ? false : s.match(/((http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi),
      format() {
        var a = arguments[0];
        for (var i = 1; i <= arguments.length; i++) {
          a = a.replace(/%[a-z]/, arguments[i]);
        }
        return a; // Make chainable

      },
      setToggleBlock(type, start, end) {
        end = this.isEmpty(end) ? start : end
        const tArea = this.$refs.txt
        let startPos = tArea.selectionStart
        let endPos = tArea.selectionEnd
        let cursorPos = startPos
        let tmpStr = tArea.value

        // let text = ed.getLine(startPoint.line)
        // start = text.slice(0, startPoint.ch)
        // end = text.slice(startPoint.ch)

        start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, '');
        end = end.replace(/(\*\*|__)/, '');
        console.log(`${type}: cursor set ${startPos} ${endPos} :`, tmpStr)

        cursorPos += start.length
        this.setCursorPosition(tArea, cursorPos)
      },
      //   if (stat[type]) {

      //     if (type == "bold") {
      //       start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
      //       end = end.replace(/(\*\*|__)/, "");
      //     } else if (type == "italic") {
      //       start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
      //       end = end.replace(/(\*|_)/, "");
      //     } else if (type == "strikethrough") {
      //       start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
      //       end = end.replace(/(\*\*|~~)/, "");
      //     }
      //     ed.replaceRange(start + end, {
      //       line: startPoint.line,
      //       ch: 0
      //     }, {
      //         line: startPoint.line,
      //         ch: 99999999999999
      //       });

      //     if (type == "bold" || type == "strikethrough") {
      //       startPoint.ch -= 2;
      //       if (startPoint !== endPoint) {
      //         endPoint.ch -= 2;
      //       }
      //     } else if (type == "italic") {
      //       startPoint.ch -= 1;
      //       if (startPoint !== endPoint) {
      //         endPoint.ch -= 1;
      //       }
      //     }
      //   } else {

      //     text = ed.getSelection();
      //     if (type == "bold") {
      //       text = text.split("**").join("");
      //       text = text.split("__").join("");
      //     } else if (type == "italic") {
      //       text = text.split("*").join("");
      //       text = text.split("_").join("");
      //     } else if (type == "strikethrough") {
      //       text = text.split("~~").join("");
      //     }
      //     ed.replaceSelection(start + text + end);

      //     startPoint.ch += start.length;
      //     endPoint.ch = startPoint.ch + text.length;
      //   }

      //   ed.setSelection(startPoint, endPoint);
      // },

      // _toggleLine(name) {
      //   var ed = this.editor;
      //   var stat = this.state();
      //   var startPoint = ed.getCursor("start");
      //   var endPoint = ed.getCursor("end");
      //   var repl = {
      //     "quote": /^(\s*)\>\s+/,
      //     "bullist": /^(\s*)(\*|\-|\+)\s+/,
      //     "numlist": /^(\s*)\d+\.\s+/
      //   };
      //   var map = {
      //     "quote": "> ",
      //     "bullist": "* ",
      //     "numlist": "1. "
      //   };
      //   for (var i = startPoint.line; i <= endPoint.line; i++) {
      //     (function (i) {
      //       var text = ed.getLine(i);
      //       if (stat[name]) {
      //         text = text.replace(repl[name], "$1");
      //       } else {
      //         text = map[name] + text;
      //       }
      //       ed.replaceRange(text, {
      //         line: i, ch: 0
      //       }, {
      //           line: i, ch: 99999999999999
      //         });
      //     })(i);
      //   }

      // },

      // state(pos) {
      //   pos = pos || this.editor.getCursor("start");
      //   var stat = this.editor.getTokenAt(pos);
      //   if (!stat.type) return {};

      //   var types = stat.type.split(" ");

      //   var ret = {},
      //     data, text;
      //   for (var i = 0; i < types.length; i++) {
      //     data = types[i];
      //     if (data === "strong") {
      //       ret.bold = true;
      //     } else if (data === "variable-2") {
      //       text = this.editor.getLine(pos.line);
      //       if (/^\s*\d+\.\s/.test(text)) {
      //         ret["numlist"] = true;
      //       } else {
      //         ret["bullist"] = true;
      //       }
      //     } else if (data === "atom") {
      //       ret.quote = true;
      //     } else if (data === "em") {
      //       ret.italic = true;
      //     } else if (data === "quote") {
      //       ret.quote = true;
      //     } else if (data === "strikethrough") {
      //       ret.strikethrough = true;
      //     } else if (data === "comment") {
      //       ret.code = true;
      //     } else if (data === "link") {
      //       ret.link = true;
      //     } else if (data === "tag") {
      //       ret.image = true;
      //     } else if (data.match(/^header(\-[1-6])?$/)) {
      //       ret[data.replace("header", "heading")] = true;
      //     }
      //   }
      //   return ret;
      // },

      // _replaceSelection(active, startEnd, val) {
      //   var ed = this.editor;

      //   var text;
      //   var start = startEnd[0];
      //   var end = startEnd[1];
      //   var startPoint = ed.getCursor("start");
      //   var endPoint = ed.getCursor("end");
      //   if (val) {
      //     Object.keys(val).forEach(key => {
      //       start = start.replace('#' + key + '#', val[key]);
      //       end = end.replace('#' + key + '#', val[key]);
      //     });
      //   }

      //   if (active) {
      //     text = ed.getLine(startPoint.line);
      //     start = text.slice(0, startPoint.ch);
      //     end = text.slice(startPoint.ch);
      //     ed.replaceRange(start + end, {
      //       line: startPoint.line,
      //       ch: 0
      //     });
      //   } else {
      //     text = ed.getSelection();
      //     ed.replaceSelection(start + text + end);

      //     startPoint.ch += start.length;
      //     if (startPoint !== endPoint) {
      //       endPoint.ch += start.length;
      //     }
      //   }
      //   ed.setSelection(startPoint, endPoint);
      //   ed.focus();

      // },
      command (key, value = null) {
        switch (key) {
          case 'undo': ed.undo(); break
          case 'redo': ed.redo(); break

          case 'bold':
            this.setToggleBlock('bold', '**');
            break;

      //     case 'italic':
      //       this.setToggleBlock('italic', '*');
      //       break;

      //     case 'strikethrough':
      //       this.setToggleBlock('strikethrough', '~~');
      //       break;

      //     case 'code':
      //       this.setToggleBlock('code', '```');
      //       break;


      //     case 'heading':
      //       ed.replaceSelection('\n### ' + text);
      //       break;

          case 'clipboard':
            console.log('start', ed.getCursor('start'))
            break

      //     case 'image':
      //       this.obj('modal-image').modal('show');
      //       break;

      //     case 'link':
      //       this.obj('modal-link').modal('show');
      //       break;

      //     case 'quote':
      //       this._toggleLine('quote');
      //       break;

      //     case 'quote':
      //       this._toggleLine('quote');
      //       break;

      //     case 'numlist':
      //       this._toggleLine('numlist');
      //       break;

      //     case 'bullist':
      //       this._toggleLine('bullist');
      //       break;

          case 'fullscreen': this.fullscreen ^= true; break
          case 'preview':
            if (!this.preview) {
              let md = new MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
                breaks: true,
                quotes: '“”‘’',
                langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be useful for external highlighters. 
                highlight: (str, lang) => '<pre class="hljs" data-lang="' + lang + '"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
              })
              this.txtHtmlRender = md.render(this.txtValue)
            }
            // ed.$refs.textarea.focus()
            if (value !== null) this.preview = value; else this.preview ^= true
            break
        }
      },
      setCursorPosition(el, pos) {
        this.$nextTick(() => {
          el.focus()
          el.setSelectionRange(pos, pos)
        })
      },
      onWrite () {
        let vm = this
        this.command('preview', false)
        this.$nextTick(() => {
          vm.$refs.txt.focus()
        })
      },
      onPreview () {
        this.command('preview', true)
      },
      onTextChange () {
        this.setText(this.txtValue)
      },
      setText (val) {
        this.$auth.$storage.setLocalStorage(this.txtId, val)
      },
      getText () {
        return this.$auth.$storage.setLocalStorage(this.txtId)
      },
      build () {
        let vm = this
        for (const key in this.buttons) {
          const e = this.buttons[key];
          this.shortcuts[e.hotkey] = () => vm.command(e.cmd)
        }
        let data = this.getText()
        if (data && data.length !== 0 && this.autoSave) {
          this.txtValue = data
        }
        this.$nextTick(() => {
          vm.$refs.txt.focus()
        })
      }
      //   if (this.isEmpty(this.toolbar)) {
      //     console.error("You must set toolbar!");
      //     return;
      //   }

      //   if (this.__rendered) return;

      //   var _t = this;

      //   var btns = _t.toolbar.toLowerCase().split(/(\s)/).filter(function (w) {
      //     return !_t.isEmpty(w);
      //   });

      //   var group = $('<div class="btn-group mr-3" role="group"></div>');
      //   var toolbar = _t.obj('toolbar');
      //   for (var i = 0; i < btns.length; i++) {
      //     var btn = btns[i];
      //     var obj = _t.buttons[btn];
      //     if (obj) {
      //       btn = $(_t.format('<button type="button" id="%s-%s" data-cmd="%s" title="%s" class="%s %s"><i class="%s" aria-hidden="true"></i></button>', _t.id, btn, obj.cmd, obj.title, _t.buttonClass, obj.ready ? 'ready' : '', obj.className)).on('click', function () {
      //         _t.command($(this).attr('data-cmd'));
      //       });

      //       // if (obj.hotkey) {
      //       //   _t.shortcuts[obj.hotkey] = function () {
      //       //     //_t.command(obj.cmd);
      //       //     btn.trigger('click');
      //       //     // _t.obj(obj.cmd).trigger('click');
      //       //   }
      //       // }

      //       group.append(btn);

      //     }

      //     if (btn === '|' || i == btns.length - 1) {
      //       toolbar.append(group);
      //       group = group.clone().empty();
      //     }

      //   }
      //   //console.log( _t.shortcuts);
      //   var o = Object.assign({}, { extraKeys: _t.shortcuts, initialValue: _t.value }, _t.defaults, _t.options);
      //   _t.editor = this.$refs.textarea
      //   _t.editor.on("change", function (ed) {
      //     //_t.editor.save();          
      //     _t.$emit('input', ed.getValue());
      //     //_t.value = ed.getValue();
      //   });

      //   _t.editor.on("cursorActivity", function () {
      //     var stat = _t.state();

      //     _t.obj('toolbar').find('.btn.active:not(.ready)').removeClass('active');
      //     Object.keys(stat).forEach(key => {
      //       _t.obj(key).addClass('active');
      //     });
      //   });

      //   _t.__rendered = true;


      // }
    }
  }
</script>

<style lang="scss" scoped>
.v-md-loading {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  padding: 0.7rem 0;
}
.v-md-toolbar {
  float: right;
  margin-top: -25px;
  .card-header {
    height: 44px;
  }
}
.card-header-tabs {
  .nav-item {
    .nav-link {
      padding: 6px 24px;
      font-size: 0.8rem;
      cursor: pointer;
    }
  }
}
</style>
