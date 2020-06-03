<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="searchKey" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">
        <el-button type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
      :data="tableData"
      height="490"
      border
      stripe
      style="width: 100%">
      <el-table-column
        label="#"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="120">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="100">
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="200">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini">
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="handleDelete(scope.row.goods_id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      class="page"
      :page-sizes="[8, 12, 16, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      searchKey: '',
      total: 0,
      pagenum: 1,
      pagesize: 8
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data } = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchKey}`);
      if (data.meta.status === 200) {
        this.total = data.data.total;
        this.tableData = data.data.goods;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    // 删除商品
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data } = await this.$http.delete(`goods/${id}`);
        if (data.meta.status === 200) {
          this.$message.success(data.meta.msg);
          this.loadData();
        } else {
          this.$message.error(data.meta.msg);
        }
      });
    },
    // 查询
    handleSearch() {
      this.pagenum = 1;
      this.loadData();
    }
  }
};
</script>

<style scoped>
.search {
  margin-top: 15px;
  margin-bottom: 15px;
}
.page {
  margin-top: 5px;
}
</style>
