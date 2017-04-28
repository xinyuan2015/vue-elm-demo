<template>
  <div class="benefit-page">
    <head-top head-title="我的优惠" go-back="true"></head-top>
    <section v-if="!showLoading">
      <section class="category-title">
        <span :class="{choosed: categoryType === 1}" @click="categoryType = 1">红包</span>
        <span :class="{choosed: categoryType === 2}" @click="categoryType = 2">商家代金券</span>
      </section>
      <transition name="router-fade">
        <section v-if="categoryType === 1">
          <section class="hongbao-container">
            <header class="hongbao-title">
              <section class="total-number">
                有 <span>{{hongbaoList.length}}</span> 个红包即将到期
              </section>
              <section class="hongbao-description">
                <img src="../../assets/images/description.png" height="24" width="24">
                <router-link to="/benefit/hbDescription" class="hongbao-detail">红包说明</router-link>
              </section>
            </header>
            <ul class="hongbao-list-ul">
              <li class="hongbao-list-li" v-for="item in hongbaoList" :key="item.id">
                <section class="list-item">
                  <div class="list-item-left">
                    <span>¥</span>
                    <span>{{String(item.amount).split('.')[0]}}</span>
                    <span>.</span>
                    <span>{{String(item.amount).split('.')[1]||0}}</span>
                  </div>
                  <div class="list-item-right">
                    <h4>{{item.name}}</h4>
                    <ul>
                      <li v-for="(descriptions, index) in item.descriptions" :key="index">{{descriptions}}</li>
                    </ul>
                  </div>
                </section>
                <footer class="list-item-footer" v-if="item.extra_limit">
                  <ul>
                    <li v-for="(limit, index) in item.extra_limit" :key="index">
                      {{limit}}
                    </li>
                  </ul>
                </footer>
              </li>
            </ul>
          </section>
          <router-link to="/benefit/hbHistory" class="history-hongbao">
            <span class="check-history">查看历史红包</span>
            <svg class="history-right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </router-link>
          <footer class="hongbao-footer">
            <router-link to="/benefit/exchange" class="hongbao-style" style="border-right: 1px solid #f5f5f5">
              兑换红包
            </router-link>
            <router-link to="/benefit/commend" class="hongbao-style">
              推荐有奖
            </router-link>
          </footer>
        </section>
      </transition>
      <transition name="router-fade">
        <section v-if="categoryType === 2" class="voucher-container">
          <section class="hongbao-description voucher-header">
            <img src="../../assets/images/description.png" height="24" width="24">
            <router-link to="/benefit/coupon" class="hongbao-detail">商家代金券说明</router-link>
          </section>
          <section class="unable-use">
            <img src="../../assets/images/voucher.png" height="170" width="300">
            <p>无法使用代金券</p>
            <p>非客户端或客户端版本过低</p>
            <router-link to="/download" class="download-app">
              下载或升级客户端
            </router-link>
          </section>
        </section>
      </transition>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <loading v-show="showLoading"></loading>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import {getHongbaoNum} from 'service/getData';
  import alertTip from 'components/common/alertTip';
  import loading from 'components/common/loading';

  export default {
    data() {
      return {
        showAlert: false, // 弹出框
        alertText: null, // 弹出框文字
        showLoading: true, // 加载动画
        hongbaoList: null, // 红包列表
        categoryType: 1  // 红包与商家代金券切换
      };
    },
    mounted() {
      this.initData();
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'CLEAR_CART'
      ]),
      async initData() {
        if (this.userInfo) {
          this.hongbaoList = await getHongbaoNum(this.userInfo.user_id);
          this.showLoading = false;
        }
      }
    },
    watch: {
      userInfo: function (value) {
        this.initData();
      }
    },
    components: {
      headTop,
      alertTip,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .benefit-page
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .category-title
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 2rem;
      background-color: #fff;
      span
        text-align: center;
        font-size: 0.65rem;
        color: #333;
        padding-bottom: .2rem;
        border-bottom: 0.1rem solid #fff;
      .choosed
        border-bottom-color: $blue;
        color: $blue;
    .hongbao-description
      display: flex;
      align-items: center;
      img
        width: 0.6rem;
        height: 0.6rem;
        margin-right: .2rem;
      .hongbao_detail
        color: $blue;
    .hongbao-container
      padding: 0 .7rem;
      .hongbao-title
        display: flex;
        justify-content: space-between;
        font-size: .5rem;
        line-height: 2rem;
        .total-number
          color: #666;
          span
            color: #ff5340;
      .hongbao-list-ul
        .hongbao-list-li
          background: #fff url(../../assets/images/hongbao.png) repeat-x ;
          background-size: .5rem .2rem;
          margin-bottom: 0.5rem;
          border-radius: 0.25rem;
          .list-item
            display: flex;
            justify-content: space-between;
            padding: 1rem 0.5rem .8rem;
            .list-item-left
              font-size: 0;
              border-right: 0.025rem dotted #ccc;
              flex: 1;
              span:nth-of-type(1)
                font-size: 0.75rem;
                color: #ff5340;
                font-weight: bold;
              span:nth-of-type(2)
                font-size: 2rem;
                color: #ff5340;
              span:nth-of-type(3), span:nth-of-type(4)
                font-size: 1rem;
                color: #ff5340;
                font-weight: bold;
            .list-item-right
              flex: 2;
              margin-left: 1.5rem;
              h4
                font-size: 0.7rem;
                color: #666;
                margin-left: -.7rem;
              ul
                li
                  list-style-type: disc;
                  font-size: 0.4rem;
                  color: #999;
          .list-item-footer
            background-color: #f9f9f9;
            padding: .4rem .4rem;
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
            ul
              li
                list-style-type: disc;
                font-size: 0.4rem;
                color: #999;
                margin-left: .4rem;
    .history-hongbao
      padding: .5rem 0 2.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .check-history
        font-size: 0.5rem;
        color: #999;
        margin-right: .2rem;
      .history-right
        width: 0.4rem;
        height: 0.4rem;
        fill: #aaa;
    .hongbao-footer
      position: fixed;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      display: flex;
      .hongbao-style
        flex: 1;
        line-height: 2rem;
        text-align: center;
        font-size: 0.7rem;
        color: #555;
    .voucher-container
      .voucher-header
        font-size: .5rem;
        justify-content: flex-end;
        line-height: 2rem;
        margin-right: .5rem;
      .unable-use
        text-align: center;
        margin-top: 4rem;
        img
          width: 6rem;
          height: 3.4rem;
        p:nth-of-type(1)
          font-size: 0.7rem;
          color: #666;
          margin-top: .4rem;
        p:nth-of-type(2)
          font-size: 0.5rem;
          color: #999;
          margin-top: .3rem;
          margin-bottom: .3rem;
        .download-app
          background-color: #56d176;
          font-size: 0.65rem;
          color: #fff;
          padding: .3rem;
          border-radius: .15rem;
    .router-fade-enter-active, .router-fade-leave-active
      transition: opacity .3s;
    .router-fade-enter, .router-fade-leave-active
      opacity: 0;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
