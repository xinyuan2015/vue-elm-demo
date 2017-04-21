<template>
  <div class="order-detail-page">
    <head-top head-title="订单详情" go-back="true"></head-top>
    <section v-if="!showLoading" id="scroll-section" class="scroll-container">
      <section class="scroll-insert">
        <section class="order-title">
          <img :src="orderDetail.restaurant_image_url">
          <p>{{orderDetail.status_bar.title}}</p>
          <p>{{orderDetail.timeline_node.description}}</p>
          <router-link class="order-again" :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">再来一单</router-link>
        </section>
        <section class="food-list">
          <router-link class="food-list-header" :to="{path: '/shop', query: {geohash, id: orderDetail.restaurant_id}}">
            <div class="shop-name">
              <img :src="orderDetail.restaurant_image_url">
              <span>{{orderDetail.restaurant_name}}</span>
            </div>
            <svg fill="#333" class="arrow-right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </router-link>
          <ul class="food-list-ul">
            <li v-for="item in orderDetail.basket.group[0]">
              <p class="food-name ellipsis">{{item.name}}</p>
              <div class="quantity-price">
                <span>X{{item.quantity}}</span>
                <span>￥{{item.price}}</span>
              </div>
            </li>
          </ul>
          <div class="deliver-fee">
            <span>配送费</span>
            <span>{{orderDetail.basket.deliver_fee&&orderDetail.basket.deliver_fee.price || 0}}</span>
          </div>
          <div class="pay-ment">实付{{orderDetail.total_amount.toFixed(2)}}</div>
        </section>
        <section class="order-detail-style">
          <header>配送信息</header>
          <section class="item-style">
            <p class="item-left">送达时间：</p>
            <div class="item-right">
              <p>{{orderData.deliver_time}}</p>
            </div>
          </section>
          <section class="item-style">
            <p class="item-left">送货地址：</p>
            <div class="item-right">
              <p>{{orderData.consignee}}</p>
              <p>{{orderData.phone}}</p>
              <p>{{orderData.address}}</p>
            </div>
          </section>
          <section class="item-style">
            <p class="item-left">配送方式：</p>
            <div class="item-right">
              <p>蜂鸟专送</p>
            </div>
          </section>
        </section>
        <section class="order-detail-style">
          <header>订单信息</header>
          <section class="item-style">
            <p class="item-left">订单号：</p>
            <div class="item-right">
              <p>{{orderDetail.id}}</p>
            </div>
          </section>
          <section class="item-style">
            <p class="item-left">支付方式：</p>
            <div class="item-right">
              <p>在线支付</p>
            </div>
          </section>
          <section class="item-style">
            <p class="item-left">下单时间：</p>
            <div class="item-right">
              <p>{{orderDetail.formatted_created_at}}</p>
            </div>
          </section>
        </section>
      </section>
    </section>
    <transition name="loading">
      <loading v-if="showLoading"></loading>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import headTop from 'components/header/head';
  import loading from 'components/common/loading';
  import BScroll from 'better-scroll';
  import {getOrderDetail} from 'service/getData';
  import {getImgPath} from 'components/common/mixin';

  export default {
    data() {
      return {
        showLoading: true,
        orderData: null
      };
    },
    mixins: [getImgPath],
    mounted() {
      this.initData();
    },
    computed: {
      ...mapState([
        'orderDetail',
        'geohash',
        'userInfo'
      ])
    },
    methods: {
      async initData() {
        if (this.userInfo && this.userInfo.user_id) {
          this.orderData = await getOrderDetail(this.userInfo.user_id, this.orderDetail.unique_id);
          this.showLoading = false;
          this.$nextTick(() => {
            this.scroll = new BScroll('#scroll-section', {
              deceleration: 0.001,
              bounce: true,
              swipeTime: 1800,
              click: true
            });
          });
        }
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initData();
        }
      }
    },
    components: {
      headTop,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .order-detail-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1f1f1;
    z-index: 202;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .scroll-container
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-top: 1.95rem;
      .scroll-insert
        padding-bottom: 3rem;
        .order-title
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: .7rem;
          background-color: #fff;
          margin-bottom: 0.5rem;
          img
            border: 0.4rem solid $blue;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
          p:nth-of-type(1)
            font-size: 0.9rem;
            color: #333;
            font-weight: bold;
            margin-top: .4rem;
          p:nth-of-type(2)
            font-size: 0.55rem;
            color: #999;
            width: 10rem;
            margin-top: .3rem;
            text-align: center;
          .order-again
            font-size: 0.6rem;
            color: $blue;
            margin-top: .5rem;
            border: 0.025rem solid $blue;
            padding: .15rem .4rem;
            border-radius: .1rem;
        .food-list
          background-color: #fff;
          .food-list-header
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.2rem 0.5rem;
            border-bottom: 1px solid #f5f5f5;
            .shop-name
              img
                width: 1.2rem;
                height: 1.2rem;
                vertical-align: middle;
                margin-right: 0.2rem;
              span
                font-size: 0.75rem;
                color: #333;
                font-weight: bold;
            svg
              width: 0.6rem;
              height: 0.6rem;
              fill: #666;
          .food-list-ul
            li
              display: flex;
              justify-content: space-around;
              align-items: center;
              padding: 0 0.5rem;
              line-height: 2rem;
              .food-name
                font-size: 0.6rem;
                color: #666;
                flex: 4;
              .quantity-price
                flex: 1;
                display: flex;
                justify-content: space-around;
                align-items: center;
                span:nth-of-type(1)
                  font-size: 0.6rem;
                  color: #666;
                span:nth-of-type(2)
                  font-size: 0.6rem;
                  color: #666;
          .deliver-fee
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 .5rem;
            line-height: 2rem;
            border-top: 1px solid #f5f5f5;
            span
              font-size: 0.6rem;
              color: #666;
          .pay-ment
            font-size: 0.6rem;
            color: #fb6b23;
            border-top: 1px solid #f5f5f5;
            font-weight: bold;
            line-height: 2rem;
            text-align: right;
            padding-right: .5rem;
        .order-detail-style
          background-color: #fff;
          margin-top: 0.5rem;
          header
            font-size: 0.75rem;
            color: #333;
            padding: .5rem;
            border-bottom: 1px solid #f5f5f5;
          .item-style
            display: flex;
            padding: .5rem;
            p
              font-size: 0.65rem;
              color: #666;
              line-height: 1rem;
    .loading-enter-active, .loading-leave-active
      transition: opacity .7s
    .loading-enter, .loading-leave-active
      opacity: 0
</style>
