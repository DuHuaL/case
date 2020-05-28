<template>
  <el-container class="container">
    <el-header class="header">Header</el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    var token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转到登录页面
      this.$router.push({ name: 'login' });
      // 提示
      this.$message.warning('请先登录');
    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
  height: 100%;
}
</style>
