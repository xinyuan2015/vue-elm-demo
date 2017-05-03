<template>
  <div class="shop-header-page">
    <header class="shop-detail-header" :style="{zIndex: showActivities? '14':'10'}">
      <img :src="getImgPath(shopDetailData.image_path)" class="header-cover-img">
      <section class="description-header">
        <router-link to="/shop/shopDetail" class="description-top">
          <section class="description-left">
            <img :src="getImgPath(shopDetailData.image_path)">
          </section>
          <section class="description-right">
            <h4 class="description-title ellipsis">{{shopDetailData.name}}</h4>
            <p class="description-text">
              商家配送／{{shopDetailData.order_lead_time}}分钟送达／配送费¥{{shopDetailData.float_delivery_fee}}</p>
            <p class="description-promotion ellipsis">公告：{{promotionInfo}}</p>
          </section>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description-arrow">
            <path d="M0 0 L8 7 L0 14" stroke="#fff" stroke-width="1" fill="none"/>
          </svg>
        </router-link>
        <footer class="description-footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
          <p class="ellipsis">
            <span class="tip-icon"
                  :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
            <span>{{shopDetailData.activities[0].description}}（APP专享）</span>
          </p>
          <p>{{shopDetailData.activities.length}}个活动</p>
          <svg class="footer-arrow">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
          </svg>
        </footer>
      </section>
    </header>
    <transition name="fade">
      <section class="activities-details" v-if="showActivities">
        <h2 class="activities-shoptitle">{{shopDetailData.name}}</h2>
        <h3 class="activities-ratingstar">
          <rating-star :rating='shopDetailData.rating'></rating-star>
        </h3>
        <section class="activities-list">
          <header class="activities-title-style"><span>优惠信息</span></header>
          <ul>
            <li v-for="item in shopDetailData.activities" :key="item.id">
              <span class="activities-icon"
                    :style="{backgroundColor: '#' + item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
              <span>{{item.description}}（APP专享）</span>
            </li>
          </ul>
        </section>
        <section class="activities-shopinfo">
          <header class="activities-title-style"><span>商家公告</span></header>
          <p>{{promotionInfo}}</p>
        </section>
        <svg width="60" height="60" class="close-activities" @click.stop="showActivitiesFun">
          <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
          <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
          <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
        </svg>
      </section>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getImgPath} from 'components/common/mixin';
  import ratingStar from 'components/common/ratingStar';

  export default {
    props: {
      shopDetailData: {
        type: Object
      }
    },
    data() {
      return {
        showActivities: false // 是否显示活动详情
      };
    },
    mixins: [getImgPath],
    computed: {
      promotionInfo: function () {
        return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢';
      }
    },
    methods: {
      // 控制活动详情页的显示隐藏
      showActivitiesFun() {
        this.showActivities = !this.showActivities;
      }
    },
    components: {
      ratingStar
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .shop-header-page
    .shop-detail-header
      overflow: hidden;
      position: relative;
      .header-cover-img
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        filter: blur(10px);
      .description-header
        position: relative;
        z-index: 10;
        background-color: rgba(119, 103, 137, .43);
        padding: 0.4rem 0 0.4rem 0.4rem;
        width: 100%;
        overflow: hidden;
        .description-top
          display: flex;
          .description-left
            margin-right: 0.3rem;
            img
              width: 2.9rem;
              height: 2.9rem;
              display: block;
              border-radius: 0.15rem;
          .description-right
            flex: 1;
            .description-title
              font-size: 0.8rem;
              color: #fff;
              font-weight: bold;
              width: 100%;
              margin-bottom: 0.3rem;
            .description-text
              font-size: 0.5rem;
              color: #fff;
              margin-bottom: 0.3rem;
            .description-promotion
              font-size: 0.5rem;
              color: #fff;
              width: 11.5rem;
          .description-arrow
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0.3rem;
            z-index: 11;
        .description-footer
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding-right: 1rem;
          p
            font-size: 0.5rem;
            color: #fff;
            span
              color: #fff;
            .tip-icon
              padding: 0 .04rem;
              border: 0.025rem solid #fff;
              border-radius: 0.1rem;
              font-size: .4rem;
              display: inline-block;
          .ellipsis
            width: 84%;
          .footer-arrow
            width: 0.45rem;
            height: 0.45rem;
            margin-top: 0.15rem;
            position: absolute;
            right: .3rem;
    .activities-details
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #262626;
      z-index: 200;
      padding: 1.25rem;
      .activities-shoptitle
        text-align: center;
        font-size: 0.8rem;
        color: #fff;
      .activities-ratingstar
        display: flex;
        justify-content: center;
        transform: scale(2.2);
        margin-top: .7rem;
      .activities-list
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        font-size: 0.5rem;
        color: #fff;
        li
          margin-bottom: .2rem;
          .activities-icon
            padding: 0 .02rem;
            display: inline-block;
            border: 0.025rem solid #fff;
            border-radius: 0.1rem;
          span
            color: #fff;
            line-height: .6rem;
    .activities-shopinfo
      p
        line-height: .7rem;
        font-size: 0.5rem;
        color: #fff;
    .activities-title-style
      text-align: center;
      margin-bottom: 1rem;
      span
        font-size: 0.5rem;
        color: #fff;
        border: 0.025rem solid #555;
        padding: .2rem .4rem;
        border-radius: 0.5rem;
    .close-activities
      position: absolute;
      bottom: 1rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    .fade-enter-active, .fade-leave-active
      transition: opacity .5s;
    .fade-enter, .fade-leave-active
      opacity: 0;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
