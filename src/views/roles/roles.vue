<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-button class="btn" @click="dialogFormAddVisible = true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      height="500"
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="level1"
            v-for="item in scope.row.children"
            :key="item.id">
            <el-col :span="4">
              <el-tag closable @close="handleClose(scope.row, item)">
                <!-- 显示一级权限 -->
                {{ item.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 显示二,三级级权限 -->
              <el-row
                v-for="item1 in item.children"
                :key="item1.id"
              >
                <!-- 显示二级 -->
                <el-col :span="4">
                  <el-tag closable type="success" @close="handleClose(scope.row, item1)">
                    {{ item1.authName }}
                  </el-tag>
                </el-col>
                <!-- 显示三级 -->
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    class="level3"
                    v-for="item2 in item1.children"
                    :key="item2.id"
                    @close="handleClose(scope.row, item2)"
                  >
                    {{ item2.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果当前角色没有内容 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              当前角色没有权限
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            @click="openEditPage(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            @click="handleDelete(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            @click="handleShowSetRightsDialog(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的弹框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormAddVisible">
      <el-form :model="addUserForm" label-width="100px">
        <el-form-item label="角色名称" required>
          <el-input v-model="addUserForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" required>
          <el-input v-model="addUserForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色的弹框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormEditVisible">
      <el-form :model="addUserForm" label-width="100px">
        <el-form-item label="角色名称" required>
          <el-input v-model="addUserForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" required>
          <el-input v-model="addUserForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="权限分配" :visible.sync="dialogSetRightEditVisible">
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkedKeys">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetRightEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormAddVisible: false,
      addUserForm: {
        roleName: '',
        roleDesc: ''
      },
      dialogFormEditVisible: false,
      dialogSetRightEditVisible: false,
      // 树形控件
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // tree默认选中的节点的id
      checkedKeys: [],
      // 当前角色的id
      currentRoleId: -1

    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 获取列表数据
    async loadData() {
      const { data } = await this.$http.get('roles');
      if (data.meta.status === 200) {
        this.tableData = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 添加角色
    async handleAddRole() {
      const { data } = await this.$http.post('roles', this.addUserForm);
      if (data.meta.status === 201) {
        // 提示
        this.$message.success(data.meta.msg);
        // 刷新列表
        this.loadData();
        // 关闭弹框
        this.dialogFormAddVisible = false;
        // 清空输入框
        this.addUserForm = {};
      } else {
        this.$$message.error(data.meta.msg);
      }
    },
    // 删除角色
    handleDelete(id) {
      this.$confirm('您确定删除此条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data } = await this.$http.delete(`roles/${id}`);
          if (data.meta.status === 200) {
            this.$message.success(data.meta.msg);
            this.loadData();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 打开编辑页面
    openEditPage(user) {
      this.dialogFormEditVisible = true;
      this.addUserForm = user;
    },
    // 编辑角色
    async handleEditRole() {
      const { data } = await this.$http.put(`roles/${this.addUserForm.id}`, this.addUserForm);
      if (data.meta.status === 200) {
        this.dialogFormEditVisible = false;
        this.loadData();
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 关闭左侧expand中的权限
    async handleClose(role, rights) {
      const { data: resData } = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      const { data, meta } = resData;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        // 重新绑定当前角色下的所有权限
        role.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 树属性的列表数据
    async handleShowSetRightsDialog(role) {
      // 保存当前角色的id，后面分配权限的时候室使用
      this.currentRoleId = role.id;
      this.dialogSetRightEditVisible = true;
      const { data: resData } = await this.$http.get('rights/tree');
      const { data } = resData;
      this.treeData = data;
      //  /// 第一种写法////////////////
      // 递归的写法
      // const arr = [];
      // function fn(children) {
      //   children.forEach((item) => {
      //     arr.push(item.id);
      //     // 递归调用
      //     if (item.children) {
      //       fn(item.children);
      //     }
      //   });
      // }

      // fn(role.children);
      // this.checkedKeys = arr;

      /// 第二种写法//////////////
      // 获取当前角色的所有权限
      // role.children
      // 权限id,存储到checkedKeys中
      //   var arr = [];
      //   role.children.forEach((item1) => {
      //     // item1 一级权限
      //     arr.push(item1.id);

      //     // 遍历二级权限
      //     item1.children.forEach((item2) => {
      //       arr.push(item2.id);

      // 遍历三级权限
      //       item2.children.forEach((item3) => {
      //         arr.push(item2.id);
      //       });
      //     });
      //   });
      //   this.checkedKeys = arr;

      //  第三种写法
      function getCheckedKeys(children) {
        const arr = [];
        (function fn(list) {
          list.forEach((item) => {
            arr.push(item.id);
            if (item.children) {
              fn(item.children);
            }
          });
        })(children);
        return arr;
      }
      this.checkedKeys = getCheckedKeys(role.children);
    },
    // 设置当前角色的权限 roleId, rightsIds
    async handleSetRights() {
      // this.currentRoleId在打开分配权限的树时已获取

      // 调用tree内部封装的方法
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const rightsIds = arr1.concat(arr2).join(',');
      const { data } = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: rightsIds
      });
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
        this.dialogSetRightEditVisible = false;
        this.loadData();
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
.btn {
  margin-top: 15px;
  margin-bottom: 15px;
}
.level1 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
