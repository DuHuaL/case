import { defaults } from 'autoprefixer';
<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类 "></my-breadcrumb>
    <!-- 添加 -->
    <el-row>
      <el-col :span="24">
        <el-button type="success" plain class="btn" @click="handleShowAddDialog">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      border
      stripe
      height="480"
      :data="tableData"
      style="width: 100%"
      class="tb">
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        width="280"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="30"
        >
      </el-table-tree-column>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="handleOpenEditDialog(scope.row)">
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="handleDelete(scope.row.cat_id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogFormAddCategoryVisible">
      <el-form
        :model="addForm"
        label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-cascader
            clearable
            placeholder="默认添加一级分类"
            v-model="selectedOptions"
            :options="options"
            :props="defaultsProps">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog title="修改商品分类" :visible.sync="dialogFormEditCategoryVisible">
      <el-form
        :model="addForm"
        label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormEditCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      dialogFormAddCategoryVisible: false,
      addForm: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0
      },
      // 层级下拉框中的数据
      options: [],
      // 层级下拉框的配置
      defaultsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 下拉框里选中的id
      selectedOptions: [],
      // 修改的对话框
      dialogFormEditCategoryVisible: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const { data } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      this.tableData = data.data.result;
      this.total = data.data.total;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    async handleShowAddDialog() {
      this.dialogFormAddCategoryVisible = true;
      // 加载层级数据
      const { data } = await this.$http.get('categories?type=2');
      this.options = data.data;
    },
    // 添加分类
    async handleAdd() {
      // cat_pid的取值
      // 如果级联下拉框没有选择cat_pid为0
      // 如果级联下拉框选择了一级 cat_pid = selectedOptions[0]
      // 如果级联下拉框选择了二级 cat_pid = selectedOption[1]
      if (this.selectedOptions.length === 0) {
        this.addForm.cat_pid = 0;
        // this.addForm.cat_level = 0;
      } else if (this.selectedOptions.length === 1) {
        this.addForm.cat_pid = this.selectedOptions[0];
        // this.addForm.cat_level = 1;
      } else if (this.selectedOptions.length === 2) {
        this.addForm.cat_pid = this.selectedOptions[1];
        // this.addForm.cat_level = 2;
      }
      this.addForm.cat_level = this.selectedOptions.length;
      // 发送请求，添加数据
      const { data } = await this.$http.post('categories', this.addForm);
      if (data.meta.status === 201) {
        this.$message.success(data.meta.msg);
        this.loadData();
        this.addForm = {};
        this.dialogFormAddCategoryVisible = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 删除分类
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除数据
        const { data } = await this.$http.delete(`categories/${id}`);
        if (data.meta.status === 200) {
          this.$message.success(data.meta.msg);
          this.pagenum = 1;
          this.loadData();
        } else {
          this.$message.error(data.meta.msg);
        }
      });
    },
    // 打开修改的对话框
    handleOpenEditDialog(cat) {
      this.dialogFormEditCategoryVisible = true;
      this.addForm.cat_name = cat.cat_name;
      this.addForm.cat_id = cat.cat_id;
    },
    // 修改分类提交
    async handleEdit() {
      const { data } = await this.$http.put(`categories/${this.addForm.cat_id}`, {
        cat_name: this.addForm.cat_name
      });
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg);
        this.loadData();
        this.dialogFormEditCategoryVisible = false;
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
.tb {
  margin-bottom: 10px;
}
</style>
