<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false"
    class="alert">
  </el-alert>
  <el-steps :active="active - 0" finish-status="success" align-center >
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
  </el-steps>
  <el-form :model="form" label-width="100px" label-position="top" style="height:500px;overflow: auto">
    <el-tabs tabPosition="left" class="tabs" v-model="active">
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            :props="defaultProps"
            clearable
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
    </el-tabs>
  </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: '0',
      form: {},
      // 层级下拉框的数据源
      options: [],
      // 层级下拉框的数据配置
      defaultProps: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 选中的分类id
      selectedOptions: []
    };
  },
  created() {
    this.loadOptions();
  },
  methods: {
    // 层级下拉框发生变化时，调用
    handleChange() {
      // 判断当前选择的是不是三级分类
      // 如果不是提示，并清空
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请选择三级分类');
        this.selectedOptions = [];
      }
    },
    // 加载层级下拉框的数据
    async loadOptions() {
      const { data } = await this.$http.get('categories?type=3');
      this.options = data.data;
    }
  }
};
</script>

<style scoped>
.alert {
  margin-top: 15px;
  margin-bottom: 15px;
}
.tabs {
  margin-top: 15px;
}
.el-card {
  box-sizing: border-box;
}
</style>
