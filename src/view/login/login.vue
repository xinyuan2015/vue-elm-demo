<template>
  <div class="login-container">
    <head-top :head-title="loginWay ? '登陆' : '密码登录'" goBack="true">
      <div slot="changeLogin" class="change-login" @click="changeLoginWay">{{loginWay ? "密码登录" : "短信登陆"}}</div>
    </head-top>
    <form class="login-form" v-if="loginWay">
      <section class="input-container phone-number">
        <input type="text" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{'right-phone-number':rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button @click.prevent v-show="computedTime">已发送（{{computedTime}}s）</button>
      </section>
      <section class="input-container">
        <input type="text" placeholder="验证码" name="mobileCode" maxLength="6" v-model="mobileCode">
      </section>
    </form>
    <form class="login-form" v-else>
      <section class="input-container">
        <input type="text" placeholder="手机号/邮箱/用户名" v-model.lazy="userAccount">
      </section>
      <section class="input-container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button-switch" :class="{'change-to-text': showPassword}">
          <div class="circle-button" :class="{'trans-to-right': showPassword}" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input-container captcha-code-container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img-change-img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg">
          <div class="change-img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login-tips">
      温馨提示：未注册饿了么账号的手机号，登录时将自动注册，且代表您已同意
      <a href="https://h5.ele.me/service/agreement/">《用户服务协议》</a>
    </p>
    <div class="login-button" @click="mobileLogin">登陆</div>
    <router-link to="/forget" class="to-forget" v-if="!loginWay">忘记密码？</router-link>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import {mapMutations} from 'vuex';
  import {mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin} from 'service/getData';

  export default {
    data() {
      return {
        loginWay: true, // 登陆方式，默认短信登陆
        showPassword: false, // 是否显示密码
        phoneNumber: null, // 电话号码
        mobileCode: null, // 短信验证码
        validate_token: null, // 获取短信时返回的验证值，登陆时需要
        computedTime: 0, // 倒数计时
        userInfo: null, // 获取到的用户信息
        userAccount: null, // 用户名
        passWord: null, // 密码
        captchaCodeImg: null, // 验证码地址
        codeNumber: null, // 验证码
        showAlert: false, // 显示提示内容
        alertText: null // 提示内容
      };
    },
    created() {
      this.getCaptchaCode();
    },
    computed: {
      // 判断手机号码
      rightPhoneNumber: function () {
        return /^1\d{10}$/gi.test(this.phoneNumber);
      }
    },
    methods: {
      ...mapMutations([
        'RECORD_USERINFO'
      ]),
      // 改变登陆方式
      changeLoginWay() {
        this.loginWay = !this.loginWay;
      },
      // 是否显示密码
      changePassWordType() {
        this.showPassword = !this.showPassword;
      },
      // 获取验证码，线上环境使用固定的图片，生产环境使用真实的验证码
      async getCaptchaCode() {
        if (process.env.NODE_ENV !== 'development') {
          this.captchaCodeImg = 'http://test.fe.ptdev.cn/elm/yzm.jpg';
        } else {
          let res = await getcaptchas();
          this.captchaCodeImg = 'https://mainsite-restapi.ele.me/v1/captchas/' + res.code;
        }
      },
      // 获取短信验证码
      async getVerifyCode() {
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          this.timer = setInterval(() => {
            this.computedTime --;
            if (this.computedTime === 0) {
              clearInterval(this.timer);
            }
          }, 1000);
          // 判断用户是否在
          let exsis = await checkExsis(this.phoneNumber, 'mobile');
          if (exsis.message) {
            this.showAlert = true;
            this.alertText = exsis.message;
            return;
          } else if (!exsis.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
            return;
          }
          // 发送短信验证码
          let res = await mobileCode(this.phoneNumber);
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return;
          }
          this.validate_token = res.validate_token;
        }
      },
      // 发送登录信息
      async mobileLogin() {
        if (this.loginWay) {
          if (!this.rightPhoneNumber) {
            this.showAlert = true;
            this.alertText = '手机号码不正确';
            return;
          } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
            this.showAlert = true;
            this.alertText = '短信验证码不正确';
            return;
          }
          // 手机号登陆
          this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
        } else {
          if (!this.userAccount) {
            this.showAlert = true;
            this.alertText = '请输入手机号/邮箱/用户名';
            return;
          } else if (!this.passWord) {
            this.showAlert = true;
            this.alertText = '请输入密码';
            return;
          } else if (!this.codeNumber) {
            this.showAlert = true;
            this.alertText = '请输入验证码';
            return;
          }
          // 用户名登陆
          this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
        }
        // 如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
        if (!this.userInfo.user_id) {
          this.showAlert = true;
          this.alertText = this.userInfo.message;
          if (!this.loginWay) this.getCaptchaCode();
        } else {
          this.RECORD_USERINFO(this.userInfo);
          this.$router.go(-1);
        }
      },
      closeTip() {
        this.showAlert = false;
      }
    },
    components: {
      headTop,
      alertTip
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  .login-container
    padding-top: 1.95rem;
    p, span, input
      font-family: Helvetica Neue, Tahoma, Arial;
    .change-login
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.7rem;
      color: #fff;
    .login-form
      background-color: #fff;
      margin-top: 0.6rem;
      .input-container
        display: flex;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-bottom: 1px solid #f1f1f1;
        input
          font-size: 0.7rem;
          color: #666;
        button
          font-size: 0.65rem;
          color: #fff;
          font-family: Helvetica Neue,Tahoma,Arial;
          padding: .28rem .4rem;
          border: 1px;
          border-radius: 0.15rem;
        .right-phone-number
          background-color: #4cd964;
      .phone-number
        padding: 0.3rem 0.8rem;
      .captcha-code-container
        height: 2.2rem;
        .img-change-img
          display: flex;
          align-items: center;
          img
            width: 3.5rem;
            height: 1.5rem;
            margin-right: .2rem;
          .change-img
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            width: 2rem;
            justify-content: center;
            p
              font-size: 0.55rem;
              color: #666;
            p:nth-of-type(2)
              color: #3b95e9;
              margin-top: .2rem;
    .login-tips
      font-size: 0.5rem;
      color: #999;
      padding: .4rem .6rem;
      line-height: .7rem;
      a
        color: #3b95e9;
    .login-button
      margin: 0 .5rem 1rem;
      font-size: 0.7rem;
      color: #fff;
      background-color: #4cd964;
      padding: .5rem 0;
      border: 1px;
      border-radius: 0.15rem;
      text-align: center;
    .button-switch
      background-color: #ccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 2rem;
      height: 0.7rem;
      padding: 0 .2rem;
      border: 1px;
      border-radius: 0.5rem;
      position: relative;
      transition: all .3s;
      .circle-button
        transition: all .3s;
        position: absolute;
        z-index: 1;
        width: 1.2rem;
        height: 1.2rem;
        left: -.1rem;
        box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
        background-color: #f1f1f1;
        border-radius: 50%;
      .trans-to-right
        transform: translateX(1.3rem);
      span
        font-size: 0.45rem;
        color: #fff;
        transform: translateY(.05rem);
        line-height: .6rem;
      span:nth-of-type(2)
        transform: translateY(-.08rem);
    .change-to-text
      background-color: #4cd964;
    .to-forget
      float: right;
      font-size: 0.6rem;
      color: #3b95e9;
      margin-right: 0.3rem;
</style>
