<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      class="alert"
      show-icon>
    </el-alert>
    <!-- 下拉框 -->
    <el-row>
      <el-col :span="24">
        请选择商品分类：
        <el-cascader
          v-model="selectedOptions"
          :options="options"
          :props="{ label: 'cat_name', value: 'cat_id', expandTrigger: 'hover' }"
          @change="handleChange"
          :show-all-levels="false"
          clearable>
        </el-cascader>
      </el-col>
    </el-row>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isDisabled">添加动态参数</el-button>
        <!-- 表格 -->
        <el-table
          border
          stripe
          :data="dynamicParams"
          style="width: 100%">
          <el-table-column
            type="expand">
            <template slot-scope="scope">
              <el-tag
                closable
                v-for="(item,index) in scope.row.params"
                :key="index"
                :disable-transitions="false"
                @close="handleClose(scope.row, index)">
                {{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            label="#"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" size="mini" :disabled="isDisabled">添加静态参数</el-button>
        <el-table
          :data="staticParams"
          height="400"
          style="width: 100%">
          <el-table-column
            type="index"
            label="#"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
            width="300">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      options: [],
      selectedOptions: [],
      activeName: 'many',
      dynamicParams: [],
      staticParams: [],
      isDisabled: true,
      inputVisible: false,
      inputValue: ''

    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    async loadOptions() {
      const { data: { data, meta } } = await this.$http.get('categories?type=3');
      if (meta.status === 200) {
        this.options = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 级联下拉改变触发
    handleChange() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
        this.loadTableData();
      }
    },
    // 加载表格数据
    async loadTableData() {
      if (this.selectedOptions.length !== 3) {
        this.$message.error('请选择三级分类');
        return;
      }
      const { data: { data, meta } } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`);
      if (meta.status === 200) {
        if (this.activeName === 'many') {
          this.dynamicParams = data;
          // 在动态参数对象上增加一个属性，记录数组 params
          // console.log(this.dynamicParams);
          this.dynamicParams.forEach((item) => {
            const arr = item.attr_vals.trim().split(',').length === 0 ? [] : item.attr_vals.trim().split(',');
            // 动态的给对象增加成员，数据绑定的时候会出问题
            this.$set(item, 'params', arr);
          });
        } else {
          this.staticParams = data;
        }
      }
    },
    // 点击标签的删除按钮
    async handleClose(row, index) {
      row.params.splice(index, 1);
      // 准备url上的id
      const catId = row.cat_id;
      const attrId = row.attr_id;
      // 需要传的数据
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      // 让数据一致
      row.attr_vals = putData.attr_vals;
      // 发送请求
      const { data } = await this.$http.put(`categories/${catId}/attributes/${attrId}`, putData);
      console.log(data);
    },
    // 添加
    async handleInputConfirm(row) {
      if (this.inputValue === 0) {
        return;
      }
      row.params.push(this.inputValue);
      // 清空文本框，显示按钮
      this.inputValue = '';
      this.inputVisible = false;
      // 准备数据
      const catId = row.cat_id;
      const attrId = row.attr_id;
      const putData = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.params.join(',')
      };
      // 让数据一致
      row.attr_vals = putData.attr_vals;
      // 发送请求
      const { data } = await this.$http.put(`categories/${catId}/attributes/${attrId}`, putData);
      console.log(data);
      // 发送请求
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击tab栏的时候执行
    handleTabClick() {
      this.loadTableData();
    }
  }
};
</script>

<style scoped>
.alert {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
