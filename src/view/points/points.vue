<template>
  <div class="points-page">
    <head-top head-title="我的积分" go-back="true"></head-top>
    <section class="content-container">
      <section class="content">
        <header class="content-header">
          <span class="content-title-style">当前积分</span>
          <section class="content-description">
            <img src="../../assets/images/description.png" height="24" width="24">
            <router-link to="/points/detail" class="content-title-style">积分说明</router-link>
          </section>
        </header>
        <p class="content-num">
          <span>0</span>
          <span>分</span>
        </p>
        <div class="promit-button" @click="usePoint">积分兑换商品</div>
      </section>
    </section>
    <p class="deal-detail">最近30天积分纪录</p>
    <div class="no-log">
      <img src="../../assets/images/no-log.png">
      <p>最近30天无积分纪录</p>
      <p>快去下单赚取大量积分吧</p>
    </div>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';

  export default {
    data() {
      return {
        showAlert: false,
        alertText: null
      };
    },
    methods: {
      usePoint() {
        this.showAlert = true;
        this.alertText = '快去下单赚取大量积分吧';
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

  .points-page
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .content-container
      padding: .3rem;
      background-color: $blue;
      .content
        padding: .4rem;
        background-color: #fff;
        border-radius: .15rem;
        .content-header
          display: flex;
          justify-content: space-between;
          font-size: .55rem;
          .content-description
            display: flex;
            align-items: center;
            img
              width: 0.6rem;
              height: 0.6rem;
              margin-right: .2rem;
            .content-title-style
              color: $blue;
          .content-title-style
            color: #666;
        .content-num
          span:nth-of-type(1)
            font-size: 1.8rem;
            color: #333;
          span:nth-of-type(2)
            font-size: 1.7rem;
            color: #333;
        .promit-button
          width: 100%;
          height: 2rem;
          font-size: 0.8rem;
          color: #fff;
          border-radius: 0.15rem;
          line-height: 2rem;
          margin-top: 1rem;
          text-align: center;
          background-color: #fe6d47;
    .deal-detail
      font-size: 0.6rem;
      color: #999;
      line-height: 2rem;
      padding-left: .5rem;
    .no-log
      text-align: center;
      margin-top: 1rem;
      img
        width: 8rem;
        height: 5rem;
      p
        margin-top: .5rem;
        font-size: 0.7rem;
        color: #666;
      p:nth-of-type(2)
        font-size: 0.5rem;
        color: #999;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
