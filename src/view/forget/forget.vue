<template>
  <div class="reset-container">
    <head-top head-title="重置密码" goBack="true"></head-top>
    <form class="reset-form">
      <section class="input-container phone-number">
        <input type="text" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
        <button @click.prevent="getVerifyCode" :class="{'rigth-phone-number':rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button @click.prevent v-show="computedTime">已发送{{computedTime}}s</button>
      </section>
      <section class="input-container">
        <input type="text" placeholder="请输入新密码" name="newPassWord" v-model="newPassWord">
      </section>
      <section class="input-container">
        <input type="text" placeholder="请确认密码" name="confirmPassWord" v-model="confirmPassWord">
      </section>
      <section class="input-container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <div class="login-container" @click="resetButton">确认修改</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import {mobileCode, checkExsis, sendMobile} from 'service/getData';

  export default {
    data() {
      return {
        phoneNumber: null, // 电话号码
        newPassWord: null, // 新密码
        rightPhoneNumber: false, // 输入的手机号码是否符合要求
        confirmPassWord: null, // 确认密码
        captchaCodeImg: null, // 验证码地址
        mobileCode: null, // 短信验证码
        computedTime: 0, // 倒数计时
        showAlert: false, // 显示提示组件
        alertText: null, // 提示的内容
        accountType: 'mobile' // 注册方式
      };
    },
    methods: {
      // 判断输入的电话号码
      inputPhone() {
        if (/^1\d{10}$/gi.test(this.phoneNumber)) {
          this.rightPhoneNumber = true;
        } else {
          this.rightPhoneNumber = false;
        }
      },
      // 获取验证码
      async getVerifyCode() {
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          // 倒计时
          this.timer = setInterval(() => {
            this.computedTime--;
            if (this.computedTime === 0) {
              clearInterval(this.timer);
            }
          }, 1000);
          // 判断用户是否存在
          let res = await checkExsis(this.phoneNumber, this.accountType);
          // 判断返回的信息是否正确，用户是否注册
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return;
          } else if (!res.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
            return;
          }
          // 获取验证信息
          let getCode = await mobileCode(this.phoneNumber);
          if (getCode.message) {
            this.showAlert = true;
            this.alertText = getCode.message;
            return;
          }
          this.validate_token = getCode.validate_token;
        }
      },
      // 重置密码
      async resetButton() {
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.alertText = '请输入正确的手机号';
          return;
        } else if (!this.newPassWord) {
          this.showAlert = true;
          this.alertText = '请输入新密码';
          return;
        } else if (!this.confirmPassWord) {
          this.showAlert = true;
          this.alertText = '请输确认密码';
          return;
        } else if (this.newPassWord !== this.confirmPassWord) {
          this.showAlert = true;
          this.alertText = '两次输入的密码不一致';
          return;
        } else if (!this.mobileCode) {
          this.showAlert = true;
          this.alertText = '请输验证码';
          return;
        }
        // 发送重置信息
        let res = await sendMobile(this.phoneNumber, this.mobileCode, this.accountType, this.newPassWord);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
          return;
        } else {
          this.showAlert = true;
          this.alertText = '密码修改成功';
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

  .reset-container
    padding-top: 1.95rem;
    .reset-form
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
          color: #666;
          font-family: Helvetica Neue,Tahoma,Arial;
          padding: .28rem .4rem;
          border: 1px;
          border-radius: 0.15rem;
        .right-phone-number
          background-color: #4cd964;
      .phone-number
        padding: .3rem .8rem;
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
          flex-direction: 'column';
          flex-wrap: wrap;
          width: 2rem;
          justify-content: center;
          p
            font-size: 0.55rem;
            color: #666;
          p:nth-of-type(2)
            color: #3b95e9;
            margin-top: .2rem;
    .login-container
      margin: 1rem .5rem;
      font-size: 0.7rem;
      color: #fff;
      background-color: #4cd964;
      padding: .5rem 0;
      border: 1px;
      border-radius: 0.15rem;
      text-align: center;
</style>
