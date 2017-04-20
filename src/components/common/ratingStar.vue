<template>
  <div class="rating-star">
    <section class="star-container">
      <svg class="grey-fill" v-for="num in 5" :key="num">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
      </svg>
    </section>
    <div :style="'width:' + rating*2/5 + 'rem'" class="star-overflow">
      <section class="star-container">
        <svg class="orange-fill" v-for="num in 5" :key="num">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
        </svg>
      </section>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['rating'],
    data() {
      return {};
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  .rating-star
    position: relative;
    width: 2rem;
    height: 0.4rem;
    .star-overflow
      overflow: hidden;
      position: relative;
      height: 100%;
    .star-container
      position: absolute;
      display: flex;
      width: 2rem;
      height: 0.4rem;
      top: -0.02rem;
      left: -0.02rem;
      .grey-fill
        fill: #d1d1d1;
      .orange-fill
        fill: #ff9a0d;
</style>
