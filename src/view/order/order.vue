<template>
  <div class="order-page">
    <head-top head-title="订单列表" go-back="true"></head-top>
    <ul class="order-list-ul" v-load-more="loaderMore">
      <li class="order-list-li" v-for="item in orderList" :key="item.id">
        <img :src="item.restaurant_image_url" class="restaurant-image">
        <section class="order-item-right">
          <section @click="showDetail(item)">
            <header class="order-item-right-header">
              <section class="order-header">
                <h4>
                  <span class="ellipsis">{{item.restaurant_name}}</span>
                  <svg fill="#333" class="arrow-right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
                </h4>
                <p class="order-time">{{item.formatted_created_at}}</p>
              </section>
              <p class="order-status">{{item.status_bar.title}}</p>
            </header>
            <section class="order-basket">
              <p class="order-name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}</p>
              <p class="order-amount">¥{{item.total_amount.toFixed(2)}}</p>
            </section>
          </section>
          <div class="order-again">
            <compute-time v-if="item.status_bar.title == '等待支付'" :time="item.formatted_created_at"></compute-time>
            <router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_di}}" tag="span" class="buy-again" v-else>再来一单</router-link>
          </div>
        </section>
      </li>
    </ul>
    <foot-guide></foot-guide>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapMutations} from 'vuex';
  import headTop from 'components/header/head';
  import computeTime from 'components/common/computeTime';
  import loading from 'components/common/loading';
  import footGuide from 'components/footer/footGuide';
  import {getOrderList} from 'service/getData';
  import {loadMore} from 'components/common/mixin';

  export default {
    data() {
      return {
        orderList: null, // 订单列表
        offset: 0,
        preventRepeat: false, // 防止重复获取
        showLoading: true // 显示加载动画
      };
    },
    mixins: [loadMore],
    mounted() {
      this.initData();
    },
    computed: {
      ...mapState([
        'userInfo',
        'geohash'
      ])
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER'
      ]),
      // 初始化获取信息
      async initData() {
        if (this.userInfo && this.userInfo.user_id) {
          let res = await getOrderList(this.userInfo.user_id, this.offset);
          this.orderList = [...res];
          this.hideLoading();
        }
      },
      // 加载更多
      async loaderMore() {
        if (this.preventRepeat) {
          return;
        }
        this.preventRepeat = true;
        this.showLoading = true;
        this.offset += 10;
        // 获取信息
        let res = await getOrderList(this.userInfo.user_id, this.offset);
        this.orderList = [...this.orderList, ...res];
        this.hideLoading();
        if (res.length < 10) {
          return;
        }
        this.preventRepeat = false;
      },
      // 显示详情页
      showDetail(item) {
        this.SAVE_ORDER(item);
        this.preventRepeat = false;
        this.$router.push('order/orderDetail');
      },
      // 生产环境与发布环境隐藏loading方式不同
      hideLoading() {
        if (process.env.NODE_ENV !== 'development') {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.showLoading = false;
          }, 400);
        } else {
          this.showLoading = false;
        }
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id && !this.orderList) {
          this.initData();
        }
      }
    },
    components: {
      headTop,
      footGuide,
      loading,
      computeTime
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .order-page
    background-color: #f1f1f1;
    padding-bottom: 1.95rem;
    p, span, h4
      font-family: Helvetica Neue,Tahoma,Arial;
    .order-list-ul
      padding-top: 1.95rem;
      .order-list-li
        background-color: #fff;
        display: flex;
        margin-bottom: 0.5rem;
        padding: .6rem .6rem 0;
        .restaurant-image
          width: 2rem;
          height: 2rem;
          margin-right: 0.4rem;
        .order-item-right
          flex: 5;
          .order-item-right-header
            border-bottom: 0.025rem solid #f5f5f5;
            padding-bottom: 0.3rem;
            display: flex;
            justify-content: space-between;
            .order-header
              h4
                display: flex;
                align-items: center;
                justify-content: flex-start;
                font-size: 0.75rem;
                color: #333;
                line-height: 1rem;
                width: 9rem;
                .arrow-right
                  width: 0.4rem;
                  height: 0.4rem;
                  fill: #ccc;
                  margin-right: 0.2rem;
              .order-time
                font-size: 0.55rem;
                color: #999;
                line-height: 0.8rem;
            .order-status
              font-size: 0.6rem;
              color: #333;
          .order-basket
            display: flex;
            justify-content: space-between;
            line-height: 2rem;
            border: 0.025rem solid #f5f5f5;
            .order-name
              font-size: 0.6rem;
              color: #666;
              width: 10rem;
            .order-amount
              font-size: 0.6rem;
              color: #f60;
              font-weight: bold;
          .order-again
            text-align: right;
            line-height: 1.6rem;
            .buy-again
              font-size: 0.55rem;
              color: #3190e8;
              border: 0.025rem solid #3190e8;
              padding: .1rem .2rem;
              border-radius: .15rem;
    .loading-enter-active, .loading-leave-active
      transition: opacity .7s
    .loading-enter, .loading-leave-active
      opacity: 0
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
