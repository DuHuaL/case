import { sort } from 'semver';
<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchContainer">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-input placeholder="请输入内容" class="searchInput" clearable v-model="searchKey">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
          <el-button type="success" plain @click="dialogFormAddVisible = true">添加用户</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border="" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">{{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <!-- 获取的是当前行的索引 -->
          <!-- {{scope.$index}} -->
          <!-- 显示的是当前行的数据 -->
          <!-- {{scope.row}} -->
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain
            @click="handleEditPage(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain
            @click="handleDelete(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-check"
            plain
            @click="handleOpenSetRoleDialog(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormAddVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="dialogFormEditVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormSetRoleVisible">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          {{ selectedUser.username}}
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="selectedUser.rid">
            <el-option :value="-1" label="请选择"></el-option>
            <el-option
              v-for="option in options"
              :key="option.id"
              :label="option.roleName"
              :value="option.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormSetRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      searchKey: '',
      tableData: [],
      total: 0,
      pageSize: 4,
      pageNum: 1,
      // 添加用户弹框
      dialogFormAddVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '100px',
      // 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '长度在 6 到 8 个字符', trigger: 'blur' }
        ]
      },
      // 编辑用户弹框
      dialogFormEditVisible: false,
      selectedUser: {
        username: '',
        rid: -1
      },
      // 分配权限的对话框
      dialogFormSetRoleVisible: false,
      // 存储所有角色
      options: []
    };
  },
  created() {
    // 获取数据列表
    this.loadData();
  },
  methods: {
    async loadData() {
      // 获取登录以后的token
      const token = sessionStorage.getItem('token');
      // axios发送请求的时候需要token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(
        `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}&query=${
          this.searchKey
        }`
      );
      const data = res.data;
      if (data.meta.status === 200) {
        this.tableData = data.data.users;
        this.total = data.data.total;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 分页
    handleSizeChange(val) {
      // 当页面每页展示多少条时执行
      this.pageSize = val;
      this.pageNum = 1;
      this.loadData();
    },
    // 当页码发生变化的时候执行
    handleCurrentChange(val) {
      // 页码发生变化，重新获取数据列表
      this.pageNum = val;
      this.loadData();
    },
    // 搜索框
    handleSearch() {
      // 让页码为1
      this.pageNum = 1;
      this.loadData();
    },
    // 开关状态改变的时候执行
    async handleChange(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
      } else {
        this.$$message.error(data.meta.msg);
      }
    },
    // 添加用户
    async handleAdd() {
      const res = await this.$http.post('users', this.form);
      const data = res.data;
      if (data.meta.status === 201) {
        this.loadData();
        this.dialogFormAddVisible = false;
        this.form = {};
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 删除用户
    async handleDelete(id) {
      this.$confirm('确认要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await this.$http.delete(`users/${id}`);
          const data = res.data;
          if (data.meta.status === 200) {
            this.$message.success(data.meta.msg);
            this.pageNum = 1;
            // 刷新列表
            this.loadData();
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    // 打开编辑页面
    handleEditPage(user) {
      this.dialogFormEditVisible = true;
      this.editId = user.id;
      this.form = user;
    },
    // 编辑提交
    async handleEdit() {
      const res = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
        this.loadData();
        this.dialogFormEditVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 打开分配权限的对话框
    async handleOpenSetRoleDialog(user) {
      this.dialogFormSetRoleVisible = true;
      this.selectedUser.id = user.id;
      this.selectedUser.username = user.username;
      // 发送请求获取所有角色
      const { data } = await this.$http.get('roles');
      this.options = data.data;
      // 根据用户的id请求用户对象，目的获取角色id
      const { data: data1 } = await this.$http.get(`users/${user.id}`);
      this.selectedUser.rid = data1.data.rid;
    },
    // 分配权限
    async handleSetRole() {
      const { data } = await this.$http.put(`users/${this.selectedUser.id}/role`, {
        rid: this.selectedUser.rid
      });
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
        this.dialogFormSetRoleVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  width: 100%;
  height: 100%;
}
.searchContainer {
  margin-top: 15px;
  margin-bottom: 15px;
}
.searchInput {
  width: 300px;
}
</style>
