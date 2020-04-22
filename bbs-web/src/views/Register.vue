<template>
  <div class="register">
    <el-form :model="registerForm" label-width="80px" label-position="left">
      <el-form-item label="用户名">
        <el-input
          v-model.trim="registerForm.username"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model.trim="registerForm.password"
          type="password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input
          v-model.trim="registerForm.confirmPassword"
          type="password"
          placeholder="请确认密码"
          @keyup.enter.native="handleRegister"
        />
      </el-form-item>
      <el-button type="primary" @click="handleRegister">注册</el-button>
      <div class="form-footer">
        <router-link :to="{ name: 'Login' }">登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api'

export default {
  data () {
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  created () {
    document.title = '注册'
  },
  methods: {
    handleRegister () {
      const { username, password, confirmPassword } = this.registerForm
      let message = ''
      if (!username) {
        message = '请输入用户名'
      } else if (!password) {
        message = '请输入密码'
      } else if (!confirmPassword) {
        message = '请再次输入密码'
      } else if (password !== confirmPassword) {
        message = '两次密码输入不一致'
      }
      if (message) {
        this.$message({
          type: 'warning',
          message
        })
        return
      }
      register(this.registerForm).then(res => {
        if (res.data.error) {
          this.$message({
            type: 'error',
            message: res.data.error,
            showClose: true
          })
        } else {
          this.$message({
            type: 'success',
            message: '注册成功',
            showClose: true
          })
          setTimeout(() => {
            this.$router.push({ name: 'Login' })
          }, 2000)
        }
      })
    }
  }
}
</script>

<style>
.register {
  background-color: cornflowerblue;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register .el-form {
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
.register .el-form-item {
  margin: 30px 0;
}
.register .el-form-item__label {
  font-size: 16px;
}
.register .el-button {
  width: 100%;
  font-size: 16px;
  border-radius: 5px;
  margin: 10px 0;
}
.register .form-footer {
  text-align: right;
  font-size: 16px;
  margin: 5px 0;
}
</style>
