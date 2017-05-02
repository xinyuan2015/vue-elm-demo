<template>
  <div class="exchange-page">
    <head-top head-title="兑换红包" go-back='true'></head-top>
    <form class="exchange-code">
      <input type="text" placeholder="请输入兑换码" v-model="exchangeCode" class="exchange-input">
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
    <div class="determine" @click="exchange" :class="{'active': status}">兑换</div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState} from 'vuex';
  import {getcaptchas, exChangeHongbao} from 'service/getData';
  import alertTip from 'components/common/alertTip';

  export default {
    data() {
      return {
        showAlert: false,
        alertText: null,
        exchangeCode: null,
        codeNumber: '',
        captchaCodeImg: null
      };
    },
    mounted() {
      this.getCaptchaCode();
    },
    computed: {
      ...mapState([
        'userInfo'
      ]),
      status: function () {
        let status = (/^\d+$/gi.test(this.exchangeCode)) && (/^\w{4}$/gi.test(this.codeNumber));
        return status;
      }
    },
    methods: {
      // 线上环境采用固定的图片，编译环境获取真实的验证码
      async getCaptchaCode() {
        if (process.env.NODE_ENV === 'development') {
          this.captchaCodeImg = 'http://test.fe.ptdev.cn/elm/yzm.jpg';
        } else {
          let res = await getcaptchas();
          this.captchaCodeImg = 'https://mainsite-restapi.ele.me/v1/captchas/' + res.code;
        }
      },
      // 兑换红包
      async exchange() {
        if (this.status) {
          let res = await exChangeHongbao(this.userInfo.user_id, this.exchangeCode, this.codeNumber);
          // 不成功则弹出提示框
          if (res.message) {
            this.getCaptchaCode();
            this.showAlert = true;
            this.alertText = res.message;
          }
        }
      }
    },
    components: {
      headTop,
      alertTip
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .exchange-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding-top: 1.95rem;
    z-index: 203;
    background-color: #f1f1f1;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .determine
      background-color: #ccc;
      font-size: 0.7rem;
      color: #fff;
      text-align: center;
      margin: 0 .7rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
      margin-top: 0.7rem;
    .active
      background-color: #4cd964;
    .exchange-code
      margin-top: 0.7rem;
      padding: 0 .5rem;
      .exchange-input
        width: 100%;
        font-size: 0.7rem;
        color: #666;
        padding: .6rem .4rem;
        border-radius: .15rem;
    .captcha-code-container
      height: 2.2rem;
      display: flex;
      margin-top: .7rem;
      input
        font-size: 0.7rem;
        color: #666;
        padding: .4rem;
        border-radius: .15rem;
        flex: 3;
      .img-change-img
        display: flex;
        align-items: center;
        flex: 2;
        margin-left: .3rem;
        background-color: #fff;
        padding-left: .2rem;
        border-radius: .15rem;
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
</style>
