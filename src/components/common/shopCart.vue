<template>
  <div class="shop-cart-page">
    <section class="buy-cart-container">
      <section @click="toggleCartList" class="cart-icon-num">
        <div class="cart-icon-container"
             :class="{'cart-icon-activity': totalPrice > 0, 'move-in-cart': totalNum > 0}" ref="cartContainer">
          <span v-if="totalNum" class="cart-list-length">{{totalNum}}</span>
          <svg class="cart-icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
          </svg>
        </div>
        <div class="cart-num">
          <div>¥ {{totalPrice}}</div>
          <div>配送费¥{{deliveryFee}}</div>
        </div>
      </section>
      <section class="gotopay" :class="{'gotopay-acitvity': minimumOrderAmount <= 0}">
        <span class="gotopay-button-style" v-if="minimumOrderAmount > 0">还差¥{{minimumOrderAmount}}起送</span>
        <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" class="gotopay-button-style" v-else>
          去结算
        </router-link>
      </section>
    </section>
    <transition name="toggle-cart">
      <section class="cart-food-list" v-show="showCartList&&cartFoodList.length">
        <header>
          <h4>购物车</h4>
          <div @click="clearCart">
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
            </svg>
            <span class="clear-cart">清空</span>
          </div>
        </header>
        <section class="cart-food-details" id="cartFood">
          <ul>
            <li v-for="(item, index) in cartFoodList" :key="index" class="cart-food-li">
              <div class="cart-list-num">
                <p class="ellipsis">{{item.name}}</p>
                <p class="ellipsis">{{item.specs}}</p>
              </div>
              <div class="cart-list-price">
                <span>¥</span>
                <span>{{item.price}}</span>
              </div>
              <section class="cart-list-control">
                      <span
                        @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <svg>
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                <span class="cart-num">{{item.num}}</span>
                <svg class="cart-add"
                     @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
              </section>
            </li>
          </ul>
        </section>
      </section>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapMutations} from 'vuex';

  export default {
    props: {
      menuList: {
        type: Array
      },
      shopDetailData: {
        type: Object
      },
      shopId: {},
      geohash: {}
    },
    data() {
      return {
        totalPrice: 0, // 总共价格
        cartFoodList: [], // 购物车商品列表
        showCartList: false // 显示购物车列表
      };
    },
    created() {
      this.INIT_BUYCART();
    },
    computed: {
      ...mapState([
        'cartList'
      ]),
      // 配送费
      deliveryFee: function () {
        if (this.shopDetailData) {
          return this.shopDetailData.float_delivery_fee;
        } else {
          return null;
        }
      },
      // 还差多少元起送，为负数时显示去结算按钮
      minimumOrderAmount: function () {
        if (this.shopDetailData) {
          return this.shopDetailData.float_minimum_order_amount - this.totalPrice;
        } else {
          return null;
        }
      },
      // 当前商店购物信息
      shopCart: function () {
        return {...this.cartList[this.shopId]};
      },
      // 购物车中总共商品的数量
      totalNum: function () {
        let num = 0;
        this.cartFoodList.forEach(item => {
          num += item.num;
        });
        return num;
      }
    },
    methods: {
      ...mapMutations([
        'ADD_CART',
        'REDUCE_CART',
        'INIT_BUYCART',
        'CLEAR_CART'
      ]),
      // 加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      addToCart(category_id, item_id, food_id, name, price, specs) {
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      // 移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      removeOutCart(category_id, item_id, food_id, name, price, specs) {
        this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      /**
       * 初始化和shopCart变化时，重新获取购物车改变过的数据，
       * 赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，
       * 所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，
       * 使整个数据流更加清晰
       */
      initCategoryNum() {
        let newArr = [];
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodList = [];
        this.menuList.forEach((item, index) => {
          if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
              Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
                num += foodItem.num;
                if (item.type === 1) {
                  this.totalPrice += foodItem.num * foodItem.price;
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = {};
                    this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                    this.cartFoodList[cartFoodNum].item_id = itemid;
                    this.cartFoodList[cartFoodNum].food_id = foodid;
                    this.cartFoodList[cartFoodNum].num = foodItem.num;
                    this.cartFoodList[cartFoodNum].price = foodItem.price;
                    this.cartFoodList[cartFoodNum].name = foodItem.name;
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                    cartFoodNum++;
                  }
                }
              });
            });
            newArr[index] = num;
          } else {
            newArr[index] = 0;
          }
        });
        this.totalPrice = this.totalPrice.toFixed(2);
        this.categoryNum = [...newArr];
      },
      // 控制购物车列表是否显示
      toggleCartList() {
        this.cartFoodList.length ? this.showCartList = !this.showCartList : true;
      },
      // 清除购物车
      clearCart () {
        this.toggleCartList();
        this.CLEAR_CART(this.shopId);
      }
    },
    watch: {
      shopCart: function () {
        this.initCategoryNum();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shop-cart-page
    .buy-cart-container
      position: absolute;
      background-color: #3d3d3f;
      bottom: 0;
      left: 0;
      z-index: 13;
      display: flex;
      width: 100%;
      height: 2rem;
      .cart-icon-num
        flex: 1;
        .cart-icon-container
          display: flex;
          background-color: #3d3d3f;
          position: absolute;
          padding: .4rem;
          border: 0.18rem solid #444;
          border-radius: 50%;
          left: .5rem;
          top: -.7rem;
          .cart-icon
            width: 1.2rem;
            height: 1.2rem;
          .cart-list-length
            position: absolute;
            top: -.25rem;
            right: -.25rem;
            background-color: #ff461d;
            line-height: .7rem;
            text-align: center;
            border-radius: 50%;
            border: 0.025rem solid #ff461d;
            min-width: .7rem;
            height: .7rem;
            font-size: 0.5rem;
            color: #fff;
            font-family: Helvetica Neue,Tahoma,Arial;
        .move-in-cart
          animation: mymove .5s ease-in-out;
        .cart-icon-activity
          background-color: #3190e8;
        .cart-num
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 3.5rem;
          div
            color: #fff;
          div:nth-of-type(1)
            font-size: .8rem;
            font-weight: bold;
            margin-bottom: .1rem;
          div:nth-of-type(2)
            font-size: .4rem;
      .gotopay
        position: absolute;
        right: 0;
        background-color: #535356;
        width: 5rem;
        height: 100%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        .gotopay-button-style
          font-size: 0.7rem;
          color: #fff;
          font-weight: bold;
      .gotopay-acitvity
        background-color: #4cd964;
    .cart-food-list
      position: fixed;
      width: 100%;
      padding-bottom: 2rem;
      z-index: 12;
      bottom: 0;
      left: 0;
      background-color: #fff;
      header
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .3rem .6rem;
        background-color: #eceff1;
        svg
          width: 0.6rem;
          height: 0.6rem;
          vertical-align: middle;
        h4
          font-size: 0.7rem;
          color: #666;
        .clear-cart
          font-size: 0.6rem;
          color: #666;
      .cart-food-details
        background-color: #fff;
        max-height: 20rem;
        overflow-y: auto;
        .cart-food-li
          display: flex;
          justify-content: space-between;
          padding: .6rem .5rem;
          .cart-list-num
            width: 55%;
            p:nth-of-type(1)
              font-size: 0.7rem;
              color: #666;
              font-weight: bold;
            p:nth-of-type(2)
              font-size: 0.4rem;
              color: #666;
          .cart-list-price
            font-size: 0;
            span:nth-of-type(1)
              font-size: 0.6rem;
              color: #f60;
              font-family: Helvetica Neue,Tahoma;
            span:nth-of-type(2)
              font-size: 0.7rem;
              color: #f60;
              font-family: Helvetica Neue,Tahoma;
              font-weight: bold;
          .cart-list-control
            display: flex;
            align-items: center;
            span
              display: flex;
              align-items: center;
              justify-content: center;
            svg
              width: 0.9rem;
              height: 0.9rem;
              fill: #3190e8;
            .specs-reduce-icon
              fill: #999;
            .cart-num
              font-size: 0.65rem;
              color: #666;
              min-width: 1rem;
              text-align: center;
              font-family: Helvetica Neue,Tahoma;
</style>
