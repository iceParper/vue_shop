<template>
  <el-container class="home-container">
    <!-- 头部部分 -->
    <el-header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" 
        :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router="">
        <div class="toggle-button" @click="toggle">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 字体图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 字体图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    created:function(){
        this.getMenuList();
    },
    data:function(){
        return {
            menuList:[],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
             },
             isCollapse:false
        }
    },
    methods: {
    loginout: function () {
      //清除页面里的token
      window.sessionStorage.clear()
      //重定向到登录页面
      this.$router.push('/login')
    },
    //获取左侧列表数据
    getMenuList:async function(){
        var {data:res}=await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
        console.log(this.menuList);
    },
    toggle:function(){
        this.isCollapse = !this.isCollapse
    }
  },
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
  .el-menu {
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    line-height: 24px;
}
</style>