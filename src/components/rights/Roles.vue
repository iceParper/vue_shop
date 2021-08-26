<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡牌视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="rolesList" stripe border="" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
            <el-row :class="['vcenter','btBoder',index1==0?'topBoder':'']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                <!-- 角色一级权限 -->
                <el-col :span="5">
                    <el-tag closable @close="deleteTagById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 角色二、三级权限 -->
                <el-col :span="19">
                    <!-- 二级权限 -->
                   <el-row :class="['vcenter',,index2==0?'':'topBoder']" v-for="(item2,index2) in item1.children" :key="item2.id">
                       <el-col :span="6" >
                           <el-tag type="success" closable 
                           @close="deleteTagById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>
                       </el-col>
                    <!-- 三级级权限 -->
                       <el-col  :span="18" >
                            <el-tag closable type="warning" v-for="(item3) in item2.children" :key="item3.id" 
                             @close="deleteTagById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                       </el-col>
                    </el-row> 
                </el-col>
            </el-row>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" >编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="showSetRightDialog(scope.row)">权限分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName" label-width="80px">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
      
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName" label-width="80px" >
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" label-width="80px">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="修改角色" :visible.sync="setDialogVisible" width="30%" 
    @close="resetDefKeys" >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps"
      show-checkbox node-key="id" default-expand-all 
      :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      //角色列表数据
      rolesList: [],
      //控制添加角色对话框展示与隐藏
      addDialogVisible: false,
      //控制修改角色对话框展示与隐藏
      editDialogVisible:false,
      //控制设置权限对话框展示与隐藏
      setDialogVisible:false,
      //添加角色数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      //修改角色数据
      editForm:{
      },
      //获取所以权限数据
      rightsList:[],
      //树形控件
      treeProps:{
          label:'authName',
          children:'children'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 16, message: '请输入2-16个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
      },
      //默认选中的节点
        defaultKeys:[],
        //即将被分配的角色ID
        roleId:''
    }
  },
  created: function () {
    //获取角色列表数据
    this.getRolesList()
  },
  methods: {
    //获取角色列表方法
    getRolesList: async function () {
      var { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    //   console.log(res)
    },
    //弹出添加按钮对话框
    showAddDialog: function () {
      this.addDialogVisible = true
    },
    //监听对话框关闭事件
    addDialogClosed: function () {
      //重置表单
      this.$refs.addFormRef.resetFields()
    },
    //添加角色
    addRole: function () {
      //表单预验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        //提交数据到后台进行验证并储存
        var { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        //关闭对话框
        this.addDialogVisible = false
        //刷新列表
        this.getRolesList()
        console.log(res)
      })
    },
    //弹出修改对话框,获取当前列角色信息
    showEditDialog:async function (id) {
        //根据id获取相应信息
        var {data:res} =await this.$http.get('roles/'+id)
        //将api响应回来的数据赋值给本地data
        this.editForm = res.data
        this.editDialogVisible = true
        console.log(res);
    //   console.log(id)
    },
    //修改角色信息
    editRole:function(){
        //表单预验证
        this.$refs.editFormRef.validate(async valid =>{
            if (!valid) return
            //根据角色id修改角色信息
            var {data:res} =await this.$http.put('roles/'+this.editForm.roleId,this.editForm)
            if(res.meta.status !==200) return this.$message.error(res.meta.msg)
            //刷新列表
            this.getRolesList()
            //关闭对话框
            this.editDialogVisible = false
            console.log(res);
        })
    },
    //删除角色
    deleteRole:async function(id){
          //弹出提示框，询问是否删除用户
      var res =await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res == 'confirm') {
             //将传过来的id值放到API中，按照id删除用户
        var {data:res} = await this.$http.delete('roles/'+id)
        //提示是否删除成功
        if (res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        //刷新列表
        this.getRolesList()
        }else if(res == 'cancel'){
            this.$message.info('取消删除')
        }
    },
    //根据id删除权限
    deleteTagById:async function(role,rightId){
        //弹窗是否需要删除权限
        var res =await this.$confirm('此操作将永久删除角色改权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (res !== 'confirm') {
            return this.$message.info('取消成功')
        }else {
            //删除权限
           var {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
             //刷新列表
            // this.getRolesList()
            //将返回的最新权限赋给role.children达到更新权限列表的目的
            role.children = res.data
        }
    },
    // 弹出权限对话框
    showSetRightDialog:async function(role){
        this.roleId = role.id
        //获取所以权限数据
        var {data:res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //将数据赋值给本地data
        this.rightsList = res.data
        //调用递归函数获取所有三级节点ID
        this.getLeafKeys(role,this.defaultKeys)
        //弹出对话框
        this.setDialogVisible = true
    },
      // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听关闭权限分配对话框
    resetDefKeys:function(){
        //清空数组内的id值
        this.defaultKeys = []
    },
    //分配权限
    setRights:async function(){
        //获取到对话框内，被半选中和全选中的节点ID
        const keys = [
            //...展开运算符，两个方法查询到的结果展开，存放到同意数组中
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // 讲数组以逗号拼接成字符串
        const keysStr = keys.join(',')
        //发起请求提交参数
        var {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysStr})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 刷新列表
        this.getRolesList()
        //关闭对话框
        this.setDialogVisible = false
        //    console.log(res)

    }
        
  },
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.topBoder {
    border-top:1px solid #eee;
}
.btBoder {
    border-bottom:1px solid #eee;

}
.vcenter {
    display: flex;
    align-items: center;
}
</style>