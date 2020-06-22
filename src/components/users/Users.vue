<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 渲染展示用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 定义一个作用域插槽,获取状态 -->
          <template slot-scope="slotScope">
            <el-switch v-model="slotScope.row.mg_state" @change="userStateChanged(slotScope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的区域 -->
    <el-dialog title="编辑用户" :visible.sync="showDialogVisible" width="50%">
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editForm"
        label-width="70px"
        @close="editFormClosed"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      userInfo: {
        query: '',
        // 当前显示第几页
        pagenum: 1,
        // 当前每页显示的条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      showDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机好吗', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑用户的信息
      editForm: {},
      // 修改用户的表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机好吗', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.userInfo
      })
      console.log(res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 当前页显示几条数据
    handleSizeChange(newSize) {
      console.log(newSize)
      this.userInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前是第几页
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.userInfo.pagenum = newPage
      this.getUserList()
    },
    // 更改用户状态
    async userStateChanged(userInfo) {
      console.log(userInfo)
      //   发送请求
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户信息成功')
    },
    addDialog() {
      this.addDialogVisible = true
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加用户事件
    addUsers() {
      // 先对表单进行预校验
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        // 如果校验失败直接return掉
        if (!valid) return
        // 校验成功就发送请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        // 对状态码进行判断
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        // 否则就是添加用户成功
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 点击修改按钮触发的事件
    showEditDialog(row) {
      console.log('ok')
      this.editForm = row
      console.log(row)
      this.showDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editFormClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改按钮修改用户事件
    editUser() {
      // 先对表单进行预校验
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        // 如果校验失败直接return掉
        if (!valid) return
        // 校验成功就发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        console.log(res)
        // 对状态码进行判断
        if (res.meta.status !== 200) return this.$message.error('修改用户失败')
        // 否则就是修改用户成功
        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.showDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 当点击删除按钮,删除当前的用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err) // 这里是捕获错误对象的
      // 返回的结果:如果点击的是取消按钮则返回的是cancle,如果点击的是确定按钮则返回的是confirm
      console.log(confirmResult)
      // 现在对返回结果进行判断
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消了删除用户')
      }
      // 否则就是确定删除用户
      // 发送删除用户的请求
      const { data: res } = await this.$http.delete('users/' + id)
      console.log(res)
      // 现在用删除用户的状态进行判断
      if (res.meta.status !== 200) return this.$message.error('用户删除失败')
      this.$message.success('用户删除成功')
      // 对当前的页面进行判断
      if (this.userInfo.pagenum !== 1) {
        if (this.userList.length === 1) {
          this.userInfo.pagenum -= 1
        }
      }
      // 重新获取用户列表
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
