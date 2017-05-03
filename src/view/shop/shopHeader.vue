<template>
  <div class="shop-header-page">
    
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        geohash: '',  // geohash位置信息
        shopId: null, // 商店id
        showLoading: true // 显示加载动画
      };
    },
    components: {
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
</style>
