<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="./logo2.jpg" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginRef"
        :model="login"
        label-width="0px"
        class="login_form"
        :rules="loginRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="login.username" prefix-icon="iconfont icon-user" autofocus="true"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="login.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="toLogin">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    login: {
      username: "admin",
      password: "123456"
    },
    loginRules: {
      username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
      ]
    }
  }),
  methods: {
    resetLogin() {
      this.$refs.loginRef.resetFields();
      this.login.username = this.login.password = "";
    },
    toLogin() {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return;
        const {
          data: { data, meta }
        } = await this.$http.post("login", this.login);
        //  console.log(meta);
        if (meta.status !== 200) return this.$Message.error("登录失败！");
        this.$Message.success("登陆成功！");
        sessionStorage.setItem('token',data.token)
        this.$router.push('/home')
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  // background-color: #2b4b6b;
  background: url("./bg.jpg"), no-repeat;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
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
  }
}
</style>
