<template>
  <div class="xxjj">
    <div class="container">
      <el-button type="primary" v-if="!isClient && isEdit" @click="editHandle" style="margin-bottom: 10px;">
        <i class="el-icon-edit-outline" />
        编辑
      </el-button>
      <div class="md-content">
        <markdown-editor :editor="xxjj.editor"></markdown-editor>
      </div>
      <el-button type="primary" v-if="!isClient && !isEdit" @click="saveHandle" style="margin-top: 10px;">
        <i class="el-icon-circle-plus-outline" />
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
  import MarkdownEditor from '@/components/MarkdownEditor';
  import {getXxjj, updateXxjj} from '@/api';

  export default {
    name: 'Xxjj',
    components: {
      'markdown-editor': MarkdownEditor,
    },
    created: function() {
      document.title = '学校简介管理';
      this.isClient = JSON.parse(window.sessionStorage.getItem('isClient') || false);
      this.getXxjj();
    },
    data: function() {
      return {
        isClient: true,
        isEdit: true,
        xxjj: {
          id: 1,
          editor: {
            value: '',
            ref: '', // 保存mavonEditor实例  实际不该这样
            editable: false,
            defaultOpen: 'preview',
            toolbarsFlag: false,
            subfield: false,
            boxShadow: false,
            previewBackground: '#fff'
          }
        }
      }
    },
    methods: {
      getXxjj: function() {
        let that = this;
        getXxjj(1).then(res => {
          that.xxjj.editor.value = res.data.data.content;
        }).catch(e => {
          that.$message({type: 'error', message: '加载失败', showClose: true});
        });
      },
      editHandle() {
        this.isEdit = false;
        this.xxjj.editor.editable = true;
        this.xxjj.editor.defaultOpen = "edit";
        this.xxjj.editor.toolbarsFlag = true;
        this.xxjj.editor.subfield = true;
        this.xxjj.editor.boxShadow = true;
        this.xxjj.editor.previewBackground = "#fbfbfb";
      },
      saveHandle() {
        this.isEdit = true;
        this.xxjj.editor.editable = false;
        this.xxjj.editor.defaultOpen = "preview";
        this.xxjj.editor.toolbarsFlag = false;
        this.xxjj.editor.subfield = false;
        this.xxjj.editor.boxShadow = false;
        this.xxjj.editor.previewBackground = "#fff";
        let that = this;
        let params = {
          id: this.xxjj.id,
          content: this.xxjj.editor.value
        }
        updateXxjj(params).then(res => {
          if (res.data.code == 200) {
            that.$message({type: 'success', message: '保存成功', showClose: true});
          } else {
            that.$message({type: 'error', message: '保存失败', showClose: true});
          }
        }).catch(e => {
          that.$message({type: 'error', message: '保存失败', showClose: true});
        });
      }
    }
  }
</script>

<style scoped>
  .xxjj {
    width: 100%;
  }
  .xxjj .container {
    width: 1100px;
    margin: auto;
    padding: 20px 0;
  }
  .xxjj .el-table {
    margin: 20px 0;
  }
</style>
