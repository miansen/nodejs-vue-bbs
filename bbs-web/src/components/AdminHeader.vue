<template>
  <header v-if="activeNav !== 'Login' && activeNav !== 'Register'">
    <router-link :to="{ name: 'Home' }">
      <span class="site-name">新帖网</span>
    </router-link>
    <nav>
      <router-link :to="{ name: 'Home' }" :class="{ active: activeNav === 'Home' }">
        首页
      </router-link>

      <router-link :to="{ name: 'Users' }" :class="{ active: activeNav === 'Users' }">
        用户管理
      </router-link>

      <router-link :to="{ name: 'Invitations' }" :class="{ active: activeNav === 'Invitations' }">
        帖子管理
      </router-link>

      <router-link :to="{ name: 'tabs' }" :class="{ active: activeNav === 'tabs' }">
        板块管理
      </router-link>
      <router-link :to="{ name: 'xxjj' }" :class="{ active: activeNav === 'xxjj' }">
        学校简介管理
      </router-link>
    </nav>
    <el-button type="danger" class="logout" @click="handleLogout">退出</el-button>
    <router-link :to="{ name: 'Mine' }">
      <span class="username">{{ user && user.nickname }}</span>
    </router-link>
  </header>
</template>

<script>
export default {
  name: 'AdminHeader',
  data () {
    return {
      user: {},
      activeNav: 'Home'
    }
  },
  watch: {
    '$route' () {
      this.activeNav = this.$route.name
    }
  },
  created () {
    this.user = JSON.parse(window.sessionStorage.getItem('user') || '{}')
  },
  methods: {
    handleLogout () {
      window.sessionStorage.setItem('user', '{}')
      this.$router.push({ name: 'Login' })
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
  /*margin-left: 25%;*/
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
