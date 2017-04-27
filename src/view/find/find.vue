<template>
  <div class="find-page">
    <head-top head-title="发现" go-back='true'></head-top>
    <section>发现</section>
    <foot-guide></foot-guide>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import footGuide from 'components/footer/footGuide';
  import {getImgPath} from 'components/common/mixin';

  export default {
    mixins: [getImgPath],
    components: {
      headTop,
      footGuide
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .find-page
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 202;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
</style>
