<template>
  <mavon-editor
    class="me-editor"
    ref="md"
    v-model="editor.value"
    @imgAdd="imgAdd"
    v-bind="editor">
  </mavon-editor>
</template>


<script>
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import {upload} from '@/api'
  export default {
    name: 'MarkdownEditor',
    props: {
      editor: Object
    },
    data() {
      return {}
    },
    mounted() {
      this.$set(this.editor, 'ref', this.$refs.md)
    },
    methods: {
      imgAdd(pos, $file) {
        let that = this
        let formdata = new FormData();
        formdata.append('file', $file);
        upload(formdata).then(res => {
          // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
          if (res.data.code == 200) {
            that.$refs.md.$img2Url(pos, `http://127.0.0.1:3000${res.data.data.url}`);
          } else {
            that.$message({message: res.data.msg, type: 'error', showClose: true})
          }
        }).catch(err => {
          that.$message({message: err, type: 'error', showClose: true});
        })
      }
    },
    components: {
      mavonEditor
    }
  }
</script>
<style scoped>
  .me-editor {
    z-index: 6 !important;
  }
  .v-note-wrapper.fullscreen {
    top: 60px !important
  }
</style>
