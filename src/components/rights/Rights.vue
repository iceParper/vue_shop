<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 表格区域 -->
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column type="index" > </el-table-column>
        <el-table-column prop="authName" label="权限名称" ></el-table-column>
        <el-table-column prop="path" label="路径" ></el-table-column>
        <el-table-column prop="level" label="权限等级"> 
            <!-- 标签美化 -->
            <template slot-scope="scope">
                <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level =='1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  created: function () {
      //获取列表数据，渲染
    this.getRightsList()
  },
  data: function () {
    return {
        //权限列表数据
      rightsList: [],
    }
  },
  methods: {
    //获取权限列表数据
    getRightsList: async function () {
      //以列表形式获得权限列表数据
      var { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //将API里请求过来的数据放到组件data中去，供模板数据渲染
      this.rightsList = res.data
      console.log(res)
    },
  },
}
</script>
<style lang="less" scoped>
</style>