<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意只允许第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择分类区域 -->
      <div>
        <span>选择商品分类:</span>
        <!-- 级联选择框 -->
        <el-cascader :options="cateList" :props="{ expandTrigger: 'hover', ...cascaderProps }"
          v-model="selectKeys" @change="handleChange" clearable>
        </el-cascader>
      </div>
      <!-- tab标签栏 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="dialogVisible =true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
           :data="manyTableData"
           border
           stripe
           style="width: 100%">
           <!-- 展开列 -->
           <el-table-column type="expand">
             <template slot-scope="scope">
               <!-- 循环渲染tab标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                closable @close="deleteTag(index,scope.row)">{{item}}</el-tag>
                <!-- 文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <!-- 索引列 -->
           <el-table-column type="index"></el-table-column>
           <el-table-column
             prop="attr_name"
             label="参数名称">
           </el-table-column>
           <el-table-column label="操作">
             <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)"></el-button>
             </template>
           </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="dialogVisible =true">添加属性</el-button>
          <el-table
           :data="onlyTableData"
           border
           stripe
           style="width: 100%">
           <!-- 展开列 -->
           <el-table-column type="expand">
             <template slot-scope="scope">
               <!-- 循环渲染tab标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index"
                closable @close="deleteTag(index,scope.row)">{{item}}</el-tag>
                <!-- 文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
             </template>
           </el-table-column>
           <!-- 索引列 -->
           <el-table-column type="index"></el-table-column>
           <el-table-column
             prop="attr_name"
             label="属性名称">
           </el-table-column>
           <el-table-column label="操作">
             <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteParams(scope.row.attr_id)"></el-button>
             </template>
           </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数与属性对话框 -->
    <el-dialog
      :title="'添加'+text"
      :visible.sync="dialogVisible"
      width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="text" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数与属性对话框 -->
    <el-dialog
      :title="'修改'+text"
      :visible.sync="editdialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="text" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">确 定</el-button>
        <el-button @click="editdialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      //商品所以分类数据
      cateList: [],
      //级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择器所选择的数据
      selectKeys: [],
      //tab栏当前选中的标签
      activeName:'many',
      //分类动态参数数据
      manyTableData:[],
      //分类动态参数数据
      onlyTableData:[],
      //控制添加对话框的弹出与隐藏
      dialogVisible:false,
      //控制修改对话框的弹出与隐藏
      editdialogVisible:false,
      //添加表单数据
      addForm:{},
      //修改表单数据
      editForm:{},
      rules:{
        attr_name:[
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.getCateList()
  },
  methods: {
    getCateList: async function () {
      //获取所有分类数据
      var { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将获取数据赋给本地data，供页面渲染使用
      this.cateList = res.data
      console.log(res.data)
    },
    //获取分类参数
    getParamsData:async function(){
      if (this.cateId == null) {
        return
      }
      //获取分类参数列表
      var {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将里面属性值从字符串形式改为数组形式
      res.data.forEach(item => {
        item.attr_vals=item.attr_vals?item.attr_vals.split(' ') :[]
          //控制按钮与输入框的切换
        item.inputVisible=false
          //文本框输入的内容
        item.inputValue=''
      })
      console.log(res.data)
      //判断获取的数据是动态参数，还是静态属性,并赋值到本地数据用于页面渲染
      if(this.activeName ==='many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },
    //监听级联选择器，变化触发函数
    handleChange:function () {
      //调用函数 ，获取分类参数数据
      this.getParamsData()
      
    },
    //监听tab栏点击事件
    handleTabClick:function(){
       //调用函数 ，获取分类参数数据
      this.getParamsData()
      console.log(this.activeName);
    },
    showDialog:function(){
      this.dialogVisible =true
    },
    //监听对话框关闭事件
    addDialogClosed:function(){
      //重置表单内容
      this.$refs.addFormRef.resetFields()
    },
    //添加动态参数或静态属性
    add:function(){
      //表单预交
      this.$refs.addFormRef.validate(async valid =>{
        if (valid) {
          //添加动态参数或者静态属性，attr_sel:this.activeName可以区分
          var {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName,
      })
      if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
      //刷新参数列表
      this.getParamsData()
      //关闭对话框
      this.dialogVisible = false
      console.log(res);
        }
      })
     
    },
    //弹出修改对话框，并显示数据
    showEditDialog:async function(id){
      //获取当前需要修改参数的原本数据
     var {data:res} =await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将查询到的数据赋给本地数据容器，用于页面渲染
      this.editForm = res.data
      //弹出对话框
      this.editdialogVisible =true
      console.log(res);
    },
    //修改动态参数或静态属性
    edit:async function(){
      //表单预验证
      this.$refs.editFormRef.validate(async valid =>{
        if (valid) {
          //修改表单数据
            var {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
          })
          //刷新参数表单
          this.getParamsData()
          console.log(res);
        }
      })
      //关闭对话框
      this.editdialogVisible = false
    },
    //删除参数或属性
    deleteParams:async function(id){
      //弹出提示框
      var res = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res === 'confirm') {
           //查询到数据并删除
            var {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            console.log(res);
        }else{
          this.$message.info('取消成功')
        }
     //刷新参数表单
            this.getParamsData()
    },
    //监听文本框输入结束
    handleInputConfirm:async function(row){
      console.log('ok');
      //如果输入的内容为空
      if(row.inputValue.trim().length ===0){
        //清空输入框内容，并关掉输入框
          row.inputValue= ''
          row.inputVisible = false
          return
      }else{
          row.attr_vals.push(row.inputValue.trim())
          row.inputValue= ''
          row.inputVisible = false
          //调用函数，将添加的参数保存到数据库中
          this.saveAttrVals(row)
      }
      
      
    },
    //点击按钮切换成文本框
    showInput:function(row){
      row.inputVisible = true
      //自动获得输入框焦点,当页面重新渲染结束以后，才回调用$nextTick事件函数，
      //如果页面没有渲染完成，就找不到inputDOM元素，使用focus就会报错
      this.$nextTick(_ => {
          this.$refs.saveTagInputRef.$refs.input.focus();
        });
    },
    //保存分类参数操作
    saveAttrVals:async function(row){
      var {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
            attr_name:row.attr_name,
            attr_sel:row.attr_sel,
            attr_vals:row.attr_vals.join(' ')
          })
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
          
    },
    //删除分类下参数
    deleteTag:async function(index,row){
      row.attr_vals.splice(index,1)
      //调用函数，将添加的参数保存到数据库中
          this.saveAttrVals(row)
    }
  },
  computed:{
    //用来判断添加按钮是否禁用
    isButtonDisabled:function(){
      if (this.selectKeys.length == 3) {
        return false
      }
      return true
    },
    //用来获取选中的三级分类的ID
    cateId:function(){
      if (this.selectKeys.length === 3) {
        //返回选中的三级分类ID
        return this.selectKeys[2]
      }
      return null
    },
    //控制对话框展示属性还是参数
    text:function(){
      if(this.activeName == 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  margin-left: 10px;
}
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin-right: 10px;
}
</style>