<template>

  <!--<el-header v-if="activeNav !== 'Login' && activeNav !== 'Register'" class="me-area" style="height: 61px;">
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
              {{user.username}}
            </template>
            <el-menu-item index="/mine">我的帖子</el-menu-item>
            <el-menu-item index @click="handleLogout"><i class="el-icon-back"></i>退出</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
    </el-row>
  </el-header>-->


  <header v-if="activeNav !== 'Login' && activeNav !== 'Register'" style="margin-bottom: 60px;">
    <router-link :to="{ name: 'Home' }">
      <span class="site-name">新帖网</span>
    </router-link>
    <el-button type="danger" class="logout" @click="handleLogout">退出</el-button>
    <router-link :to="{ name: 'Mine' }">
      <span class="username">{{user.username}}</span>
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
  </header>

</template>

<script>
import {listTabs } from '@/api';

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
      tabs: []
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
    }
  }
}
</script>

<style scoped>
  header {
    width: 1100px;
    height: 50px;
    padding: 5px 20px;
    box-sizing: border-box;
    line-height: 40px;
    margin: 10px auto;
    border-radius: 5px;
    background-color: whitesmoke;
    font-size: 16px;
  }
  a {
    text-decoration: none;
  }
  header .site-name {
    color: #409EFF;
    font-size: 20px;
  }
  header nav {
    display: inline-block;
    width: 40%;
    margin-left: 30%;
  }
  header nav a {
    display: inline-block;
    padding: 0 30px;
    font-size: 18px;
    margin: 0 10px;
  }
  header nav a:hover {
    background-color: aquamarine;
  }
  header nav a.active {
    background-color: aqua;
  }
  header .logout {
    float: right;
    position: relative;
    top: 4px;
  }
  header .username {
    color: #F56C6C;
    font-size: 20px;
    float: right;
    margin-right: 20px;
    cursor: pointer;
  }
</style>
