<template>
  <div class="safe-shop">
    <head-top head-title="食品监督安全公示" go-back="true"></head-top>
    <section id="scroll-section" class="scroll-container">
      <section>
        <section class="shop-status-container">
          <header>食品监督安全公示</header>
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
        <section class="shop-status-container">
          <header>
            <span>工商登记信息</span>
          </header>
          <ul>
            <li>
              <p>企业名称</p>
              <p>{{shopDetail.identification.company_name}}</p>
            </li>
            <li>
              <p>工商执照注册号</p>
              <p>{{shopDetail.identification.identificate_agency}}</p>
            </li>
            <li>
              <p>注册资本</p>
              <p>{{shopDetail.identification.registered_number}}</p>
            </li>
            <li>
              <p>注册地址</p>
              <p>{{shopDetail.identification.registered_address}}</p>
            </li>
            <li>
              <p>属地监管所</p>
              <p>{{shopDetail.identification.registered_principal}}</p>
            </li>
            <li>
              <p>法定代表人</p>
              <p>{{shopDetail.identification.legal_person}}</p>
            </li>
            <li>
              <p>经营范围</p>
              <p>{{shopDetail.identification.operation_period}}</p>
            </li>
          </ul>
        </section>
        <section class="shop-status-container">
          <header>餐饮许可证</header>
          <ul>
            <li>
              <p>营业范围</p>
              <p>{{shopDetail.identification.operation_period}}</p>
            </li>
            <li>
              <p>许可证有效期</p>
              <p>{{shopDetail.identification.licenses_date}}</p>
            </li>
            <li>
              <p>许可证号</p>
              <p>{{shopDetail.identification.licenses_number}}</p>
            </li>
            <li>
              <p>发证时间</p>
              <p>{{shopDetail.identification.licenses_scope}}</p>
            </li>
            <li>
              <p>发证机关</p>
              <p>{{shopDetail.identification.registered_principal}}</p>
            </li>
          </ul>
        </section>
        <section class="license-img shop-status-container">
          <header>许可证书</header>
          <div class="img-container">
            <img :src="getImgPath(shopDetail.license.business_license_image)">
            <img :src="getImgPath(shopDetail.license.catering_service_license_image)">
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState} from 'vuex';
  import {getImgPath} from 'components/common/mixin';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {};
    },
    mixins: [getImgPath],
    mounted() {
      this.$nextTick(() => {
        this.scroll = new BScroll('#scroll-section', {
          deceleration: 0.001,
          bounce: true,
          swipeTime: 1800,
          click: true
        });
      });
    },
    computed: {
      ...mapState([
        'shopDetail'
      ])
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../../assets/stylus/mixin.styl";

  .safe-shop
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 1.95rem;
    background-color: #ebebeb;
    z-index: 102;
    .scroll-container
      width: 100%;
      height: 100%;
      .shop-status-container
        background-color: #fff;
        margin-bottom: .4rem;
        header
          line-height: 1.8rem;
          padding: 0 .6rem;
          border-bottom: 0.025rem solid #f1f1f1;
          font-size: 0.75rem;
          color: #333;
        ul
          margin-left: 1rem;
          padding: .4rem 0;
          li
            margin-bottom: .4rem;
            p
              line-height: 1rem;
            p:nth-of-type(1)
              font-size: 0.55rem;
              color: #333;
            p:nth-of-type(2)
              font-size: 0.5rem;
              color: #999;
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
      .license-img
        padding: .6rem;
        background-color: #fff;
        padding-bottom: 8rem;
        .img-container
          background-color: #ebebeb;
          img
            width: 40%;
            height: auto;
            margin: .4rem;
            vertical-align: middle;
</style>
