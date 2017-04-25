<template>
  <div class="payment-page">
    <head-top head-title="在线支付" go-back="true"></head-top>
    <section class="show-time-amount">
      <section>
        <header class="time-last">支付剩余时间</header>
        <p class="time">{{remaining}}</p>
        <footer class="order-detail" v-if="payDetail.resultData">
          <span>详情</span>
          <span>¥ {{cartPrice&&cartPrice.toFixed(2) || payDetail.resultData.orderInfo.orderAmount&&(payDetail.resultData.orderInfo.orderAmount/100).toFixed(2)}}</span>
        </footer>
      </section>
    </section>
    <div class="pay-way">选择支付方式</div>
    <section class="pay-way-list">
      <section class="pay-item">
        <div class="pay-icon-container">
          <div class="zhifubao"></div>
          <span>支付宝</span>
        </div>
        <svg class="choose-icon" @click="payWay = 1" :class="{choosed_way: payWay == 1}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
      <section class="pay-item">
        <div class="pay-icon-contaienr">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
          </svg>
          <span>微信</span>
        </div>
        <svg class="choose-icon" @click="payWay = 2" :class="{choosed_way: payWay == 2}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
    </section>
    <p class="determine" @click="confrimPay">确认支付</p>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import {payRequest} from 'service/getData';
  import alertTip from 'components/common/alertTip';

  export default {
    data() {
      return {
        payDetail: false, // 付款信息详情
        showAlert: false,
        alertText: null,
        payWay: 1, // 付款方式
        countNum: 900, // 倒计时15分钟
        gotoOrders: false // 去付款
      };
    },
    mounted() {
      this.remainingTime();
    },
    created() {
      this.initData();
      // 清除购物车当前商铺信息
      if (this.shopid) {
        this.CLEAR_CART(this.shopid);
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    computed: {
      ...mapState([
        'orderMessage', 'userInfo', 'shopid', 'cartPrice'
      ]),
      // 时间转换
      remaining: function () {
        let minute = parseInt(this.countNum / 60);
        if (minute < 10) {
          minute = '0' + minute;
        }
        let second = parseInt(this.countNum % 60);
        if (second < 10) {
          second = '0' + second;
        }
        return '00 : ' + minute + ' : ' + second;
      }
    },
    methods: {
      ...mapMutations([
        'CONFIRM_INVOICE', 'CLEAR_CART'
      ]),
      // 初始化信息
      async initData() {
        this.payDetail = await payRequest(this.orderMessage.order_id, this.userInfo.user_id);
        if (this.payDetail.message) {
          this.showAlert = true;
          this.alertText = this.payDetail.message;
          return;
        }
      },
      // 倒计时
      remainingTime() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.countNum--;
          if (this.countNum === 0) {
            clearInterval(this.timer);
            this.showAlert = true;
            this.alertText = '支付超时';
          }
        }, 1000);
      },
      // 确认付款
      confrimPay() {
        this.showAlert = true;
        this.alertText = '当前环境无法支付，请打开官方APP进行付款';
        this.gotoOrders = true;
      },
      // 关闭提示框，跳转到订单列表页
      closeTipFun() {
        this.showAlert = false;
        if (this.gotoOrders) {
          this.$router.push('/order');
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
  @import "../../../assets/stylus/mixin.styl";

  .payment-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .show-time-amount
      background-color: #fff;
      padding: .7rem;
      text-align: center;
      .time-last
        font-size: 0.6rem;
        color: #666;
        margin-top: 1rem;
      .time
        font-size: 1.5rem;
        color: #333;
        margin: .3rem 0 1rem;
      .order-detail
        display: flex;
        justify-content: space-between;
        span
          font-size: 0.65rem;
          color: #666;
        span:nth-of-type(2)
          color: #ff6000;
          font-weight: bold;
    .pay-way
      background-color: #f1f1f1;
      padding: 0 .7rem;
      font-size: 0.7rem;
      color: #666;
      line-height: 1.8rem;
    .pay-way-list
      background-color: #fff;
      .pay-item
        padding: .4rem .7rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2.6rem;
        border-bottom: 0.025rem solid #f5f5f5;
        .pay-icon-contaienr
          display: flex;
          justify-content: space-between;
          align-items: center;
          .zhifubao
            width: 2rem;
            height: 2rem;
            background: url(../../../assets/images/zhifubao.png) no-repeat;
            background-size: 100% 100%;
            margin-right: .2rem;
          svg
            width: 2rem;
            height: 2rem;
            margin-right: .3rem;
          span
            font-size: 0.7rem;
            color: #666;
        .choose-icon
          width: 1rem;
          height: 1rem;
          fill: #ccc;
        .choosed-way
          fill: #4cd964;
    .determine
      background-color: #4cd964;
      font-size: 0.7rem;
      color: #fff;
      text-align: center;
      margin: 0 .7rem;
      line-height: 1.8rem;
      border-radius: 0.2rem;
      margin-top: 0.5rem;
      font-weight: bold;
</style>
