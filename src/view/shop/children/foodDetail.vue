<template>
  <div class="rating-page">
    <head-top :head-title="name" go-back="true"></head-top>
    <section class="header-img">
      <img :src="getImgPath(image_path)" class="food-img">
      <div class="cover"></div>
      <p class="description">{{description}}</p>
    </section>
    <section class="detail-container">
      <section class="detail-left">
        <p>{{name}}</p>
        <div class="rating-sale">
          <span>评分</span>
          <rating-star :rating="rating"></rating-star>
          <span>{{rating.toFixed(1)}}</span>
        </div>
        <p>
          <span>月售 {{month_sales}} 单</span>
          <span>售价 {{foods.specfoods[0].price}}</span>
          <span v-if="foods.specfoods.length">起</span>
        </p>
        <p>
          <span>评论数 {{rating_count}}</span>
          <span>好评率 {{satisfy_rate}}%</span>
        </p>
      </section>
      <buy-cart :shopId='shopId'  :foods='foods' @moveInCart="$emit('moveInCart')"></buy-cart>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {getImgPath} from 'components/common/mixin';
  import ratingStar from 'components/common/ratingStar';
  import buyCart from 'components/common/buyCart';

  export default {
    data() {
      return {
        image_path: null,
        description: null,
        month_sales: null,
        name: null,
        rating: null,
        rating_count: null,
        satisfy_rate: null,
        foods: null,
        shopId: null
      };
    },
    mixins: [getImgPath],
    created() {
      this.image_path = this.$route.query.image_path;
      this.description = this.$route.query.description;
      this.month_sales = this.$route.query.month_sales;
      this.name = this.$route.query.name;
      this.rating = this.$route.query.rating;
      this.rating_count = this.$route.query.rating_count;
      this.satisfy_rate = this.$route.query.satisfy_rate;
      this.foods = this.$route.query.foods;
      this.shopId = this.$route.query.shopId;
    },
    components: {
      headTop,
      ratingStar,
      buyCart
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .rating-page
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 10;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .header-img
      position: relative;
      .food-img
        width: 100%;
        display: block;
      .cover
        box-shadow: 0px -74px 100px #ddd inset;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      .description
        position: absolute;
        font-size: 0.6rem;
        color: #666;
        line-height: .8rem;
        bottom: .2rem;
        padding: 0 .4rem;
    .detail-container
      padding: .5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .detail-left
        p:nth-of-type(1)
          font-size: 0.7rem;
          color: #333;
          margin-bottom: .2rem;
        .rating-sale
          display: flex;
          align-items: center;
          span:nth-of-type(1)
            font-size: 0.6rem;
            color: #666;
            margin-right: .2rem;
          span:nth-of-type(2)
            font-size: 0.55rem;
            color: #f60;
            margin-left: .2rem;
          span:nth-of-type(3)
            font-size: 0.6rem;
            color: #666;
            margin-left: .4rem;
        p:nth-of-type(2)
          font-size: 0;
          margin-top: .3rem;
          span:nth-of-type(1)
            font-size: 0.6rem;
            color: #666;
            margin-right: .4rem;
          span:nth-of-type(2)
            font-size: 0.6rem;
            color: #f60;
            margin-right: .2rem;
          span:nth-of-type(3)
            font-size: 0.6rem;
            color: #f60;
            margin-right: .2rem;
        p:nth-of-type(3)
          span
            font-size: 0.6rem;
            color: #666;
</style>
