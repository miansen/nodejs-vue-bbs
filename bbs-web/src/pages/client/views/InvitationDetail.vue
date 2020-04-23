<template>
  <div class="invitation-detail">
    <div class="container">
      <div class="back" @click="$router.go(-1)">
        <i class="el-icon-arrow-left" />
        返回
      </div>
      <p>
        发布人：
        <span class="username">{{ invitation.nickname }}</span>
      </p>
      <p>
        发帖时间：
        <span class="date">{{ invitation.date | formatDateTime }}</span>
      </p>
      <p>
        帖子标题：
        <span class="title">{{ invitation.title }}</span>
      </p>
      <p>
        所属板块：
        <span class="username">{{ invitation.tab }}</span>
      </p>
      <p>
        帖子内容：
        <span class="content">{{ invitation.content }}</span>
      </p>
      <p v-if="typeof invitation.files != 'undefined' && invitation.files.length > 0">
        资料附件：
      </p>
      <div v-for="(file, index) in invitation.files" :key="index">
        <div style="margin: 10px 0;">
          <el-link type="primary" :href="'http://127.0.0.1:3000' + file.url" target="_blank">{{file.name}}</el-link>
          <el-button type="primary" size="mini" @click="handleDownload(file.url)" style="margin: 0 5px;">下载</el-button>
        </div>
      </div>
    </div>


    <div class="comments-container">
      <div class="comments">
        <div class="inputer">
          <el-input
            type="textarea"
            v-model="commentContent" placeholder="请输入评论"
          />
          <el-button type="primary" class="send" @click="sendComment" style="margin: 10px 0;">发送</el-button>
        </div>
        <div v-if="invitation.comments" class="comments-container">
          <div v-for="(comment, index) in invitation.comments" :key="index" class="comment-panel">
            <span class="username">{{ comment.nickname }}</span>
            <pre class="comment-content">{{ comment.content }}</pre>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { formatDateTime } from '@/utils'
import { updateInvitation, saveComment } from '@/api'
export default {
  data () {
    return {
      user: {},
      invitation: {},
      commentContent: ''
    }
  },
  filters: {
    formatDateTime
  },
  created () {
    this.invitation = this.$route.params;
    this.user = JSON.parse(window.sessionStorage.getItem('user') || '{}');
  },
  methods: {
    async sendComment () {
      if (!this.commentContent.trim()) {
        this.$message({
          type: 'warning',
          message: '请输入评论内容',
          showClose: true
        })
        return
      }
      if (!this.invitation.comments) {
        this.invitation.comments = []
      }
      let comment = {
        username: this.user.username,
        nickname: this.user.nickname,
        postId: this.invitation.id,
        content: this.commentContent
      }
      this.invitation.comments.push(comment);
      await saveComment(comment);
      this.$message({
        type: 'success',
        message: '评论成功'
      })
      this.commentContent = '';
    },
    handleDownload(url) {
      window.open("http://127.0.0.1:3000" + url);
    }
  }
}
</script>

<style>
.invitation-detail {
  width: 100%;
}
.invitation-detail .container {
  width: 1100px;
  margin: auto;
  padding: 10px 20px;
  background-color: #def;
  box-sizing: border-box;
  border-radius: 3px;
  color: #999;
}
.invitation-detail .back {
  color: #555;
  cursor: pointer;
  font-size: 17px;
  background-color: aquamarine;
  width: 60px;
  padding: 5px 10px;
  border-radius: 4px;
}
.invitation-detail .back:hover {
  opacity: 0.8;
}
.invitation-detail .username {
  color: orangered;
}
.invitation-detail .date, .invitation-detail .content {
  color: #555;
}
.invitation-detail .title {
  font-size: 20px;
  color: #222;
}

.invitation-detail .comments-container {
  width: 1100px;
  margin: auto;
  padding: 10px 20px;
  background-color: #def;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  color: #999;
  margin-top: 20px;
}
.invitation-detail .comments-container .username {
  margin-right: 20px;
  color: orangered;
}
.invitation-detail .comments-container .comment-panel{
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-bottom: 10px;
}
</style>
