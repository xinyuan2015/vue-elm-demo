<template>
  <div class="shopdetail-page">
    <head-top head-title="商家详情" go-back="true"></head-top>
    <section class="activities-container">
      <header>活动与属性</header>
      <ul class="actibities-ul">
        <li v-for="item in shopDetail.activities" :key="item.id">
          <span :style="{backgroundColor: '#' + item.icon_color}">{{item.icon_name}}</span>
          <span>{{item.description}}（APP专享）</span>
        </li>
      </ul>
      <ul class="actibities-ul">
        <li v-for="item in shopDetail.supports" :key="item.id">
          <span :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</span>
          <span>{{item.description}}(APP专享)</span>
        </li>
      </ul>
    </section>
    <section class="shop-status-container">
      <router-link to="/shop/shopDetail/shopSafe" class="shop-status-header">
        <span class="shop-detail-title">食品监督安全公示</span>
        <div>
          <span class="identification-detail">企业认证详情</span>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description-arrow" >
            <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </router-link>
      <section class="shop-statu-detail">
        <div>
          <svg class="shop-status" v-if="shopDetail.status == 1">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-well"></use>
          </svg>
          <svg class="res-well" v-else>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-bad"></use>
          </svg>
        </div>
        <div class="check-date">
          <p>
            <span>监督检查结果：</span>
            <span class="shop-status-well" v-if="shopDetail.status == 1">良好</span>
            <span class="shop-status-bad" v-else>差</span>
          </p>
          <p>
            <span>检查日期：</span>
            <span>{{shopDetail.identification.identificate_date.split('T')[0]}}</span>
          </p>
        </div>
      </section>
    </section>
    <section class="shop-status-info">
      <header>商家信息</header>
      <p>{{shopDetail.name}}</p>
      <p>地址：{{shopDetail.address}}</p>
      <p>营业时间：[{{shopDetail.opening_hours[0]}}]</p>
      <p @click="showLicenseImg(shopDetail.license.business_license_image)">
        <span>营业执照</span>
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description-arrow" >
          <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
        </svg></p>
      <p @click="showLicenseImg(shopDetail.license.catering_service_license_image)">
        <span>餐饮服务许可证</span>
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description-arrow" >
          <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
        </svg>
      </p>
    </section>
    <transition name="fade">
      <section class="license-container" v-if="showlicenseImg" @click="showlicenseImg = false">
        <img :src="getImgPath(licenseImg)">
      </section>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState} from 'vuex';
  import {getImgPath} from 'components/common/mixin';

  export default {
    data() {
      return {
        licenseImg: null,
        showlicenseImg: false
      };
    },
    mixins: [getImgPath],
    computed: {
      ...mapState([
        'shopDetail'
      ])
    },
    methods: {
      showLicenseImg(img) {
        this.licenseImg = img;
        this.showlicenseImg = true;
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .shopdetail-page
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 1.95rem;
    background-color: #ebebeb;
    z-index: 18;
    .activities-container
      background-color: #fff;
      margin: .4rem 0;
      padding-bottom: .6rem;
      header
        font-size: 0.75rem;
        color: #333;
        line-height: 1.8rem;
        padding-left: .6rem;
        border-bottom: 1px solid #f1f1f1;
        margin-bottom: .3rem;
      .actibities-ul
        padding: 0 .6rem;
        li
          margin-bottom: .2rem;
          span:nth-of-type(1)
            font-size: 0.45rem;
            color: #fff;
            padding: .1rem;
            border: 1px;
            border-radius: 0.1rem;
            margin-right: .2rem;
          span:nth-of-type(2)
            font-size: 0.55rem;
            color: #666;
    .shop-status-container
      background-color: #fff;
      margin-bottom: .4rem;
      .shop-status-header
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.8rem;
        padding: 0 .6rem;
        border-bottom: 0.025rem solid #f1f1f1;
        .shop-detail-title
          font-size: 0.75rem;
          color: #333;
        .identification-detail
          font-size: 0.7rem;
          color: #bbb;
          vertical-align: middle;
        svg
          width: 0.6rem;
          hieght: 0.6rem;
          vertical-align: middle;
      .shop-statu-detail
        display: flex;
        padding: .6rem;
        svg
          width: 2rem;
          height: 2rem;
          margin-right: .6rem;
        .check-date
          span
            font-size: 0.55rem;
            color: #666;
          .shop-status-well
            color: rgb(126, 211, 33);
          .shop-status-bad
            color: red;
    .shop-status-info
      background-color: #fff;
      margin-bottom: .4rem;
      header
        line-height: 1.8rem;
        padding: 0 .6rem;
        font-size: 0.75rem;
        color: #333;
        border-bottom: 0.025rem solid #f1f1f1;
      p
        font-size: 0.6rem;
        color: #666;
        padding: .7rem .6rem .7rem 0;
        margin-left: .6rem;
        border-bottom: 0.025rem solid #f5f5f5;
      span
        color: #666;
      p:nth-of-type(4)
        display: flex;
        justify-content: space-between;
      p:nth-of-type(5)
        display: flex;
        justify-content: space-between;
    .license-container
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.5);
      z-index: 101;
      img
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
