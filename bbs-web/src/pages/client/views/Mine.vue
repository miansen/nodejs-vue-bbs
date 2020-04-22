<template>
  <div class="mine">
    <div class="container">

      <div class="top">
        <el-input v-model.trim="keywords" placeholder="输入关键词查询" @keyup.enter.native="handleSearch"/>
        <el-button type="primary" @click="handleSearch">检索</el-button>
      </div>

      <div v-loading="loading" class="invitation-container">
        <div
          v-for="(invitation, index) in invitations"
          :key="index"
          class="invitation"
          @click="$router.push({ name: 'InvitationDetail', params: invitation })"
        >
          <div class="header">
            <span class="username">{{ invitation.username }}</span>
            <span class="date">{{ invitation.date | formatDateTime }}</span>
            <el-button type="danger" class="delete" @click="handleDeleteInvitation(invitation)">
              <i class="el-icon-delete" />
              删除
            </el-button>
          </div>
          <p class="title">{{ invitation.title }}</p>
          <p class="content">{{ invitation.content }}</p>
        </div>
      </div>

      <el-pagination
        background
        :current-page.sync="listQuery.page"
        :page-size.sync="listQuery.limit"
        :page-sizes="[5, 10, 20, 50, 100]"
        layout="total, prev, pager, sizes, next, jumper"
        :total="total"
      />

    </div>
  </div>
</template>

<script>
import { searchInvitations, deleteInvitation } from '@/api'

import { formatDateTime } from '@/utils'

export default {
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 5
      },
      total: 0,
      loading: false,
      keywords: '',
      invitations: [],
      user: {}
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
    document.title = '我的'
    this.user = JSON.parse(window.sessionStorage.getItem('user') || '{}')
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.loading = true
      searchInvitations({
        ...this.listQuery,
        username: this.user.username,
        keywords: this.keywords
      }).then(res => {
        this.invitations = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleDeleteInvitation (invitation) {
      deleteInvitation(invitation.id).then(res => {
        if (res.data.error) {
          this.$message({
            type: 'error',
            message: res.data.error,
            showClose: true
          })
        } else {
          this.$message({
            type: 'success',
            message: '删除成功',
            showClose: true
          })
          this.handleSearch()
        }
      })
    }
  }
}
</script>

<style>
.mine {
  width: 100%;
}
.mine .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.mine .top {
  padding: 10px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: white;
}
.mine .top .el-input {
  width: 300px;
}
.mine .top a {
  margin-left: 50px;
  text-decoration: none;
  color: #67C23A;
}
.mine .top .el-button {
  margin-left: 10px;
  vertical-align: bottom;
}
.mine .invitation {
  background-color: azure;
  padding: 15px 20px;
  box-sizing: border-box;
  margin-top: 10px;
}
.mine .invitation p {
  margin: 5px 0;
}
.mine .invitation .header {
  position: relative;
}
.mine .invitation .header .delete {
  position: absolute;
  right: 0;
  top: 0;
}
.mine .username {
  margin-right: 20px;
  color: orangered;
}
.mine .date {
  color: #666;
}
.mine .title {
  color: #333;
  font-size: 18px;
}
.mine .content {
  font-size: 15px;
  color: #666;
}
.mine .el-pagination {
  margin: 10px 0;
}
</style>
