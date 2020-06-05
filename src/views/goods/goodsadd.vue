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
    <el-form :model="form" label-width="100px" label-position="top" style="height:470px;overflow: auto" size="mini">
      <el-tabs tabPosition="left" class="tabs" v-model="active" @tab-click="handleTabClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
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
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            v-for="item in dynamicsParams"
            :key="item.attr_id"
            :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                v-for="val in item.attr_vals"
                :key="val"
                :label="val">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- action注意 -->
          <!-- 1. 必须是全部路径
          2. 必须设置token -->
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :headers="tokenHeader"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-row>
            <el-col :span="24">
              <el-button type="success" @click="handleAdd">添加商品</el-button>
            </el-col>
          </el-row>
          <quillEditor v-model="form.goods_introduce" class="editor"></quillEditor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
// style
import 'quill/dist/quill.core.css';// import styles
import 'quill/dist/quill.snow.css';// for snow theme
import 'quill/dist/quill.bubble.css';// for bubble theme
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '0',
      form: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 用逗号分割的字符串
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
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
      selectedOptions: [],
      checkList: [],
      // 分类的动态参数
      dynamicsParams: [],
      // 分类的静态参数
      staticParams: [],
      // 上传图片的时候，设置请求头
      tokenHeader: {
        'Authorization': sessionStorage.getItem('token')
      }
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
    },
    // 点击tab栏执行
    async handleTabClick() {
      // 判断当前的tab栏是否是，商品参数或商品属性
      // 如果是的话，要判断层级下拉中，是否是三级分类
      // 如果没有选中三级分类，提示用户，选择三级分类
      if (this.active === '1' || this.active === '2') {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请选择三级分类');
          return;
        }
      }
      // 如果是三级，发送请求获取数据
      const sel = this.active === '1' ? 'many' : 'only';
      const { data } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
      if (this.active === '1') {
        // 给动态参数赋值
        // 获取的动态数据之后，要对数据进行处理，把字符串转换成数组
        this.dynamicsParams = data.data;
        // console.log(this.dynamicsParams);
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',');
        });
        // console.log(this.dynamicsParams);
      } else {
        // 给静态参数赋值
        this.staticParams = data.data;
      }
    },
    // 图片上传
    // 移出
    handleRemove(file) {
      // 把pics数组中对应的图片 移出
      // 首先要找到需要删除的图片的索引
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      // console.log(this.form.pics);
    },
    // 图片上传成功
    handleSuccess(response) {
      if (response.meta.status === 200) {
        // 上传成功
        this.$message.success(response.meta.msg);
        this.form.pics.push({
          pic: response.data.tmp_path
        });
        // console.log(this.form.pics);
      } else {
        // 上传失败
        this.$message.error(response.meta.msg);
      }
    },
    // 添加商品
    async handleAdd() {
      // 准备数据
      // goods_cat
      this.form.goods_cat = this.selectedOptions.join(',');
      const arr1 = this.dynamicsParams.map((item) => {
        // item.attr_vals = item.attr_vals.join(',');
        return { attr_id: item.attr_id, attr_value: item.attr_vals };
      });
      const arr2 = this.staticParams.map((item1) => {
        return { attr_id: item1.attr_id, attr_value: item1.attr_vals };
      });
      this.form.attrs = [...arr1, ...arr2];
      // 发送请求
      const { data: { meta: { msg, status } } } = await this.$http.post('goods', this.form);
      if (status === 201) {
        // 跳转回列表页
        this.$router.push({
          name: 'goods'
        });
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
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
.editor {
  margin-top: 15px;
}
</style>
