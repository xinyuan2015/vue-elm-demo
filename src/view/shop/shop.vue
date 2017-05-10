<template>
  <div class="shop-page">
    <section v-if="!showLoading" class="shop-container">
      <shop-header :shop-detail-data="shopDetailData"></shop-header>
      <section class="change-show-type">
        <div>
          <span :class="{'activity-show': changeShowType =='food'}" @click="changeShowType='food'">商品</span>
        </div>
        <div>
          <span :class="{'activity-show': changeShowType =='rating'}" @click="changeShowType='rating'">评价</span>
        </div>
      </section>
      <transition name="fade-choose">
        <section v-show="changeShowType =='food'" class="food-container">
          <shop-food :menu-list="menuList" :shop-detail-data="shopDetailData" :shop-id="shopId" :geohash="geohash"></shop-food>
        </section>
      </transition>
      <transition name="fade-choose">
        <section v-show="changeShowType =='rating'" class="rating-container" id="ratingContainer">
          <shop-rating></shop-rating>
        </section>
      </transition>
    </section>
    <loading v-show="showLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import loading from 'components/common/loading';
  import shopHeader from '../shop/shopHeader.vue';
  import shopFood from '../shop/shopFood.vue';
  import shopRating from '../shop/shopRating.vue';
  import {mapState, mapMutations} from 'vuex';
  import {msiteAdress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from 'service/getData';

  export default {
    data() {
      return {
        geohash: '',  // geohash位置信息
        shopId: null, // 商店id
        showLoading: true, // 显示加载动画
        shopDetailData: null, // 商铺详情
        changeShowType: 'food', // 切换显示商品或者评价
        ratingOffset: 0, // 评价获取数据offset值
        menuList: [] // 食品列表
      };
    },
    created() {
      this.geohash = this.$route.query.geohash;
      this.shopId = this.$route.query.id;
      this.INIT_BUYCART();
    },
    mounted() {
      this.initData();
      this.windowHeight = window.innerHeight;
    },
    computed: {
      ...mapState([
        'latitude',
        'longitude',
        'cartList'
      ])
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS',
        'ADD_CART',
        'REDUCE_CART',
        'INIT_BUYCART',
        'CLEAR_CART',
        'RECORD_SHOPDETAIL'
      ]),
      // 初始化时获取基本数据
      async initData () {
        if (!this.latitude) {
          // 获取位置信息
          let res = await msiteAdress(this.geohash);
          // 记录当前经度纬度进入vuex
          this.RECORD_ADDRESS(res);
        }
        // 获取商铺信息
        this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude);
        // 获取商铺食品列表
        this.menuList = await foodMenu(this.shopId);
        // 评论列表
        this.ratingList = await getRatingList(this.ratingOffset);
        // 商铺评论详情
        this.ratingScoresData = await ratingScores(this.shopId);
        // 评论Tag列表
        this.ratingTagsList = await ratingTags(this.shopId);
        this.RECORD_SHOPDETAIL(this.shopDetailData);
        // 隐藏加载动画
        this.hideLoading();
      },
      // 隐藏动画
      hideLoading() {
        if (process.env.NODE_ENV !== 'development') {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.showLoading = false;
          }, 600);
        } else {
          this.showLoading = false;
        }
      }
    },
    watch: {
    },
    components: {
      loading,
      shopHeader,
      shopFood,
      shopRating
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .shop-page
    .shop-container
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      left: 0;
      height: 100%;
    .change-show-type
      display: flex;
      background-color: #fff;
      padding: .3rem 0 .6rem;
      border-bottom: 1px solid #ebebeb;
      div
        flex: 1;
        text-align: center;
        span
          font-size: 0.65rem;
          color: #666;
          padding: .2rem .1rem;
          border-bottom: 0.12rem solid #fff;
        .activity-show
          color: #3190e8;
          border-color: #3190e8;
    .food-container
      display: flex;
      flex: 1;
      padding-bottom: 2rem;
    .fade-enter-active, .fade-leave-active
      transition: opacity .5s;
    .fade-enter, .fade-leave-active
      opacity: 0;
    .fade-choose-enter-active, .fade-choose-leave-active
      transition: opacity .5s;
    .fade-choose-leave, .fade-choose-leave-active
      display: none;
    .fade-choose-enter, .fade-choose-leave-active
      opacity: 0;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
    .toggle-cart-enter-active, .toggle-cart-leave-active
      transition: all .3s ease-out;
    .toggle-cart-enter, .toggle-cart-leave-active
      transform: translateY(100%);
</style>
