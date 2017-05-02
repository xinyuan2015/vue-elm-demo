<template>
  <div class="page-container">
    <head-top head-title="购买记录" go-back='true'></head-top>
    <!-- 没有办过会员卡，获取不到数据，只好写死 -->
    <section class="invoice-contianer">
      <img src="../../../assets/images/no-log.png">
      <p>没有购买记录</p>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState, mapMutations} from 'vuex';

  export default {
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'SAVE_AVANDER'
      ])
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .page-container
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 202;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
  .invoice-contianer
    display: flex;
    flex-direction: column;
    align-items: center;
    img
      width: 8rem;
      height: 5rem;
      margin-top: 5rem;
    p
      font-size: 0.6rem;
      color: #999;
      margin-top: .8rem;
</style>
