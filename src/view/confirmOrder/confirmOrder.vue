<template>
  <div class="confirm-order-page">
    <section v-if="!showLoading">
      <head-top head-title="确认订单" goBack="true" signin-up="confirmOrder"></head-top>
      <router-link :to="{path: '/confirmOrder/chooseAddress', query: {id: checkoutData.cart.id, sig: checkoutData.sig}}" class="address-container">
        <div class="address-empty-left">
          <svg class="location-icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="add-address" v-if="!choosedAddress">请添加一个收货地址</div>
          <div v-else class="address-detail-container">
            <header>
              <span>{{choosedAddress.name}}</span>
              <span>{{choosedAddress.sex == 1 ? '先生' : '女士'}}</span>
              <span>{{choosedAddress.phone}}</span>
            </header>
            <div class="address-detail">
              <span v-if="choosedAddress.tag" :style="{backgroundColor: iconColor(choosedAddress.tag)}">{{choosedAddress.tag}}</span>
              <p>{{choosedAddress.address_detail}}</p>
            </div>
          </div>
        </div>
        <svg class="address-empty-right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
      <section class="delivery-model container-style">
        <p class="delivery-text">送达时间</p>
        <section class="delivery-time">
          <p>尽快送达 | 预计{{checkoutData.delivery_reach_time}}</p>
          <p v-if="checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>
        </section>
      </section>
      <section class="pay-way container-style">
        <header class="header-style">
          <span>支付方式</span>
          <div class="more-type" @click="showPayWayFun">
            <span>在线支付</span>
            <svg class="address-empty-right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
        <section class="hongbo">
          <span>红包</span>
          <span>暂时只在饿了吗 APP 中支持</span>
        </section>
      </section>
      <section class="food-list">
        <header>
          <img :src="imgBaseUrl + checkoutData.cart.restaurant_info.image_path">
          <span>{{checkoutData.cart.restaurant_info.name}}</span>
        </header>
        <ul class="food-list-ul">
          <li v-for="item in checkoutData.cart.groups[0]" :key="item.id" class="food-item-style">
            <p class="food-name ellipsis">{{item.name}}</p>
            <div class="num-price">
              <span>x {{item.quantity}}</span>
              <span>¥{{item.price}}</span>
            </div>
          </li>
        </ul>
        <div class="food-item-style">
          <p class="food-name ellipsis">{{checkoutData.cart.extra[0].name}}</p>
          <div class="num-price">
            <span></span>
            <span>¥ {{checkoutData.cart.extra[0].price}}</span>
          </div>
        </div>
        <div class="food-item-style total-price">
          <p class="food-name ellipsis">订单 ¥{{checkoutData.cart.total}}</p>
          <div class="num-price">
            <span>待支付 ¥{{checkoutData.cart.total}}</span>
          </div>
        </div>
      </section>
      <section class="pay-way container-style">
        <router-link :to="{path: '/confirmOrder/remark', query: {id: checkoutData.cart.id, sig: checkoutData.sig}}" class="header-style">
          <span>订单备注</span>
          <div class="more-type">
            <span class="ellipsis">{{remarkText||inputText?remarklist:'口味、偏好等'}}</span>
            <svg class="address-empty-right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
        <router-link :to="checkoutData.invoice.is_available? '/confirmOrder/invoice': ''" class="hongbo" :class="{'support_is_available': checkoutData.invoice.is_available}">
          <span>发票抬头</span>
          <span>
              {{checkoutData.invoice.status_text}}
              <svg class="address-empty-right">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
          </span>
        </router-link>
      </section>
      <section class="confirm-order">
        <p>待支付 ¥{{checkoutData.cart.total}}</p>
        <p @click="confirmOrder">确认下单</p>
      </section>
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
      </transition>
      <transition name="slid-up">
        <div class="choose-type-Container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li v-for="item in checkoutData.payments" :key="item.id" :class="{'choose': payWayId == item.id}">
              <span>{{item.name}}<span v-if="!item.is_online_payment">{{item.description}}</span></span>
              <svg class="address-empty-right" @click="choosePayWay(item.is_online_payment, item.id)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import alertTip from 'components/common/alertTip';
  import loading from 'components/common/loading';
  import {mapState, mapMutations} from 'vuex';
  import {imgBaseUrl} from 'config/env';
  import {checkout, getAddress, placeOrders} from 'service/getData';

  export default {
    data() {
      return {
        geohash: '', // geohash位置信息
        shopId: null, // 商店id值
        showLoading: true, // 显示加载动画
        checkoutData: null, // 数据返回值
        shopCart: null, // 购物车数据
        imgBaseUrl, // 图片域名
        showPayWay: false, // 显示付款方式
        payWayId: 1, // 付款方式
        showAlert: false, // 弹出框
        alertText: null // 弹出框内容
      };
    },
    mounted() {
      if (this.geohash) {
        this.initData();
        this.SAVE_GEOHASH(this.geohash);
      }
    },
    created() {
      // 获取上个页面传过来的geohash值
      this.geohash = this.$route.query.geohash;
      // 获取上个页面传过来的shopid值
      this.shopId = this.$route.query.shopId;
      this.INIT_BUYCART();
      this.SAVE_SHOPID(this.shopId);
      // 获取当前商铺购物车信息
      this.shopCart = this.cartList[this.shopId];
    },
    computed: {
      ...mapState([
        'cartList',
        'remarkText',
        'inputText',
        'invoice',
        'choosedAddress',
        'userInfo'
      ]),
      // 备注页返回的信息进行处理
      remarklist: function () {
        let str = '';
        if (this.remarkText) {
          Object.values(this.remarkText).forEach(item => {
            str += item[1] + ', ';
          });
        }
        // 是否有自定义备注
        if (this.inputText) {
          return str + this.inputText;
        } else {
          return str.substr(0, str.lastIndexOf(', '));
        }
      }
    },
    methods: {
      ...mapMutations([
        'INIT_BUYCART',
        'SAVE_GEOHASH',
        'CHOOSE_ADDRESS',
        'NEED_VALIDATION',
        'SAVE_CART_ID_SIG',
        'SAVE_ORDER_PARAM',
        'ORDER_SUCCESS',
        'SAVE_SHOPID'
      ]),
      // 初始化数据
      async initData() {
        let newArr = [];
        Object.values(this.shopCart).forEach(categoryItem => {
          Object.values(categoryItem).forEach(itemValue => {
            Object.values(itemValue).forEach(item => {
              newArr.push({
                attrs: [],
                extra: {},
                id: item.id,
                name: item.name,
                packing_fee: item.packing_fee,
                price: item.price,
                quantity: item.num,
                sku_id: item.sku_id,
                specs: [item.specs],
                stock: item.stock
              });
            });
          });
        });
        // 检验订单是否满足条件
        this.checkoutData = await checkout(this.geohash, [newArr]);
        this.SAVE_CART_ID_SIG({cart_id: this.checkoutData.cart.id, sig: this.checkoutData.sig});
        this.initAddress();
        this.showLoading = false;
      },
      // 获取地址信息，第一个地址为默认选择地址
      async initAddress() {
        if (!(this.userInfo && this.userInfo.user_id)) {
          let addressRes = await getAddress(this.checkoutData.cart.id, this.checkoutData.sig);
          if (addressRes instanceof Array) {
            this.CHOOSE_ADDRESS({address: addressRes[0], index: 0});
          }
        }
      },
      // 显示付款方式
      showPayWayFun() {
        this.showPayWay = !this.showPayWay;
      },
      // 选择付款方式
      choosePayWay(is_online_payment, id) {
        if (is_online_payment) {
          this.showPayWay = !this.showPayWay;
          this.payWayId = id;
        }
      },
      // 地址备注颜色
      iconColor(name) {
        switch (name) {
          case '公司': return '#4cd964';
          case '学校': return '#3190e8';
        }
      },
      // 确认订单
      async confirmOrder() {
        // 用户未登陆时弹出提示框
        if (!(this.userInfo && this.userInfo.user_id)) {
          this.showAlert = true;
          this.alertText = '请登录';
          return;
        } else if (!this.choosedAddress) {
          this.showAlert = true;
          this.alertText = '请添加一个收获地址';
          return;
        }
        // 保存订单
        this.SAVE_ORDER_PARAM({
          user_id: this.userInfo.user_id,
          cart_id: this.checkoutData.cart.id,
          address_id: this.choosedAddress.id,
          description: this.remarklist,
          entities: this.checkoutData.cart.groups,
          geohash: this.geohash,
          sig: this.checkoutData.sig
        });
        // 发送订单
        let orderRes = await placeOrders(this.userInfo.user_id, this.checkoutData.cart.id, this.choosedAddress.id, this.remarklist, this.checkoutData.cart.groups, this.geohash, this.checkoutData.sig);
        // 第一次下单的手机号需要进行验证，否则直接下单成功
        if (orderRes.need_validation) {
          this.NEED_VALIDATION(orderRes);
          this.$router.push('/confirmOrder/userValidation');
        } else {
          this.ORDER_SUCCESS(orderRes);
          this.$router.push('/confirmOrder/payment');
        }
      }
    },
    watch: {
      userInfo: function (value) {
        if (value && value.user_id) {
          this.initAddress();
        }
      }
    },
    components: {
      headTop,
      alertTip,
      loading
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .confirm-order-page
    padding-top: 1.95rem;
    padding-bottom: 3rem;
    p, span
      font-family: Helvetica Neue,Tahoma,Arial;
    .container-style
      background-color: #fff;
      margin-top: .4rem;
      padding: 0 .7rem;
    .address-container
      min-height: 3.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.6rem;
      background: url(../../assets/images/address_bottom.png) left bottom repeat-x;
      background-color: #fff;
      background-size: auto 0.12rem;
      .address-empty-left
        display: flex;
        align-items: center;
        .location-icon
          width: 0.8rem;
          height: 0.8rem;
          fill: $blue;
          margin-right: 0.2rem;
        .add-address
          font-size: 0.7rem;
          color: #333;
        .address-detail-container
          margin-left: 0.2rem;
          header
            font-size: 0.65rem;
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
              font-size: 0.55rem;
              color: #777;
    .address-empty-right
      width: 0.6rem;
      height: 0.6rem;
      fill: #999;
    .delivery-model
      border-left: .2rem solid $blue;
      min-height: 4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .delivery-text
        font-size: 0.8rem;
        color: #333;
        font-weight: bold;
        padding-left: .3rem;
      .delivery-time
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        p:nth-of-type(1)
          font-size: 0.7rem;
          color: $blue;
        p:nth-of-type(2)
          font-size: 0.5rem;
          color: #fff;
          background-color: $blue;
          width: 2.4rem;
          margin-top: .5rem;
          text-align: center;
          border-radius: 0.12rem;
          padding: .1rem;
    .pay-way
      .header-style
        display: flex;
        justify-content: space-between;
        line-height: 2rem;
        span:nth-of-type(1)
          font-size: 0.7rem;
          color: #666;
        .more-type
          span:nth-of-type(1)
            font-size: 0.6rem;
            color: #aaa;
            width: 10rem;
            display: inline-block;
            text-align: right;
            vertical-align: middle;
          svg
            width: 0.5rem;
            height: 0.5rem;
            fill: #ccc;
      .hongbo
        display: flex;
        justify-content: space-between;
        border-top: 0.025rem solid #f5f5f5;
        span
          font-size: 0.6rem;
          color: #aaa;
          line-height: 2rem;
          svg
            width: 0.5rem;
            height: 0.5rem;
            vertical-align: middle;
            fill: #ccc;
        span:nth-of-type(2)
          color: #aaa;
      .support-is-available
        span
          color: #666;
    .food-list
      background-color: #fff;
      margin-top: 0.4rem;
      header
        padding: 0.7rem;
        border-bottom: 0.025rem solid #f5f5f5;
        img
          width: 1.2rem;
          height: 1.2rem;
          vertical-align: middle;
        span
          font-size: 0.5rem;
          color: #333;
      .food-list-ul
        padding-top: .5rem;
      .food-item-style
        display: flex;
        justify-content: space-between;
        line-height: 1.8rem;
        padding: 0 .7rem;
        span,p
          font-size: 0.65rem;
          color: #666;
        .food-name
          width: 10rem;
        .num-price
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span:nth-of-type(1)
            color: #f60;
      .total-price
        border-top: 0.025rem solid #f5f5f5;
    .confirm-order
      display: flex;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 2rem;
      p
        line-height: 2rem;
        font-size: 0.75rem;
        color: #fff;
      p:nth-of-type(1)
        background-color: #3c3c3c;
        flex: 5;
        padding-left: .7rem;
      p:nth-of-type(2)
        flex: 2;
        background-color: #56d176;
        text-align: center;
    .cover
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,.3);
      z-index: 203;
    .choose-type-Container
      min-height: 10rem;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 204;
      header
        background-color: #fafafa;
        font-size: 0.7rem;
        color: #333;
        text-align: center;
        line-height: 2rem;
      ul
        li
          display: flex;
          justify-content: space-between;
          padding: 0 .7rem;
          line-height: 2.5rem;
          align-items: center;
          span
            font-size: 0.7rem;
            color: #ccc;
          svg
            width: 0.8rem;
            color: 0.8rem;
            fill: #eee;
        .choose
          span
            color: #333;
          svg
            fill: #4cd964;
    .fade-enter-active, .fade-leave-active
      transition: opacity .3s;
    .fade-enter, .fade-leave-active
      opacity: 0;
    .slid_up-enter-active, .slid_up-leave-active
      transition: all .3s;
    .slid_up-enter, .slid_up-leave-active
      transform: translate3d(0,10rem,0)
    .router-slid-enter-active, .router-slid-leave-active
      transition: all .4s;
    .router-slid-enter, .router-slid-leave-active
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
</style>
