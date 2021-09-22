<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 搜索添加区域 -->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="goodInfo.query" clearable>
                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="goAddPage">添加商品</el-button>
            </el-col>
        </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodslist"  border stripe>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
            width="500px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格(元)">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量">
          </el-table-column>
          <el-table-column
          prop="add_time"
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat('yyyy-MM-dd')}}
          </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                   <!-- 修改按钮 -->
                   <el-button type="primary" icon="el-icon-edit" size="mini" @click='showEditDialog(scope.row.goods_id)'></el-button>
                   <!-- 删除按钮 -->
                   <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.goods_id)"></el-button>
              </template>
          </el-table-column>
        </el-table>
        <!-- 分页功能 -->
        <div class="block">
           <el-pagination
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
             :current-page="goodInfo.pagenum"
             :page-sizes="[5, 10, 15, 20]"
             :page-size="goodInfo.pagesize"
             layout="total, sizes, prev, pager, next, jumper"
             :total="parseInt(total)">
           </el-pagination>
         </div>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" status-icon :rules="editFormRules" ref="editFormRef">
        <el-form-item label="商品名称" prop="goods_name" label-width="80px" >
          <el-input v-model="editForm.goods_name" ></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price" label-width="80px" >
          <el-input v-model="editForm.goods_price" ></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight" label-width="80px" >
          <el-input v-model="editForm.goods_weight" ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number" label-width="80px" >
          <el-input v-model="editForm.goods_number" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data:function(){
        return {
            //商品查询输数据
            goodInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            //控制修改对话框的隐藏与显示
            editDialogVisible:false,
            //修改商品信息
            editForm:{},
            // 商品列表数据
            goodslist:[],
            //商品总数
            total:'',
            //添加表单的规则
            editFormRules:{
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
              ]     
            }
        }
    },
    created:function(){
        this.getGoodsList()
    },
    methods:{
        getGoodsList:async function(){
            //获取商品列表的所有数据
            var {data:res} = await this.$http.get('goods',{params:this.goodInfo})
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg)
            //将获取数据赋值给本地data用于页面渲染
            this.goodslist = res.data.goods
            //将商品总数量赋值给本地data用于页面渲染
            this.total = res.data.total
            //查询结束以后清空查询条件
            this.goodInfo.query =''
            console.log(res);
        },
        // 监听页面数据尺寸大小
        handleSizeChange:function(newPageSize){
            //将新的页面数据尺寸大小赋给查询对象中的pagesize
            this.goodInfo.pagesize = newPageSize
            //重新查询数据并渲染
            this.getGoodsList()
        },
        //监听页面变化
        handleCurrentChange:function(newCurrentCPage){
            //将新的查询页面赋给查询对象中的pagesize
            this.goodInfo.pagenum=newCurrentCPage
            //重新查询数据并渲染
            this.getGoodsList()
        },
        deleteGood:async function(id) {
            //弹出警告框，询问用户是否确定删除
           var result = await this.$confirm('此操作将永久删除该商品数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            //判断用户点击确定还是取消
            if (result == 'confirm') {
                //接收商品ID，利用商品ID进行删除
                var {data:res} = await this.$http.delete('goods/'+id)
                if (res.meta.status!==200) {
                return this.$message.error(res.meta.msg)
                }
                this.$message.success(res.meta.msg)
                console.log(res);
                
            }else{
                this.$message.info('取消删除成功')
            }
            //刷新列表
             this.getGoodsList()
            
        },
        //弹出修改商品信息对话框，并查询商品信息
        showEditDialog:async function(id){
         var {data:res} = await this.$http.get('goods/'+id)
         if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
         this.editForm = res.data
         console.log(res);
          this.editDialogVisible =true
        },
        //修改商品信息
        editGoods:async function(){
          //提交参数
         var {data:res} = await this.$http.put('goods/'+this.editForm.goods_id,this.editForm)
         if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
         console.log(res);
         //刷新列表
         this.getGoodsList()
        },
        goAddPage:function(){
            this.$router.push('goods/add')
        }
    }
    
}
</script>
<style lang="less" scoped>
</style>