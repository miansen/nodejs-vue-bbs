<template>
  <div class="invitations">
    <div class="container">
      <el-table
        v-loading="listLoading"
        :data="invitations"
        stripe
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" align="center" width="70" />
        <el-table-column prop="isTop" label="是否置顶" align="center" width="150">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isTop"
              active-color="#13ce66"
              active-text="置顶"
              inactive-text="取消"
              @change="handleToggleTop(scope.row)"
            >
              {{ scope.row.isTop ? '是' : '否' }}
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" min-width="100" />
        <el-table-column prop="username" label="发布者姓名" align="center" width="100" />
        <el-table-column prop="content" label="内容" align="center" min-width="150" :show-overflow-tooltip="true" />
        <el-table-column prop="date" label="发布时间" align="center" min-width="120">
          <template #default="scope">
            {{ new Date(scope.row.date).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
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
        title="编辑帖子"
        width="360px"
      >
        <el-form :form="invitationForm">
          <el-form-item label="标题">
            <el-input v-model="invitationForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="invitationForm.content" placeholder="请输入内容" />
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
import { toggleTop, updateInvitation, searchInvitations, deleteInvitation } from '@/api'

export default {
  data () {
    return {
      listLoading: false,
      invitations: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      invitationForm: {
        title: '',
        content: ''
      },
      dialogVisible: false
    }
  },
  created () {
    this.handleSearch()
  },
  methods: {
    async handleSearch () {
      const res = await searchInvitations({
        ...this.listQuery
      })
      this.invitations = res.data.data
      this.total = res.data.total
    },
    handleEdit (index, row) {
      this.resetForm()
      Object.assign(this.invitationForm, row)
      this.dialogVisible = true
    },
    async handleDelete (index, row) {
      await deleteInvitation(row.id)
      this.$message({
        type: 'success',
        message: '删除帖子成功',
        showClose: true
      })
      this.handleSearch()
    },
    async handleConfirm () {
      const { title, content } = this.invitationForm
      let message = ''
      if (!title.trim()) {
        message = '请填写标题'
      } else if (!content.trim()) {
        message = '请填写内容'
      }
      if (message) {
        this.$message({
          type: 'warning',
          message,
          showClose: true
        })
        return
      }
      await updateInvitation(this.invitationForm)
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '编辑帖子成功',
        showClose: true
      })
      this.resetForm()
      this.handleSearch()
    },
    async handleToggleTop (row) {
      await toggleTop(row.id)
      this.$message({
        type: 'success',
        message: `${row.isTop ? '置顶' : '取消置顶'}成功`,
        showClose: true
      })
    },
    handleCancel () {
      this.dialogVisible = false
      this.resetForm()
    },
    resetForm () {
      this.invitationForm = {
        title: '',
        content: ''
      }
    }
  }
}
</script>

<style>
.invitations {
  width: 100%;
}
.invitations .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.invitations .el-table {
  margin: 20px 0;
}
.invitations textarea {
  height: 100px;
  resize: none;
}
</style>
