<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="uersInfo.query" clearable @clear="getUesrsList">
            <el-button slot="append" icon="el-icon-search" @click="getUesrsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table stripe :data="userList" border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽slot-scope可以拿到当前元素的父元素的数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
               <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteUser(scope.row.id)"></el-button>
            <!-- 文字提示 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
                <!-- 分配角色按钮 -->
                <el-button type="info" icon="el-icon-setting" size="mini" @click="showAllotDialog(scope.row)"></el-button>
            </el-tooltip>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="uersInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="uersInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parseInt(total)">
    </el-pagination>
    <!-- 添加对话框 -->
     <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
         <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
              <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email" ></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile" ></el-input>
            </el-form-item>
        </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户信息对话框 -->
        <el-dialog title="用户信息修改" :visible.sync="editDialogVisible" width="50%">
           <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input  v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input  v-model="editForm.mobile"></el-input>
            </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配用户角色对话框 -->
        <el-dialog title="角色分配" :visible.sync="allotDialogVisible" width="30%" @close="allotDialogClosed">
          <div>
            <p>当前的用户：{{uInfo.username}}</p>
            <p>当前的角色：{{uInfo.role_name}}</p>
          </div>
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="allotDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRole">确 定</el-button>
          </span>
        </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function () {
      //验证邮箱的验证规则
      var checkEmail = (rule,value,cb) =>{
          var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; 
          if (emailReg.test(value)) {
              return cb()
          }
          return cb(new Error("输入邮箱不合法"))
      }
      //验证手机的验证规则
      var checkMobile= (rule,value,cb) =>{
         var mobileReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
         if (mobileReg.test(value)) {
              return cb()
          }
          return cb(new Error("输入手机不合法"))
      }
    return {
      uersInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      //用户数据
      userList: [],
      //数据总条数
      total: '',
      //控制添加用户对话框的展示与隐藏
      addDialogVisible:false, 
      //控制修改用户对话框的展示与隐藏
      editDialogVisible:false, 
      //控制分配用户角色对话框的展示与隐藏
      allotDialogVisible:false,
      //添加用户表单数据
      addForm:{
          username:'',
          password:'',
          eamil:'',
          mobile:''
      },
      //添加用户表单数据
      editForm:{
           id:'',
           username:'',
           email:'',
           mobile:''
      }, 
      
      //添加用户表单校验规则
        rules:{
            username:[
                {required: true, message: '请输入用户名称', trigger: 'blur'},
                {min:3,max:16, message: '请输入3-16个字符', trigger: 'blur'}
            ],
            password:[
                {required: true, message: '请输入密码', trigger: 'blur'},
                {min:6,max:16, message: '请输入6-16个字符', trigger: 'blur'}
            ],
            email:[
                {required: true, message: '请输入邮箱', trigger: 'blur'},
                {validator:checkEmail,trigger: 'blur'}
            ],
            mobile:[
                {required: true, message: '请输入电话', trigger: 'blur'},
                {validator:checkMobile,trigger: 'blur'}

            ]
        } ,
        //即将分配角色的用户信息
        uInfo:{},
        //角色列表的所有数据
        rolesList:[],
        //选中的角色ID
        value:''
    }
  },
  created: function () {
    //获取用户列表
    this.getUesrsList()
  },
  methods: {
    //获取用户列表数据
    getUesrsList: async function () {
      //向后台API请求用户列表数据
      let { data: res } = await this.$http.get('users', {
        params: this.uersInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败')
      //将获取到的数据赋给data
      this.userList = res.data.users
      this.total = res.data.total
    //   console.log(res)
    },
    // 监听页码大小的变化
    handleSizeChange:function(newPageSize){
        this.uersInfo.pagesize = newPageSize
        this.getUesrsList()
    },
    //监听当前页面变化事件
    handleCurrentChange:function(newCurPage){
        this.uersInfo.pagenum = newCurPage
        this.getUesrsList()
    },
    //改变用户状态函数
    stateChange:async function(userinfo){
        let {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status!== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
    },
    //查询用户函数
    serch:function(userList){
        console.log(userList.id);
        // this.$http.get('users/:id',{params})
    },
     //监听对话框关闭事件，并重置表单内容
    addDialogClosed:function(){
        this.$refs.addFormRef.resetFields()
        console.log(this.$refs.addFormRef);
    },
    //添加用户函数
    addUser:function(){
        //添加用户预校验
        this.$refs.addFormRef.validate(async valid =>{
            if (!valid) return //如果表单验证有错误，则return
            //发送post请求添加用户
            var {data:res} = await this.$http.post('users',this.addForm)
            //如果返回的状态码不是201 则提示添加失败
            if (res.meta.status!==201) return this.$message.error(res.meta.msg)
            //如果返回的状态码是201 则提示添加成功
            this.$message.success(res.meta.msg)
            //关闭对话框
            this.addDialogVisible = false;
            //刷新列表
            this.getUesrsList()
            // console.log(res);
        })
    },
    //显示用户信息修改对话框
    showEditDialog:async function(id){
        //开启对话框
        this.editDialogVisible = true;
        //根据穿过来的ID查询用户信息
        var {data:res} = await this.$http.get(`users/${id}`)
        //提示是否查询成功
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //将查询到的信息赋给data里面创建好的对象
        this.editForm.username = res.data.username
        this.editForm.email = res.data.email
        this.editForm.mobile = res.data.mobile
        this.editForm.id = id
       
    },
    //修改用户
    editUser:async function(){
        //添加用户预校验
        this.$refs.editFormRef.validate(async valid =>{    
        if (!valid) return
        //利用id，按照data中editForm里的数据修改用户信息
        var {data:res} = await this.$http.put(`users/${this.editForm.id}`,{cat_name:this.editForm.cat_name})
        //提示是否修改成功
        if (res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getUesrsList()
        //关闭对话框
        this.editDialogVisible = false;
        })
    },
    //删除用户
    deleteUser:async function(id){
        //弹出提示框，询问是否删除用户
      var res =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res == 'confirm') {
             //将传过来的id值放到API中，按照id删除用户
        var {data:res} = await this.$http.delete('users/'+id)
        //提示是否删除成功
        if (res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getUesrsList()
        }else if(res == 'cancel'){
            this.$message.info('取消删除')
        }
       
    },
    //弹出分配角色对话框
    showAllotDialog:async function(userInfo){
      this.uInfo = userInfo
      //获取角色列表数据
      var {data:res} = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //讲获取数据赋给本地data中的rightsList
      this.rolesList = res.data
      console.log(this.rolesList);
      this.allotDialogVisible = true
    },
    //设置角色
    setRole:async function(){
      //修改用户角色
     var {data:res} =await this.$http.put(`users/${this.uInfo.id}/role`,{rid:this.value})
     if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
     //刷新列表
     this.getUesrsList()
     //关闭对话框
     this.allotDialogVisible= false
     console.log(res);
    },
    //监听分配角色对话框关闭事件
    allotDialogClosed:function(){
      //清空下拉列表框选中的选项
      this.value = ''
      //清空点击分配角色按钮，所获的当前的用户信息
      this.uInfo = {}
    }
  },
}
</script>
<style lang="less" scoped>
</style>