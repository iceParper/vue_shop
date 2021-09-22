<template>  

    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <!-- 警告提示 -->
      <el-alert title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>
    <!-- 步骤条 -->
        <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 添加的form表单 -->
        <el-form :model="addForm" status-icon :rules="addFormRules" label-position="top" ref="addFormRef" label-width="100px">
        <!-- tab栏区域 -->
        <el-tabs tab-position="left" v-model="activeIndex" 
        :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <!-- 商品基本信息页面 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                 v-model="addForm.goods_cat"
                 :options="cateList"
                 :props="{ expandTrigger: 'hover',...cascaderProps}"
                 @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
            <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" 
            v-for="item in manyParams" :key="item.attr_id"> 
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox v-for="(item1,index) in item.attr_vals" :key="index" :label="item1" border>
              </el-checkbox>
            </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" 
            v-for="item in onlyParams" :key="item.attr_id"> 
            <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 图片上传 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到后台的接口 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" :headers="headerObj" 
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="picViewVisible"
      width="50%">
      <img :src="picPreViewUrl" width="100%">
    </el-dialog>
  </div>

</template>
<script>
import _ from 'lodash'
export default {
    data:function(){
        return {
            //步骤条激活索引
            activeIndex:0,
            //添加商品的表单数据
            addForm:{
              goods_name:'',
              goods_price:0,
              goods_weight:0,
              goods_number:0,
            //级联选择器选中值
              goods_cat:[],
              //添加商品时所需要的图片临时路径
              pics:[],
              //商品介绍
              goods_introduce:'',
              //商品参数与属性
              attrs:[]
            },
             //商品所以分类数据
              cateList:[],
              //级联选择器展示的相关属性
            cascaderProps: {
               value: 'cat_id',
               label: 'cat_name',
               children: 'children',
             },
             //根据选中分类查询到的动态参数
             manyParams:[],
             //根据选中分类查询到的静态属性
             onlyParams:[],
             //图片上传组件请求头对象
             headerObj:{Authorization:window.sessionStorage.getItem('token')},
             //图片预览地址
             picPreViewUrl:'',
             //控制图片预览对话框隐藏与展示
             picViewVisible:false,
            //添加表单的规则
            addFormRules:{
              goods_name:[
                { required: true, message: '请输入商品名称', trigger: 'blur' }
              ],
              goods_price:[
                { required: true, message: '请输入商品价格', trigger: 'blur' }
              ],
              goods_weight:[
                { required: true, message: '请输入商品重量', trigger: 'blur' }
              ],
              goods_number:[
                { required: true, message: '请输入商品数量', trigger: 'blur' }
              ],
              goods_cat:[
                { required: true, message: '请选择商品分类', trigger: 'blur' }
              ]
            }
            
        }
    },
    created: function () {
    this.getCateList()
  },
  methods:{
    //获取分类参数
    getCateList: async function () {
      //获取所有分类数据
      var { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将获取数据赋给本地data，供页面渲染使用
      this.cateList = res.data
      console.log(res.data)
    },
    //级联选择器选中项发生变化触发
    handleChange:function(){
      console.log(this.addForm.goods_cat);
    },
    //阻止标签页切换
    beforeTabLeave:function(newAcitve,oldActive){
      //判断当前页是否是商品信息页面，是否有选择商品属性
      if (oldActive =='0' && this.addForm.goods_cat.length!=3) {
        this.$message.error('请先选择商品分类')
        //如果不符合条件，则返回false 阻止tab栏切换
      return false
      }
    },
    //tab栏点击时触发
    tabClicked:async function(){
      //如果选择的标签索引是1
      if (this.activeIndex =='1') {
        //查询选中分类下的动态参数
        var {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //循环数据，将attr_vals从字符串转换为数组
         res.data.forEach(item => {
       item.attr_vals = item.attr_vals.length === 0?[]: item.attr_vals.split(' ')
      })
        //将返回的数据赋值给本地data
        this.manyParams = res.data
      console.log(this.manyParams);
      }else if(this.activeIndex =='2'){
        //查询选中分类下的静态属性
        var {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
          
        }
        //将返回的数据赋值给本地data
        this.onlyParams = res.data
        console.log(res.data);
      }
    },
    //处理图片预览效果
    handlePreview:function(file){
      //拿到上传图片预览地址
      var picViewUrl = file.response.data.url
      //将拿到的地址赋值给本地data，用于页面渲染
      this.picPreViewUrl =picViewUrl
      //弹出图片预览对话框
      this.picViewVisible = true
    },
    //处理点击图片右上角叉号触发
    handleRemove:function(file){
      //获取需要移除图片的临时地址
      const picUrl = file.response.data.tmp_path
      //找到地址在本地data中的索引值
     var index = this.addForm.pics.findIndex(item =>{
       return item.pic === picUrl
      })
      //找到索引以后删除data中相应的图片地址
      this.addForm.pics.splice(index,1)
      console.log(this.addForm);
    },
    //上传图片成功后调用的钩子函数
    handleSuccess:function(response){
      if(response.meta.status !==200) return this.$message.error(response.meta.msg)
      const picsInfo = {pic:response.data.tmp_path}
      //每上传成功一次图片，就把图片的临时路径放到 添加商品的请求数据中去
      this.addForm.pics.push(picsInfo)
      console.log(this.addForm);
    },
    //添加商品信息
    addGoods:async function(){
      //表单预验证
      this.$refs.addFormRef.validate(vaild =>{
        if (!vaild) {
          return this.$message.error('请输入完整的商品信息')
        }
      })
      //深拷贝,操作拷贝过后的对象，不会影响本身的数据
      const form =_.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      //处理动态参数
      this.manyParams.forEach(item => {
        const newInfo = {attr_id:item.attr_id,
        attr_value:item.attr_vals.join(' ')}
        //将处理好的动态参数添加到添加商品的对象中去
      this.addForm.attrs.push(newInfo)
      })
      //处理动态参数
      this.onlyParams.forEach(item => {
        const newInfo = {attr_id:item.attr_id,
        attr_value:item.attr_vals}
        //将处理好的动态参数添加到添加商品的对象中去
      this.addForm.attrs.push(newInfo)
      })
      //将处理好的attrs赋值给自己深拷贝的form
      form.attrs = this.addForm.attrs
      console.log(form);
      //将数据传给后端API 进行储存
     var {data:res} = await this.$http.post('goods',form)
     if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
     this.$router.push('/goods')
     console.log(res);
    }
    

  },
  //计算属性
  computed:{
    cateId:function(){
      //如果选择的是三级分类
      if (this.addForm.goods_cat.length ==3) {
        //返回分类的ID值
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.addBtn {
  margin-top: 15px;
}
</style>