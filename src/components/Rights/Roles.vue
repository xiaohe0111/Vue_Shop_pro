<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe width="180px">
        <!-- 展开列 -->
        <el-table-column type="expand" label="展开">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0 ?'bdtop':'','vcenter']"
            >
              <!-- 渲染一级角色列表 -->
              <el-col :span="5">
                <el-tag
                  type="success"
                  closable
                  @close="removeRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级角色列表 -->
              <el-col :span="19">
                <!-- 这个列是用for循环来渲染 -->
                <el-row
                  :class="[i2===0 ? 'bdtop' : '','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 这一列是用来渲染二级列表的 -->
                  <el-col :span="8">
                    <el-tag
                      type="danger"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 这里是用来渲染三级列表的 -->
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 展示分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        node-key="id"
        default-expand-all
        show-checkbox
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightDialogVisible: false,
      rightList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的ID权限的属性值
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      //   获取用户角色列表
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    // 电机tag标签上的删除按钮,移除当前的角色
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err) // 这里是捕获错误对象的
      console.log(confirmResult)
      // 现在对返回结果进行判断
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消了删除用户')
      }
      // 否则就是确定删除用户
      // 发送删除用户的请求
      const { data: res } = await this.$http.delete(
        'roles/' + role.id + '/rights/' + rightId
      )
      console.log(res)
      // 现在用删除用户的状态进行判断
      if (res.meta.status !== 200) return this.$message.error('用户删除失败')
      this.$message.success('用户删除成功')
      //   然后重新刷新列表
      //   this.getRolesList()
      role.children = res.data
    },
    // 点击分配权限按钮,弹出分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 发送请求,获取分配权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
      console.log(this.rightList)

      // 递归获取三级节点的Id
      // this.getLeafKeys(role, this.defkeys)
      this.rightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    // getLeafKeys(node, arr) {
    //   // 如果当前 node 节点不包含 children 属性，则是三级节点
    //   if (!node.children) {
    //     return arr.push(node.id)
    //   }
    //   node.children.forEach(item => this.getLeafKeys(item, arr))
    // },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.rightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
