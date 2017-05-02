<template>
  <div class="vip-page">
    <head-top head-title="会员中心" go-back="true"></head-top>
    <section v-if="userInfo">
      <p class="buy-for">为账户 <span>{{userInfo.username}}</span> 购买会员</p>
      <section class="vip-prerogative">
        <router-link to="/vipcard/vipDescription" class="header-style">
          <span class="header-left">会员特权</span>
          <section class="header-right">
            <span>会员说明</span>
            <svg fill="#ccc">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </section>
        </router-link>
        <section class="vip-detail">
          <div class="vip-detail-left">
            <img src="../../assets/images/sheng.jpeg" height="80" width="70">
          </div>
          <div class="vip-detail-right">
            <h4>减免配送费</h4>
            <p>每月减免30单，每日可减免3单，每单最高减4元</p>
            <p>蜂鸟专送专享</p>
          </div>
        </section>
        <section class="vip-detail">
          <div class="vip-detail-left">
            <img src="../../assets/images/jifen.jpeg" height="80" width="70">
          </div>
          <div class="vip-detail-right">
            <h4>减免配送费</h4>
            <p>每月减免30单，每日可减免3单，每单最高减4元</p>
            <p>蜂鸟专送专享</p>
          </div>
        </section>
      </section>
      <section class="apply-vip">
        <header class="header-style">
          <span class="header-left">开通会员</span>
        </header>
        <section class="apply-vip-buy">
          <div class="apply-vip-buy-left">
            <span>1个月</span>
            <span> ¥20</span>
          </div>
          <div class="apply-vip-buy-right" @click="buyCart">购买</div>
        </section>
      </section>
      <router-link to="/vipcard/useCart" class="header-style common-style">
        <span class="header-left">兑换会员</span>
        <section class="header-right">
          <span>使用卡号卡密</span>
          <svg fill="#ccc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
          </svg>
        </section>
      </router-link>
      <router-link to="/vipcard/invoiceRecord" class="header-style common-style">
        <span class="header-left">购买记录</span>
        <section class="header-right">
          <span>开发票</span>
          <svg fill="#ccc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
          </svg>
        </section>
      </router-link>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState, mapMutations} from 'vuex';

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'ORDER_SUCCESS', 'BUY_CART'
      ]),
      buyCart() {
        this.ORDER_SUCCESS({order_id: '399525134200981325'});
        this.BUY_CART(20);
        this.$router.push('/confirmOrder/payment');
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vip-page
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .buy-for
      font-size: 0.6rem;
      color: #666;
      line-height: 2rem;
      padding-left: 0.7rem;
      span
        font-weight: bold;
    .vip-prerogative
      background-color: #fff;
      padding-left: .7rem;
      margin-bottom: 0.5rem;
      .vip-detail
        display: flex;
        border-bottom: 1px solid #f5f5f5;
        padding: .8rem 0;
        .vip-detail-left
          margin-right: .6rem;
          img
            width: 1.6rem;
            height: 1.8rem;
        .vip-detail-right
          h4
            font-size: 0.7rem;
            color: #333;
            font-weight: normal;
          p
            font-size: 0.5rem;
            color: #999;
    .apply-vip
      background-color: #fff;
      padding-left: .7rem;
      margin-bottom: 0.5rem;
      .apply-vip-buy
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: .7rem;
        font-size: .7rem;
        line-height: 2.6rem;
        .apply-vip-buy-left
          span:nth-of-type(2)
            font-weight: bold;
            color: #f60;
        .apply-vip-buy-right
          border: 0.025rem solid #f60;
          border-radius: 0.2rem;
          line-height: 1.2rem;
          height: 1.2rem;
          width: 2.6rem;
          text-align: center;
          font-size: 0.6rem;
          color: #f60;
    .header-style
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      line-height: 2rem;
      border-bottom: 1px solid #f5f5f5;
      padding-right: .7rem;
      .header-left
        font-size: 0.7rem;
        color: #333;
      .header-right
        display: flex;
        align-items: center;
        span
          font-size: 0.6rem;
          color: #999;
          margin-right: .2rem;
        svg
          width: 0.5rem;
          height: 0.5rem;
    .common-style
      padding: 0 .7rem;
      margin-bottom: 0.5rem;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
