<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
            <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.pay_status==0">
                    未付款
                </el-tag>
                <el-tag type="success" v-else>
                    已付款
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
        <template slot-scope="scope">
            {{scope.row.create_time | dateFormat('yyyy-MM-dd')}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
            <template>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog"></el-button>
                <el-button type="success" size="mini" icon="el-icon-location"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="orderInfo.pagenum"
          :page-sizes="[3, 5, 10]"
          :page-size="orderInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="parseInt(total)">
        </el-pagination>
      </div>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" >
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover'}"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data: function () {
    return {
        //订单查询条件
       orderInfo:{
        query:'',
        pagenum:1,
        pagesize:5
       },
       //订单数据
       ordersList:[],
       //订单总条数
       total:'',
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      //表单验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
       caseProps:{
        children: 'children',
       },
       cityData,
        progressVisible: false,
        progressInfo: []
    }
  },
  created:function(){
      this.getOrderList()
    },
  methods:{
      //获取订单列表数据
      getOrderList:async function(){
         var {data:res} = await this.$http.get('orders',{params:this.orderInfo})
         if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
         //获取列表数据成功，就将数据赋值给本地data 用于页面渲染
         this.ordersList = res.data.goods
         //将查询到的数据条数赋值给本地
         this.total = res.data.total
         //查询结束以后清空查询条件
         this.orderInfo.query =''
         console.log(res);
      },
      //监听列表页面大小的变化
      handleSizeChange:function(newPageSize){
          //赋值新的页面尺寸大小
          this.orderInfo.pagesize = newPageSize
          //刷新列表
          this.getOrderList()
      },
      //监听页面当前页码的变化
      handleCurrentChange:function(newCurrentPage){
          //赋值新的页码
          this.orderInfo.pagenum = newCurrentPage
          //刷新列表
          this.getOrderList()
      },
      //显示修改对话框
      showEditDialog:function(){
          this.addressVisible = true
      },
      async showProgressBox() {
        const { data: res } = await this.$http.get('/kuaidi/1106975712662')

        if (res.meta.status !== 200) {
         return this.$message.error('获取物流进度失败！')
         }

        this.progressInfo = res.data

        this.progressVisible = true
        console.log(this.progressInfo)
    }
  
  }

}
</script>
<style lang="less" scoped>
</style>