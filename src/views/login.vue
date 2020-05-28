<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="80px" class="login-form" label-position="top">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="handleLogin">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      this.$http.post('login', this.form)
        .then((res) => {
          const data = res.data;
          if (data.meta.status === 200) {
            // 登录成功
            // 跳转
            // 提示
            // 保存token
            sessionStorage.setItem('token', data.data.token);
            this.$message.success(data.meta.msg);
          } else {
            // 登录失败
            this.$message.error(data.meta.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.login {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
}
.login-btn {
  width: 100%;
}
</style>
