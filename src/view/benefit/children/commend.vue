<template>
  <div class="commend-page">
    <head-top title="推荐有奖" go-back="true"></head-top>
    <section class="activity-banner">
      <img src="../../../assets/images/activity.png">
    </section>
    <section class="invite-firend">
      <div class="invite-firend-style">
        <img src="../../../assets/images/weixin.png" @click="fenxiang">
        <p>邀请微信好友</p>
      </div>
      <div class="invite-firend-style">
        <img src="../../../assets/images/qq.png" @click="fenxiang">
        <p>邀请QQ好友</p>
      </div>
      <div class="invite-firend-style">
        <img src="../../../assets/images/fenxiang.png" @click="fenxiang">
        <p>面对面邀请</p>
      </div>
    </section>
    <section class="invite-num">
      <div class="invite-num-style">
        <p>累计收益</p>
        <p><span>0</span>元</p>
      </div>
      <div class="invite-num-style invite-people">
        <p>成功邀请</p>
        <p><span>0</span>人</p>
      </div>
    </section>
    <p class="income-detail">-收益明细-</p>
    <section class="incom-tips">
      <img src="../../../assets/images/qianbao.png">
      <p>还不赶紧去邀请好友</p>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState} from 'vuex';
  import alertTip from 'components/common/alertTip';

  export default {
    data() {
      return {
        showAlert: false,
        alertText: null
      };
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      fenxiang () {
        this.showAlert = true;
        this.alertText = '请在饿了吗APP中打开';
      }
    },
    components: {
      headTop,
      alertTip
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .commend-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    padding-top: 1.95rem;
    z-index: 203;
    background-color: #f5f5f5;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .activity-banner
      img
        width: 100%;
        height: 10rem;
    .invite-firend
      display: flex;
      padding: 1rem 0;
      background-color: #fff;
      .invite-firend-style
        flex: 1;
        text-align: center;
        img
          width: 2.5rem;
          height: 2.5rem;
        p
          font-size: 0.5rem;
          color: #333;
    .invite-num
      display: flex;
      margin-top: 1rem;
      font-size: 0.5rem;
      color: #666;
      .invite-num-style
        flex: 1;
        text-align: center;
        p
          color: #666;
        span
          font-size: 0.8rem;
          color: #ff5633;
      .invite-people
        border-left: 0.025rem solid #ddd;
        span
          font-size: 0.8rem;
          color: #666;
          font-weight: bold;
    .income-detail
      text-align: center;
      margin-top: 1rem;
      font-size: 0.5rem;
      color: #666;
    .incom-tips
      text-align: center;
      margin-top: 1rem;
      img
        width: 1.3rem;
        height: 1.6rem;
      p
        font-size: 0.5rem;
        color: #999;
</style>
