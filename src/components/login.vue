<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="pic_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login_form">
          <!-- 用户名 -->
        <el-form-item >
          <el-input prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  height: 300px;
  width: 450px;
  border-radius: 3px;
  background-color: #fff;
  left: 50%;
  top: 50%;
  margin-top: -150px;
  margin-left: -225px;
}
.pic_box {
  position: absolute;
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #fff;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>