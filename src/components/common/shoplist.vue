<template>
  <div class="shoplist-container">
    <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
      <router-link :to="{path: 'path', query:{geohash, id: item.id}}" v-for="item in shopListArr" tag="li"
                   :key="item.id" class="shop-li">
        <section>
          <img :src="getImgPath(item.image_path)" class="shop-img">
        </section>
        <hgroup class="shop-right">
          <header class="shop-detail-header">
            <h4 :class="item.is_premium?'premium':''" class="shop-title ellipsis">{{item.name}}</h4>
            <ul class="shop-detail-ul">
              <li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
            </ul>
          </header>
          <h5 class="rating-order-num">
            <section class="rating-order-num-left">
              <section class="rating-section">
                <rating-star :rating="item.rating"></rating-star>
                <span class="rating-num">{{item.rating}}</span>
              </section>
              <section class="order-section">
                月售{{item.recent_order_num}}单
              </section>
            </section>
            <section class="rating-order-num-right" v-if="item.delivery_mode">
              <span class="delivery-style delivery-left">{{item.delivery_mode.text}}</span>
              <span class="delivery-style delivery-right">准时达</span>
            </section>
          </h5>
          <h5 class="fee-distance">
            <section class="fee">
              ￥{{item.float_minimun_order_amount}}起送
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
            </section>
            <section class="distance-time">
              <span>{{item.distance>1000?(item.distance/1000).toFixed(2)+'km':item.diatance+'m'}}
                <span class="segmentation">/</span>
              </span>
              <span class="order-item">{{item.order_lead_time}}</span>
            </section>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <p v-else class="empty-data">没有更多了</p>
    <aside class="return-top" @click="backTop" v-if="showBackStatus">
      <svg class="back-top-svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>
    <footer class="loader-more" v-show="preventRepeatReuqest">正在加载更多商家...</footer>
    <div ref="abc" style="background-color: red;"></div>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex';
  import {shopList} from 'service/getData';
  import {showBack, animate} from 'tool/mUtils';
  import {loadMore, getImgPath} from './mixin';
  import loading from './loading.vue';
  import ratingStar from './ratingStar';

  export default {
    props: [
      'restaurantCategoryId',
      'restaurantCategoryIds',
      'sortByType',
      'deliveryMode',
      'supportIds',
      'confirmSelect',
      'geohash'
    ],
    data() {
      return {
        offset: 0, // 批次架子啊店铺列表。每次加载20个 limit=20
        shopListArr: [], // 店铺列表数据
        preventRepeatReuqest: false, // 到达底部加载数据，防止重复加载
        showBackStatus: false, // 显示返回顶部按钮
        showLoading: true // 显示加载动画
      };
    },
    mixins: [loadMore, getImgPath],
    mounted() {
      this.initData();
    },
    computed: {
      ...mapState([
        'latitude',
        'longitude'
      ])
    },
    methods: {
      async initData() {
        // 获取数据
        let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
        this.shopListArr = [...res];
        this.hideLoading();
        // 开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
        showBack(status => {
          this.showBackStatus = status;
        });
      },
      // 到达底部加载更多数据
      async loaderMore() {
        // 防止重复请求
        if (this.preventRepeatReuqest) {
          return;
        }
        this.showLoading = true;
        this.preventRepeatReuqest = true;

        // 数据的定位加20位
        this.offset += 20;
        let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId);
        this.hideLoading();
        this.shopListArr = [...this.shopListArr, ...res];
        // 当获取数据小于20，说明没有更多数据，不需要再次请求数据
        if (res.length < 20) {
          return;
        }
        this.preventRepeatReuqest = false;
      },
      // 返回顶部
      backTop() {
        animate(document.body, {scrollTop: '0'}, 400, 'ease-out');
      },
      // 监听父级传来的数据发生变化事，触发此函数重新根据属性值获取数据
      async listenPropChange() {
        this.showLoading = true;
        this.offset = 0;
        let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds);
        this.hideLoading();
        // 考虑到本地模拟数据是引用类型，所以返回一个新的数组
        this.shopListArr = [...res];
        if (process.env.NODE_ENV !== 'development') {
          this.shopListArr = this.shopListArr.reverse();
        }
      },
      // 开发环境与编译环境loading隐藏方式不同
      hideLoading() {
        if (process.env.NODE_ENV !== 'development') {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.showLoading = false;
          }, 500);
        } else {
          this.showLoading = false;
        }
      }
    },
    watch: {
      // 监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
      restaurantCategoryIds: function (value) {
        this.listenPropChange();
      },
      // 监听父级传来的排序方式
      sortByType: function (value) {
        this.listenPropChange();
      },
      // 监听父级的确认按钮是否被点击，并且返回一个自定义事件通知父级，已经接收到数据，此时父级才可以清除已选状态
      confirmSelect: function (value) {
        this.listenPropChange();
        this.$emit('DidConfrim');
      }
    },
    components: {
      loading,
      ratingStar
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .shoplist-container
    background-color: #fff;
    padding-bottom: 2rem;

  .shop-li
    display: flex;
    border-bottom: 0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;

  .shop-img
    width: 2.7rem;
    height: 2.7rem;
    display: block;
    margin-right: 0.4rem;

  .shop-right
    flex: auto;
    .shop-detail-header
      display: flex;
      justify-content: space-between;
      align-items: center;
      .shop-title
        width: 8.5rem;
        color: #333;
        padding-top: .01rem;
        font-size: 0.65rem;
        line-height: 0.65rem;
        font-family: 'PingFangSC-Regular';
        font-weight: 700;
      .premiun::before
        content: '品牌';
        display: inline-block;
        font-size: 0.5rem;
        line-height: .6rem;
        background-color: #ffd930;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
        vertical-align: top;
      .shop-detail-ul
        display: flex;
        .supports
          font-size: 0.5rem;
          color: #999;
          border: 0.025rem solid #f1f1f1;
          padding: 0.04rem;
          border-radius: 0.08rem;
          margin-left: 0.05rem;
    .rating-order-num
      display: flex;
      justify-content: space-between;
      height: 0.6rem;
      margin-top: 0.52rem;
      .rating-order-num-left
        display: flex;
        justify-content: flex-start;
        .rating-section
          display: flex;
          .rating-num
            font-size: 0.4rem;
            color: #ff6000;
            margin: 0 0.2rem;
        .order-section
          font-size: 0.4rem;
          color: #666;
      .rating-order-num-right
        display: flex;
        align-items: center;
        .delivery-style
          font-size: 0.4rem;
          padding: 0.04rem 0.08rem 0;
          border-radius: 0.08rem;
          margin-left: 0.08rem;
          border: 1px;
        .delivery-left
          color: #fff;
          background-color: $blue;
          border: 0.025rem solid $blue;
        .delivery-right
          color: $blue;
          border: 0.025rem solid $blue;
    .fee_distance
      margin-top: 0.52rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.5rem;
      color: #666;
      .fee
        font-size: 0.5rem;
        color: #666;
      .distance_time
        span
          color: #999;
        .order_time
          color: $blue;
        .segmentation
          color: #ccc;

  .loader_more
    font-size: 0.6rem;
    line-height: 3rem;
    font-family: "Microsoft YaHei";
    text-align: center;
    color: #999;

  .empty_data
    font-size: 0.5rem;
    color: #666;
    text-align: center;
    line-height: 2rem;

  .return_top
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    .back_top_svg
      width: 2rem;
      height: 2rem;

  .loading-enter-active, .loading-leave-active
    transition: opacity 1s;

  .loading-enter, .loading-leave-active
    opacity: 0;
</style>
