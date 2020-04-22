<template>
  <div class="users">
    <div class="container">
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-circle-plus-outline" />
        添加用户
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="users"
        stripe
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="username" label="用户名" align="center" />
        <el-table-column prop="password" label="密码" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <span class="operations">
              <el-button type="success" @click="handleEdit(scope.$index, scope.row)">
                <i class="el-icon-edit-outline" />
                编辑
              </el-button>
              <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">
                <i class="el-icon-delete" />
                删除
              </el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog
        :visible.sync="dialogVisible"
        :title="isEditing ? '编辑用户' : '新增用户'"
        width="360px"
      >
        <el-form :form="userForm">
          <el-form-item v-show="!isEditing" label="用户名">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userForm.password" placeholder="请输入密码" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="success" @click="handleConfirm">确定</el-button>
          <el-button type="info" @click="handleCancel">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addUser, updateUser, searchUsers, deleteUser } from '@/api'

export default {
  data () {
    return {
      listLoading: false,
      users: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      userForm: {
        username: '',
        password: ''
      },
      dialogVisible: false,
      isEditing: false
    }
  },
  created () {
    document.title = '用户管理'
    this.handleSearch()
  },
  methods: {
    async handleSearch () {
      this.listLoading = true
      const res = await searchUsers({
        ...this.listQuery
      })
      this.users = res.data.data
      this.total = res.data.total
      this.listLoading = false
    },
    handleAdd () {
      this.isEditing = false
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit (index, row) {
      this.isEditing = true
      this.resetForm()
      Object.assign(this.userForm, row)
      this.dialogVisible = true
    },
    async handleDelete (index, row) {
      await deleteUser(row.username)
      this.$message({
        type: 'success',
        message: '删除用户成功',
        showClose: true
      })
      this.handleSearch()
    },
    async handleConfirm () {
      const { username, password } = this.userForm
      let message = ''
      if (!username.trim()) {
        message = '请填写用户名'
      } else if (!password.trim()) {
        message = '请填写密码'
      }
      if (message) {
        this.$message({
          type: 'warning',
          message,
          showClose: true
        })
        return
      }
      if (this.isEditing) {
        await updateUser(this.userForm)
      } else {
        await addUser(this.userForm)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: `${this.isEditing ? '编辑' : '添加'}用户成功`,
        showClose: true
      })
      this.resetForm()
      this.handleSearch()
    },
    handleCancel () {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm () {
      this.userForm = {
        username: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
.users {
  width: 100%;
}
.users .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.users .el-table {
  margin: 20px 0;
}
</style>
