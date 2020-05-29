<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="../assets/logo.png" alt="">
        </el-col>
        <el-col :span="16">
          <div class="title">电商后台管理系统</div>
        </el-col>
        <el-col :span="4">
          <a href="#" class="logout" @click.prevent="handleLogout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="1-1"
          class="menu"
          :router="true"
          background-color="#545c64"
          text-color="#fff"
          :unique-opened="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              数据列表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
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
  },
  methods: {
    handleLogout() {
      // 删除token
      sessionStorage.removeItem('token');
      // 跳转到登录页面
      this.$router.push({ name: 'login' });
      this.$message.success('退出成功');
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
  padding: 0 10px;
}
.header .title {
  line-height: 60px;
  font-size: 24px;
  color: #fff;
  text-align: center;
}
.header .logout {
  position: absolute;
  right: 10px;
  color: orange;
  text-decoration: none;
  line-height: 60px;
  font-size: 18px;
}
.aside {
  background-color: #d3dce6;
}
.menu {
  height: 100%;
}
.main {
  background-color: #e9eef3;
  height: 100%;
  box-sizing: border-box
}
</style>
