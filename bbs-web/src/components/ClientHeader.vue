<template>

  <el-header v-if="activeNav !== 'Login' && activeNav !== 'Register'" class="me-area" style="height: 61px;">
    <el-row class="me-header">
      <el-col :span="4" class="me-header-left">
        <router-link to="/" class="me-title">
          新帖网
        </router-link>
      </el-col>
    <el-col :span="16">
      <el-menu  text-color="#303133"
                background-color="#ffffff"
                :router=true
                menu-trigger="click"
                active-text-color="#409EFF"
                :default-active="activeIndex"
                mode="horizontal">
        <el-menu-item index="/" @click="handleEvent(null)">首页</el-menu-item>

        <el-submenu index="2">
          <template slot="title">板块</template>
          <el-menu-item @click="handleEvent(tab.tabName)" v-for="(tab, index) in tabs" :key="index">
            {{tab.tabName}}
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="/xxjj">学校简介</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4">
      <el-menu text-color="#303133" background-color="#ffffff" :router=true menu-trigger="click" mode="horizontal" active-text-color="#409EFF">
        <template v-if="!user">
          <el-menu-item index="/login">
            <el-button type="text">登录</el-button>
          </el-menu-item>
          <el-menu-item index="/register">
            <el-button type="text">注册</el-button>
          </el-menu-item>
        </template>
        <template v-else>
          <el-menu-item index="/add_invitation">发帖</el-menu-item>
          <el-submenu index>
            <template slot="title">
              {{user.nickname}}
            </template>
            <el-menu-item index="/mine">我的帖子</el-menu-item>
            <el-menu-item index @click="handlePassword"><i class="el-icon-back"></i>修改密码</el-menu-item>
            <el-menu-item index @click="handleLogout"><i class="el-icon-back"></i>退出</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改密码"
      width="360px"
    >
      <el-form :form="userForm">
        <el-form-item label="新密码">
          <el-input v-model="userForm.password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer">
          <el-button type="success" @click="handleConfirm">确定</el-button>
          <el-button type="info" @click="handleCancel">取消</el-button>
        </span>
    </el-dialog>
  </el-header>


  <!--<header v-if="activeNav !== 'Login' && activeNav !== 'Register'" style="margin-bottom: 60px;">
    <router-link :to="{ name: 'Home' }">
      <span class="site-name">新帖网</span>
    </router-link>
    <el-button type="danger" class="logout" @click="handleLogout">退出</el-button>
    <router-link :to="{ name: 'Mine' }">
      <span class="username">{{user.nickname}}</span>
    </router-link>
    <nav style="margin: 20px 0;width: 100%;">
      <router-link
        :to="{ name: 'Home' }"
        :class="{ active: activeNav === 'Home' }"
        @click.native="handleEvent(null)"
        style="padding: 0 5px;"
      >
        首页
      </router-link>

      <div class="tab" v-for="(tab, index) in tabs" :key="index" style="display: inline;">
        <router-link
          :to="{ path: '/', query: {tab: tab.tabName } }"
          :class="{ active: activeNavTab === tab.tabName }"
          @click.native="handleEvent(tab.tabName)"
          style="padding: 0 5px;"
        >
          {{tab.tabName}}
        </router-link>
      </div>

      <router-link :to="{ name: 'xxjj' }" :class="{ active: activeNav === 'xxjj' }" style="padding: 0 5px;">
        学校简介
      </router-link>

      <router-link
        :to="{ name: 'AddInvitation' }"
        :class="{ active: activeNav === 'AddInvitation' }"
        style="padding: 0 5px;"
      >
        发帖
      </router-link>

      <router-link
        :to="{ name: 'Mine' }"
        :class="{ active: activeNav === 'Mine' }"
        style="padding: 0 5px;"
      >
        我的
      </router-link>
    </nav>
  </header>-->

</template>

<script>
import {listTabs, updateUser } from '@/api';

export default {
  name: 'ClientHeader',
  props: {
    activeIndex: String
  },
  data () {
    return {
      user: {},
      activeNav: 'Home',
      activeNavTab: '',
      tabs: [],
      userForm: {
        password: ''
      },
      dialogVisible: false
    }
  },
  watch: {
    '$route' () {
      this.activeNav = this.$route.name;
      this.activeNavTab = this.$route.query.tab;
    }
  },
  created () {
    this.user = JSON.parse(window.sessionStorage.getItem('user') || '{}');
    // console.log("this user name: " + this.user.username);
    this.listTabshandle();
  },
  inject: [
    'reload'
  ],
  methods: {
    handleLogout () {
      window.sessionStorage.setItem('user', '{}')
      this.$router.push({ name: 'Login' })
    },
    handlePassword() {
      this.dialogVisible = true;
      this.resetForm();
    },
    async handleConfirm() {
      this.user.password = this.userForm.password;
      await updateUser(this.user);
      this.$message({
        type: 'success',
        message: '修改密码成功'
      });
      this.dialogVisible = false;
    },
    handleCancel () {
      this.dialogVisible = false
      this.resetForm();
    },
    handleEvent(tab) {
      // console.log("导航被点击了");
      // :to="{ path: 'Home', query: {tab: '考公资料' } }"
      this.$router.push({ path: '/', query: {tab: tab}});
      this.activeNav = '';
      this.reload();
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
    resetForm () {
      this.userForm = {
        password: ''
      }
    }
  }
}
</script>

<style scoped>
  .el-header {
    z-index: 1024;
    min-width: 100%;
    box-shadow: 0 0px 1px hsla(0, 0%, 7%, .1), 0 0 0 1px hsla(0, 0%, 7%, .1);
  }

  .me-title {
    margin-top: 10px;
    font-size: 24px;
  }

  .me-header-left {
    margin-top: 10px;
  }

  .me-title img {
    max-height: 2.4rem;
    max-width: 100%;
  }

  .me-header-picture {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
