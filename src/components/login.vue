<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="pic_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns" prop="">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      //表单数据绑定
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginRules: {
        //表单验证规则
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 5,
            max: 16,
            message: '输入长度需要在5-16个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 5,
            max: 16,
            message: '输入长度需要在5-16个字符之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //重置表单内容
    reset: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      //根据表单验证规则进行表单预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        //获取登录后服务器响应回来的数据
        let { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('密码错误,请重新输入')
        //使用Vue实例里prototype中的属性$message，里面提前搭载了message组件
        this.$message({
          message: '登录成功',
          type: 'success',
        })
        //在登录成功以后，应该吧token保存到sessionstorage中去
        //token只在网页打开期间生效，除了登录之外的API接口必须在登录之后才能使用
        window.sessionStorage.setItem('token', res.data.token)
        //登录成功以后，向home界面跳转
        this.$router.push('/home')
      })
    },
  },
}
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