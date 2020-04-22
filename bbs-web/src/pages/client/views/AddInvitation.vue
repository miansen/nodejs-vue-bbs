<template>
  <div class="add-invitation">
    <div class="container">
      <div class="title">
        <span>帖子标题：</span>
        <el-input v-model="invitationForm.title" placeholder="请输入标题" />
      </div>
      <div class="title">
        <span>板&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;块：</span>
        <el-select v-model="invitationForm.tab" placeholder="请选择">
          <el-option
            v-for="tab in tabs"
            :key="tab.id"
            :label="tab.tabName"
            :value="tab.tabName">
          </el-option>
        </el-select>
      </div>
      <div class="content">
        <el-input type="textarea" v-model="invitationForm.content" placeholder="请输入内容" />
      </div>

      <div class="title" v-if="invitationForm.tab === '考研资料' || invitationForm.tab === '考公资料'" style="margin-top: 10px;">
        <span>上传资料：</span>
      </div>

      <div class="upload" v-if="invitationForm.tab === '考研资料' || invitationForm.tab === '考公资料'">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:3000/upload"
          :before-upload="onBeforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          :multiple="false"
          :on-exceed="handleExceed"
          :file-list="invitationForm.files">
          <el-button size="small" type="primary">上传</el-button>
          <div slot="tip" class="el-upload__tip" style="color: red">只能上传 [jpg, png, gif, txt, doc, docx, pdf, xls, xlsx, rar, zip, mp3, mp4, avi] 格式的文件，且不能超过10MB。</div>
        </el-upload>
      </div>

      <el-button type="primary" class="submit" @click="handleSubmit">发布</el-button>
    </div>
  </div>
</template>

<script>
import { addInvitation, listTabs } from '@/api'

export default {
  data () {
    return {
      invitationForm: {
        title: '',
        content: '',
        tab: '',
        files: []
      },
      tabs: []
    }
  },
  created () {
    document.title = '发帖';
    this.listTabshandle();
    console.log(this.tabs);
    console.log(this.tabs);
  },
  methods: {
    handleSubmit () {
      const { title, content, tab } = this.invitationForm
      let message = ''
      if (!title.trim()) {
        message = '请输入标题'
      } else if (!content.trim()) {
        message = '请输入内容'
      }
      if (!tab.trim()) {
        message = '请选择板块';
      }
      if (message) {
        this.$message({
          type: 'warning',
          message
        })
      } else {
        const user = JSON.parse(window.sessionStorage.getItem('user'))
        addInvitation({
          ...this.invitationForm,
          username: user.username,
          date: new Date()
        }).then(res => {
          if (res.data.error) {
            this.$message({
              type: 'error',
              message: res.data.error,
              showClose: true
            })
          } else {
            this.$message({
              type: 'success',
              message: '发布帖子成功',
              showClose: true
            })
            this.$router.push({ name: 'Home' })
          }
        })
      }
    },
    listTabshandle() {
      let that = this;
     listTabs({
       page: 1,
       limit: 1000
     }).then(data => {
       that.tabs = data.data.data;
     }).catch(error => {
       this.$message({
         type: 'error',
         message: error,
         showClose: true
       })
     });
    },
    onBeforeUpload(file) {
      console.log("上传的文件类型是: " + file.name);
      const accept = ["jpg", "png", "gif", "txt", "doc", "docx", "pdf", "xls", "xlsx", "rar", "zip", "mp3", "mp4", "avi"];
      const ext = file.name.split('.').pop();
      const index = accept.findIndex(a => a == ext);
      const size = file.size / 1024 / 1024 < 10;
      if (index < 0) {
        this.$message.error('文件的类型不支持');
      }
      if (!size) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return index >= 0 && size;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定删除 ${ file.name } ？`);
    },
    handleSuccess(response, file, fileList) {
      this.invitationForm.files.push(response.data)
    }
  }
}
</script>

<style>
.add-invitation .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.add-invitation .title {
  background-color: skyblue;
  color: white;
  padding: 5px 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 15px;
}
.add-invitation .title .el-input {
  display: inline-block;
  width: 300px;
}
.add-invitation textarea {
  height: 200px;
  resize: none;
  font-size: 15px;
}
.add-invitation .submit {
  width: 100px;
  margin: 10px 0;
  font-size: 15px;
  border-radius: 5px;
}
</style>
