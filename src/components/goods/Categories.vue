<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table :data="cateList" :columns="columns" class="treeTable"
      :selection-type="false" :expand-type="false" :show-index="true" border>
      <!-- 是否有效区域 -->
      <template slot="isOk" slot-scope="scope">
         <i class='el-icon-success' v-if="scope.row.cat_deleted == false" style="color:lightgreen"></i>
         <i class='el-icon-error' style="color:red" v-else></i>
     </template>
     <!-- 排序内部的小tag -->
     <template slot="whichLevel" slot-scope="scope">
         <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
         <el-tag  type="success" v-else-if="scope.row.cat_level =='1'">二级</el-tag>
         <el-tag type="warning" v-else>三级</el-tag>
     </template>
     <template slot="button" slot-scope="scope">
         <!-- 修改按钮 -->
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCate(scope.row.cat_id)"></el-button>
         <!-- 删除按钮 -->
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)"></el-button>
     </template>
      </tree-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="parseInt(total)">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="resetForm">
       <el-form :model="addForm" :rules="addCateRules" label-width="100px" ref="addCateRef">
         <el-form-item label="分类名称:" prop="cat_name" >
           <el-input v-model="addForm.cat_name"></el-input>
         </el-form-item>
         <el-form-item label="父级分类：">
            <div class="block">
                <!-- options绑定数据 -->
                <!-- porops绑定显示在选择器中的lable和对应的value -->
                <!-- v-model是选中的值 -->
                <el-cascader
                 v-model="selectKeys"
                 :options="cascaderList"
                 :props="{ checkStrictly: true,expandTrigger: 'hover' ,...cacsaderProps}"
                 @change="selectKeysChange" clearable></el-cascader>
            </div>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button @click="addDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="addCate">确 定</el-button>
       </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="resetForm">
        <el-form :model="editForm" :rules="addCateRules" label-width="100px" ref="addCateRef">
         <el-form-item label="分类名称:" prop="cat_name" >
           <el-input v-model="editForm.cat_name"></el-input>
         </el-form-item>
         </el-form>
        <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editCate">确 定</el-button>
       </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    created:function(){
        //获取分类表格数据
        this.getCateList()
    },
    data:function(){
        return {
            //查询信息
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //数据总条数
            total:'',
            //分类列表数据
            cateList:[],
            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            //控制编辑对话框的显示与隐藏
            editDialogVisible:false,
            //树形列表每行显示的名称与属性名，是否使用template模板，模板名叫什么
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                type:'template',
                template:'isOk'
            },{
                label:'排序',
                type:'template',
                template:'whichLevel'
            },{
                label:'操作',
                type:'template',
                template:'button'

            }],
            //添加分类的存储数据对象
            addForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },
            //需要修改的分类表单
            editForm:{

            },
            //验证添加分类的表单验证规则
            addCateRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            //级联选择器存放的数组
            cascaderList:[],
            //级联选择器显示的文本，对应数据名称，嵌套显示的名称
            cacsaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //级联选择器中选中的值的ID
            selectKeys:[]
        }
    },
    methods:{
        //获取表格数据
        getCateList:async function(){
            //获取所有分类列表数据
            var {data:res} =await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            //将查询到的数据放到本地data中存储，供模板渲染使用
            this.cateList = res.data.result
            this.total =res.data.total
            console.log(res);
        },
        //监听当前页码变化
        handleCurrentChange:function(newPage){
            //将新的页码替换本地查询数据的条件
            this.queryInfo.pagenum = newPage
            //更新列表，查询新页码的数据
            this.getCateList()
        },
        //监听分页大小的变化
        handleSizeChange:function(newPageSize) {
            //将新的页码大小替换本地查询数据的条件
            this.queryInfo.pagesize = newPageSize
            //更新列表，查询新页码的数据
            this.getCateList()
        },
        //弹出添加分类对话框
        showAddDialog:async function(){
            //获取级联选择器的数据
            var {data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.cascaderList = res.data
            console.log(this.cascaderList);
            //将显示对话框的值改为true
            this.addDialogVisible = true
        },
        selectKeysChange:function(){
            console.log(this.selectKeys);
            if(this.selectKeys.length>0){
                //添加新的分类的父ID
                this.addForm.cat_pid = this.selectKeys[this.selectKeys.length-1]
                //添加新的分类的Level
                this.addForm.cat_level = this.selectKeys.length
                return
            }else{
                //添加新的分类的父ID
                this.addForm.cat_pid = 0
                //添加新的分类的Level
                this.addForm.cat_level = 0
            }
        },
        //关闭时清空添加分类表单
        resetForm:function(){
            //清空form表单中的数据
            this.$refs.addCateRef.resetFields()
            //清空级联选择器中俄数据
            this.selectKeys = []
            this.addForm.cat_pid = 0
            this.addForm.cat_level = 0
        },
        //添加分类
        addCate:async function(){
            //向后台API发送数据请求，添加分类
            var {data:res} =await this.$http.post('categories',this.addForm)
            if (res.meta.status !==201) return this.$message.error(res.meta.msg)
            this.addDialogVisible = false        
            this.getCateList()
        },
        //弹出编辑对话框，并查询当前数据绑定到对话框中
        showEditCate:async function(id){
            //按ID查询表单数据
            var {data:res} = await this.$http.get('categories/'+id)
            console.log(res);
            if(res.meta.status !== 200)  this.$message.success(res.meta.msg)
            this.editForm =res.data
            this.editDialogVisible = true
        },
        //删除分类
        deleteCate:async function(id){
            //提示消息
            var res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            if (res === 'confirm') {
                var {data:result}= await this.$http.delete('categories/'+id)
                if(result.meta.status == 200)  this.$message.success(result.meta.msg)
            }else{
                 this.$message.info('取消成功')
            }
            //刷新列表
           this.getCateList()

        },
        //编辑分类
        editCate:async function(){
            //提交修改信息
            var {data:res} = await this.$http.put('categories/'+this.editForm.cat_id,this.editForm)
            if(res.meta.status == 200)  this.$message.success(res.meta.msg)
            // this.cateList = res.data
            console.log(res);
            this.editDialogVisible = false
            this.getCateList()
        }

    }
}
</script>
<style lang="less" scoped>
.treeTable {
    margin: 15px 0;
}
.el-cascader {
    width: 100%;
}
</style>