<template>
  <div class="home">
    <div class="container">

      <div class="top">
        <el-input v-model.trim="keywords" placeholder="输入关键词查询" @keyup.enter.native="handleSearch"/>
        <el-button type="primary" @click="handleSearch">检索</el-button>
      </div>

      <div v-loading="loading" class="invitation-container">
        <div
          v-for="(invitation, index) in invitations"
          :key="index"
          :class="['invitation', { top: invitation.isTop }]"
        >
          <div class="panel"
            @click="$router.push({ name: 'InvitationDetail', params: invitation })"
          >
            <div class="header">
              <span class="username">{{ invitation.username }}</span>
              <span class="date">{{ invitation.date | formatDateTime }}</span>
            </div>
            <p class="title">{{ invitation.title }}</p>
            <p class="content">{{ invitation.content.substring(0,150).replace(/[\r\n]/g,"")}}</p>
          </div>

          <!--<div v-if="invitation.comments" class="comments-container">
            <div v-for="(comment, index) in invitation.comments" :key="index" class="comment-panel">
              <span class="username">{{ comment.username }}</span>
              <pre class="comment-content">{{ comment.content }}</pre>
            </div>
          </div>-->

          <!--<div v-show="currentCommentIndex === index" class="inputer">
            <el-input
              type="textarea"
              v-model="commentContent" placeholder="请输入评论"
            />
            <el-button type="primary" class="send" @click="sendComment(invitation)">发送</el-button>
          </div>-->

          <div class="tools">
            <span
              :class="['like', { liked: invitation.likers && invitation.likers.includes(user.username) }]"
              @click="handleLike(invitation)"
            >
              <i class="el-icon-s-opportunity" />
              <span class="num">{{ invitation.likers && invitation.likers.length }}</span>
            </span>
            <span class="comment" @click="handleComment(index, invitation)">
              <i class="el-icon-s-comment" />
              <span class="num">{{ invitation.comments && invitation.comments.length }}</span>
            </span>
          </div>
        </div>
      </div>

      <el-pagination
        background
        :current-page.sync="listQuery.page"
        :page-size.sync="listQuery.limit"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, prev, pager, sizes, next, jumper"
        :total="total"
        @current-change="handleSearch"
        @size-change="handleSearch"
      />

    </div>
  </div>
</template>

<script>
import { updateInvitation, searchInvitations } from '@/api'

import { formatDateTime } from '@/utils'

export default {
  data () {
    return {
      user: { },
      listQuery: {
        page: 1,
        limit: 5
      },
      total: 0,
      loading: false,
      keywords: '',
      invitations: [],
      currentCommentIndex: -1,
      commentContent: ''
    }
  },
  filters: {
    formatDateTime
  },
  watch: {
    'listQuery.page' () {
      this.handleSearch()
    },
    'listQuery.limit' () {
      this.handleSearch()
    }
  },
  created () {
    document.title = '新帖网'
    this.user = JSON.parse(window.sessionStorage.getItem('user') || '{}')
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.loading = true
      searchInvitations({
        ...this.listQuery,
        keywords: this.keywords,
        tab: this.$route.query.tab
      }).then(res => {
        this.invitations = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    async handleLike (invitation) {
      if (!invitation.likers) {
        invitation.likers = []
      }
      const hasLiked = invitation.likers && !!invitation.likers.find(liker => liker === this.user.username)
      if (!hasLiked) {
        invitation.likers.push(this.user.username)
        await updateInvitation(invitation)
        this.$message({
          type: 'success',
          message: '点赞成功',
          showClose: true
        })
        this.handleSearch()
      }
    },
    handleComment (index, invitation) {
      if (this.currentCommentIndex === index) {
        this.currentCommentIndex = -1
      } else {
        this.currentCommentIndex = index
      }
    },
    async sendComment (invitation) {
      if (!this.commentContent.trim()) {
        this.$message({
          type: 'warning',
          message: '请输入评论内容',
          showClose: true
        })
        return
      }
      if (!invitation.comments) {
        invitation.comments = []
      }
      invitation.comments.push({
        postId: invitation.id,
        username: this.user.username,
        nickname: this.user.nickname,
        content: this.commentContent
      })
      await updateInvitation(invitation)
      this.$message({
        type: 'success',
        message: '评论成功'
      })
      this.commentContent = ''
      this.currentCommentIndex = -1
      this.handleSearch()
    }
  }
}
</script>

<style>
.home {
  width: 100%;
}
.home .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.home .top {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: white;
}
.home .top .el-input {
  width: 300px;
}
.home .top a {
  margin-left: 50px;
  text-decoration: none;
  color: #67C23A;
}
.home .top .el-button {
  margin-left: 10px;
  vertical-align: bottom;
}
.home .invitation {
  background-color: aliceblue;
  padding: 15px 20px;
  box-sizing: border-box;
  margin-top: 10px;
  cursor: pointer;
  position: relative;
}
.home .invitation.top {
  background-color: rgb(243, 197, 180);
}
.home .invitation p {
  margin: 5px 0;
}
.home .invitation .tools {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 26px;
  color: #666666;
}
.home .invitation .like.liked {
  color: red;
}
.home .invitation .like .num {
  color: #666666;
  margin-right: 15px;
}
.home .invitation .comment-panel {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
pre {
  margin: 0;
  display: inline;
  color: #666666;
}
.home .invitation .inputer {
  width: 100%;
  height: 50px;
  position: relative;
}
textarea {
  width: calc(100% - 100px);
  height: 50px;
  resize: none !important;
}
.home .invitation .inputer .send {
  position: absolute;
  width: 100px;
  height: 100%;
  right: 0;
  top: 0;
  font-size: 18px;
}
.home .username {
  margin-right: 20px;
  color: orangered;
}
.home .date {
  color: #666;
}
.home .title {
  color: #333;
  font-size: 18px;
}
.home .content {
  font-size: 15px;
  color: #666;
}
.home .el-pagination {
  margin: 10px 0;
}
</style>
