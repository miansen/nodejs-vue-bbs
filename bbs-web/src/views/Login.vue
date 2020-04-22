<template>
  <div class="login">
    <el-form :model="loginForm" label-width="80px" label-position="left">
      <el-form-item label="用户名">
        <el-input
          v-model.trim="loginForm.username"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model.trim="loginForm.password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-button type="primary" @click="handleLogin">登录</el-button>
      <div class="form-footer">
        <router-link :to="{ name: 'Register' }">注册</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api'

import bus from '@/bus'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  created () {
    document.title = '登录'
  },
  methods: {
    handleLogin () {
      const { username, password } = this.loginForm
      let message = ''
      if (!username) {
        message = '请输入用户名'
      } else if (!password) {
        message = '请输入密码'
      }
      if (message) {
        this.$message({
          type: 'warning',
          message
        })
        return
      }
      login(this.loginForm).then(res => {
        if (res.data.error) {
          this.$message({
            type: 'error',
            message: res.data.error,
            showClose: true
          })
        } else {
          this.$message({
            type: 'success',
            message: '登录成功',
            showClose: true
          })
          setTimeout(() => {
            const isClient = res.data.data.role !== 'admin'
            this.$router.push({ name: isClient ? 'Home' : 'Users' })
            window.sessionStorage.setItem('user', JSON.stringify(res.data.data))
            window.sessionStorage.setItem('isClient', isClient)
            bus.$emit('login')
          }, 1000)
        }
      })
    }
  }
}
</script>

<style>
.login {
  background-color: cornflowerblue;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login .el-form {
  width: 360px;
  margin: auto;
  color: white;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-sizing: border-box;
  position: relative;
  top: -10%;
  text-align: center;
}
.login .el-form-item {
  margin: 30px 0;
}
.login .el-form-item__label {
  font-size: 16px;
}
.login .el-button {
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  margin: 10px 0;
}
.login .form-footer {
  text-align: right;
  font-size: 16px;
  margin: 5px 0;
}
</style>
