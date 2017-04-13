<template>
  <div>
    <head-top signin-up="msite">
      <router-link :to="'/search/' + geohash" class="link-search" slot="search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="9" cy="9" r="8" stroke="rgb(255,255,255)" stroke-width="2" fill="none"/>
          <line x1="15" y1="15" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite-title">
        <span class="title-text ellipsis">{{msietTitle}}</span>
      </router-link>
    </head-top>
    <nav class="msite-nav">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide food-types-container" v-for="(item, index) in foodTypes" :key="index">
            <router-link
              :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}"
              v-for="foodItem in item" :key="foodItem.id" class="link-to-food" v-if="foodItem.title !== '预订早餐'">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url">
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </router-link>
            <a href="https://zaocan.ele.me/" class="link-to-food" v-else>
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url">
                <figcaption>{{foodItem.title}}</figcaption>
              </figure>
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <div class="shop-list-container">
      <header class="shop-header">
        <svg class="shop-icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span class="shop-header-title">附近商家</span>
      </header>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>
    <foot-guide></foot-guide>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapMutations} from 'vuex';
  import {imgBaseUrl} from 'config/env';
  import headTop from 'components/header/head';
  import footGuide from 'components/footer/footGuide';
  import shopList from 'components/common/shoplist';
  import {msiteAdress, msiteFoodTypes} from 'service/getData';
  import Swiper from 'swiper';
  import 'assets/css/swiper.min.css';

  export default {
    data() {
      return {
        geohash: '', // city页面传过来的地址geohash
        msietTitle: '请选择地址...', // msiet页面头部标题
        foodTypes: [], // 食品分类列表
        hasGetData: false, // 是否已经获取地理位置数据，成功之后在获取商铺列表信息
        imgBaseUrl // 图片域名地址
      };
    },
    async beforeMount() {
      this.geohash = this.$route.query.geohash || 'wtw3sm0q087';
      // 保存geohash到vuex
      this.SAVE_GEOHASH(this.geohash);
      // 获取位置信息
      let res = await msiteAdress(this.geohash);
      this.msietTitle = res.name;
      // 记录当前经度纬度
      this.RECORD_ADDRESS(res);
      this.hasGetData = true;
    },
    mounted() {
      // 获取导航食品类型列表
      msiteFoodTypes(this.geohash).then(res => {
        let resLength = res.length;
        let resArr = res.concat([]); // 返回一个新的数组
        let foodArr = [];
        for (let i = 0, j = 0; i < resLength; i += 8, j++) {
          foodArr[j] = resArr.splice(0, 8);
        }
        this.foodTypes = foodArr;
      }).then(() => {
        // 初始化swiper
        this.swiper = new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          loop: true
        });
      });
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS',
        'SAVE_GEOHASH'
      ]),
      // 解码url地址，求去restaurant_category_id值
      getCategoryId(url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
        if (/restaurant_category_id/gi.test(urlData)) {
          return JSON.parse(urlData).restaurant_category_id.id;
        } else {
          return '';
        }
      }
    },
    components: {
      headTop,
      shopList,
      footGuide
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  .link-search
    width: 0.8rem;
    height: 0.9rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.8rem;
  .msite-title
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    color: #fff;
    text-align: center;
    margin-left: -0.5rem;
    .title-text
      font-size: 0.8rem;
      color: #fff;
      text-align: center;
      display: block;
  .msite-nav
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    .swiper-container
      width: 100%;
      height: auto;
      padding-bottom: 0.6rem;
      .swiper-pagination
        bottom: 0.2rem;
  .food-types-container
    display:flex;
    flex-wrap: wrap;
    .link-to-food
      width: 25%;
      padding: 0.3rem 0rem;
      display: flex;
      justify-content: center;
      figure
        img
          display: block;
          margin: 0 auto 0.3rem auto;
          width: 1.8rem;
          height: 1.8rem;
        figcaption
          text-align: center;
          font-size: 0.55rem;
          color: #666;
  .shop-list-container
    margin-top: .4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    .shop-header
      .shop-icon
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        width: 0.6rem;
        height: 0.6rem;
      .shop-header-title
        color: #999;
        font-size: 0.55rem;
        line-height: 1.6rem;
        font-family: "Microsoft YaHei";
</style>
