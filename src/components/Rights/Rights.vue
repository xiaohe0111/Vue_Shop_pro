<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightList: []
    }
  },
  created() {
    //   当页面加载完后展示数据到页面
    this.getRightList()
  },
  methods: {
    async getRightList() {
      //   发送请求获取权限列表
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.$message.success('获取权限列表成功')
      this.rightList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
