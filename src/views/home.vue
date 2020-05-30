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
          :unique-opened="true">
          <el-submenu
            v-for="item1 in menus"
            :key="item1.id"
            :index="item1.id + ''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
              v-for="item2 in item1.children"
              :key="item2.id"
              :index="item2.path">
              <i class="el-icon-menu"></i>
              {{ item2.authName }}
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
  data() {
    return {
      menus: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 退出
    handleLogout() {
      // 删除token
      sessionStorage.removeItem('token');
      // 跳转到登录页面
      this.$router.push({ name: 'login' });
      this.$message.success('退出成功');
    },
    // 动态渲染菜单栏
    async loadData() {
      const { data } = await this.$http.get('menus');
      this.menus = data.data;
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
