<template>
  <div class="hbHistory-page">
    <head-top head-title="历史红包" go-back='true'></head-top>
    <section v-if="!showLoading" id="scroll-section" class="scroll-container">
      <ul class="hongbao-list-ul">
        <li class="hongbao-list-li" v-for="item in expiredList" :key="item.id">
          <section class="list-item">
            <div class="list-item-left">
              <span>¥</span>
              <span>{{String(item.amount).split('.')[0]}}</span>
              <span>.</span>
              <span>{{String(item.amount).split('.')[1]||0}}</span>
            </div>
            <div class="list-item-right">
              <h4>{{item.name}}</h4>
              <ul>
                <li v-for="(descriptions, index) in item.descriptions" :key="index">{{descriptions}}</li>
              </ul>
            </div>
          </section>
          <footer class="list-item-footer" v-if="item.extra_limit">
            <ul>
              <li v-for="(limit, index) in item.extra_limit" :key="index">
                {{limit}}
              </li>
            </ul>
          </footer>
          <svg class="expired">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#expired"></use>
          </svg>
        </li>
      </ul>
    </section>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import {mapState, mapMutations} from 'vuex';
  import {getExpired} from 'service/getData';
  import loading from 'components/common/loading';
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        showAlert: false,
        alertText: null,
        showLoading: true,
        expiredList: null
      };
    },
    mounted () {
      this.initData();
    },
    computed: {
      ...mapState([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'CLEAR_CART'
      ]),
      async initData() {
        // 获取历史红包
        if (this.userInfo) {
          this.expiredList = await getExpired(this.userInfo.user_id);
          this.showLoading = false;
          this.$nextTick(() => {
            this.scroll = new BScroll('#scroll-section', {
              deceleration: 0.001,
              bounce: true,
              swipeTime: 1800,
              click: true
            });
          });
        }
      }
    },
    watch: {
      userInfo: function (value) {
        this.initData();
      }
    },
    components: {
      headTop,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .hbHistory-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 1.95rem;
    z-index: 203;
    background-color: #f1f1f1;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .scroll-container
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding-top: 1.95rem;
    .hongbao-list-ul
      padding: 1rem .5rem;
      .hongbao-list-li
        background: #fff url(../../../assets/images/expired.png) repeat-x ;
        background-size: .5rem .2rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
        position: relative;
        .list-item
          display: flex;
          justify-content: space-between;
          padding: 1rem 0.5rem .8rem;
          .list-item-left
            font-size: 0;
            border-right: 0.025rem dotted #ccc;
            flex: 1;
            span:nth-of-type(1)
              font-size: 0.75rem;
              color: #ccc;
              font-weight: bold;
            span:nth-of-type(2)
              font-size: 2rem;
              color: #ccc;
            span:nth-of-type(3)
              font-size: 1rem;
              color: #ccc;
              font-weight: bold;
            span:nth-of-type(4)
              font-size: 1rem;
              color: #ccc;
              font-weight: bold;
          .list-item-right
            flex: 2;
            margin-left: 1.5rem;
            h4
              font-size: 0.7rem;
              color: #ccc;
              margin-left: -.7rem;
            ul
              li
                list-style-type: disc;
                font-size: 0.4rem;
                color: #ccc;
        .list-item-footer
          background-color: #f9f9f9;
          padding: .4rem .4rem;
          border-bottom-left-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
          ul
            li
              list-style-type: disc;
              font-size: 0.4rem;
              color: #ccc;
              margin-left: .4rem;
        .expired
          fill: #ddd;
          width: 3rem;
          height: 3rem;
          top: .6rem;
          right: .2rem;
          position: absolute;
</style>
