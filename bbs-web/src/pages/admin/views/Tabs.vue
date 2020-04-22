<template>
  <div class="tabs">
    <div class="container">
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-circle-plus-outline" />
        添加板块
      </el-button>
      <el-table
        v-loading="listLoading"
        :data="tabs"
        stripe
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="id" label="ID" align="center" width="70" />
        <el-table-column prop="tabName" label="板块名" align="center" />
        <el-table-column prop="tabDesc" label="板块描述" align="center" />
        <el-table-column prop="createDate" label="创建时间" align="center" >
          <template #default="scope">
            {{ new Date(scope.row.createDate).toLocaleString() }}
          </template>
        </el-table-column>
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
        :title="isEditing ? '编辑板块' : '新增板块'"
        width="360px"
      >
        <el-form :form="tabForm">
          <el-form-item label="板块名">
            <el-input v-model="tabForm.tabName" placeholder="请输入板块描述" />
          </el-form-item>
          <el-form-item label="板块描述">
            <el-input v-model="tabForm.tabDesc" placeholder="请输入板块描述" />
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
import { addTab, updateTab, listTabs, deleteTab } from '@/api'

export default {
  data () {
    return {
      listLoading: false,
      tabs: [],
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      tabForm: {
        id: '',
        tabName: '',
        tabDesc: '',
        createDate: ''
      },
      dialogVisible: false,
      isEditing: false,
      user: {}
    }
  },
  created () {
    document.title = '板块管理';
    this.handleSearch();
  },
  methods: {
    async handleSearch () {
      this.listLoading = true
      const res = await listTabs({
        ...this.listQuery
      })
      this.tabs = res.data.data
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
      Object.assign(this.tabForm, row)
      this.dialogVisible = true
    },
    async handleDelete (index, row) {
      await deleteTab(row.id);
      this.$message({
        type: 'success',
        message: '删除板块成功',
        showClose: true
      })
      this.handleSearch();
    },
    async handleConfirm () {
      const { tabName } = this.tabForm;
      let message = '';
      if (!tabName.trim()) {
        message = '请填写板块名';
      }
      if (message) {
        this.$message({
          type: 'warning',
          message,
          showClose: true
        })
        return;
      }
      if (this.isEditing) {
        await updateTab(this.tabForm)
      } else {
        this.tabForm.createDate = new Date();
        await addTab(this.tabForm)
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: `${this.isEditing ? '编辑' : '添加'}板块成功`,
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
      this.tabForm = {
        id: '',
        tabName: '',
        tabDesc: '',
        createDate: ''
      }
    }
  }
}
</script>

<style scoped>
.tabs {
  width: 100%;
}
.tabs .container {
  width: 1100px;
  margin: auto;
  padding: 20px 0;
}
.tabs .el-table {
  margin: 20px 0;
}
</style>
