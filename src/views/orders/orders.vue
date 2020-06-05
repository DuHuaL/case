<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      class="table"
      border
      stripe
      height="540"
      style="width: 100%">
      <el-table-column
        label="#"
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="300">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="100">
      </el-table-column>
      <el-table-column
        label="是否付款"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.pay_status ==='0'" type="danger">未付款</el-tag>
          <el-tag v-else type="success">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="180">
      </el-table-column>
      <el-table-column
        label="下单时间"
        width="300">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="handleShowDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 编辑弹框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form label-width="100px">
        <el-form-item label="省市区/县" >
          <el-cascader
            style="width: 500px"
            v-model="selectedOptions"
            :options="options"
            :props="{ expandTrigger: 'hover', label: 'label', value: 'value' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetAddress">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入数据模块
import data from './city_data2017_element.js';
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pagesize: 10,
      pagenum: 1,
      dialogFormVisible: false,
      selectedOptions: [],
      options: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const { data: { data, meta } } = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      if (meta.status === 200) {
        this.tableData = data.goods;
        this.total = data.total;
      }
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
    // 修改弹框
    handleShowDialog(row) {
      this.dialogFormVisible = true;
      this.options = data;
    },
    handleSetAddress() {}
  }
};
</script>

<style>
.table {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
