<template>
  <div>
    <el-button type="info" @click="loginout">退出登录</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    loginout: function () {
      //清除页面里的token
      window.sessionStorage.clear()
      //重定向到登录页面
      this.$router.push('/login')
    },
  },
}
</script>
<style lang="less" scoped>
</style>