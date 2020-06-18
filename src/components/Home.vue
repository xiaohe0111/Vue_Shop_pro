<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    logout() {
      //   实现退出登录,要情况sessionstorage里面的token值
      window.sessionStorage.clear();
      // 将页面重定向到登录页面
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped></style>
