<template>
  <div class="choose-address-page">
    <head-top head-title="选择地址" go-back="true"></head-top>
    <router-link to="/confirmOrder/chooseAddress/addAddress" class="add-icon-footer">
      <img src="../../../assets/images/add_address.png" height="24" width="24">
      <span>新增收货地址</span>
    </router-link>
    <ul class="deliverable-address">
      <li v-for="(item, index) in deliverable" @click="chooseAddress(item, index)">
        <svg class="choosed-address" :class="{'default-address': defaultIndex == index}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
        <div>
          <header>
            <span>{{item.name}}</span>
            <span>{{item.sex == 1 ? '先生' : '女士'}}</span>
            <span>{{item.phone}}</span>
          </header>
          <div class="address-detail ellipsis">
            <span v-if="item.tag" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
            <p>{{item.address_detail}}</p>
          </div>
        </div>
      </li>
    </ul>
    <section id="out-delivery" v-if="deliverdisable.length">
      <header class="out-header">以下地址超出配送范围</header>
      <ul class="deliverable-address">
        <li v-for="(item,index) in deliverdisable">
          <svg class="choosed-address">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
          </svg>
          <div>
            <header>
              <span>{{item.name}}</span>
              <span>{{item.sex == 1? '先生' : '女士'}}</span>
              <span>{{item.phone}}</span>
            </header>
            <div class="address-detail ellipsis">
              <span v-if="item.tag" :style="{backgroundColor: '#ccc'}">{{item.tag}}</span>
              <p>{{item.address_detail}}</p>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import {mapState, mapMutations} from 'vuex';
  import {getAddress} from 'service/getData';

  export default {
    data() {
      return {
        addressList: [], // 地址列表
        deliverable: [], // 有效地址列表
        deliverdisable: [], // 无效地址列表
        id: null,
        sig: null,
        showAlert: false,
        alertText: null
      };
    },
    created() {
      this.id = this.$route.query.id;
      this.sig = this.$route.query.sig;
      this.initData();
    },
    computed: {
      ...mapState([
        'userInfo',
        'addressIndex',
        'newAddress'
      ]),
      // 选择地址
      defaultIndex: function() {
        if (this.addressIndex) {
          return this.addressIndex;
        } else {
          return 0;
        }
      }
    },
    methods: {
      ...mapMutations([
        'CHOOSE_ADDRESS'
      ]),
      // 初始化信息
      async initData() {
        this.addressList = [];
        this.deliverable = [];
        this.deliverdisable = [];
        if (this.userInfo && this.userInfo.user_id) {
          this.addressList = await getAddress(this.id, this.sig);
          // 将当前所有地址访问有效无效两种
          this.addressList.forEach(item => {
            if (item.is_deliverable) {
              this.deliverable.push(item);
            } else {
              this.deliverdisable.push(item);
            }
          });
        }
      },
      iconColor(name) {
        switch (name) {
          case '公司': return '#4cd964';
          case '学校': return '#3190e8';
        }
      },
      // 选择地址
      chooseAddress(address, index) {
        this.CHOOSE_ADDRESS({address, index});
        this.$router.go(-1);
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initData();
        }
      },
      newAddress: function (value) {
        this.initData();
      }
    },
    components: {
      headTop,
      alertTip
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../assets/stylus/mixin.styl";

  .choose-address-page
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f5;
    z-index: 204;
    padding-top: 1.95rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .add-icon-footer
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2.5rem;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 204;
      span
        font-size: 0.7rem;
        color: $blue;
        margin-left: .3rem;
    .deliverable-address
      background-color: #fff;
      li
        display: flex;
        align-items: center;
        border-bottom: 0.025rem solid #f5f5f5;
        padding: .7rem;
        line-height: 1rem;
        .choosed-address
          width: 0.8rem;
          height: 0.8rem;
          fill: #4cd964;
          margin-right: .4rem;
          opacity: 0;
        .default-address
          opacity: 1;
        header
          font-size: 0.7rem;
          color: #333;
          span:nth-of-type(1)
            font-size: .8rem;
            font-weight: bold;
        .address-detail
          width: 100%;
          display: flex;
          align-items: center;
          span
            font-size: 0.5rem;
            color: #fff;
            border-radius: .15rem;
            background-color: #ff5722;
            height: .6rem;
            line-height: .6rem;
            padding: 0 .2rem;
            margin-right: .3rem;
          p
            font-size: 0.6rem;
            color: #777;
    #out-delivery
      .out-header
        font-size: 0.6rem;
        color: #666;
        line-height: 1.5rem;
        padding-left: .5rem;
      *
        color: #ccc;
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
