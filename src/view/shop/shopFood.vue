<template>
  <div class="shop-food-page">
    <section class="menu-container">
      <section class="menu-left" id="wrapper-menu" ref="foodMenu">
        <ul>
          <li v-for="(item, index) in menuList" :key="index" class="menu-left-li"
              :class="{'activity-menu': currentIndex == index}" @click="selectMenu(index,$event)">
            <img :src="getImgPath(item.icon_url)" v-if="item.icon_url">
            <span>{{item.name}}</span>
            <span class="category-num" v-if="categoryNum[index] && item.type==1">{{categoryNum[index]}}</span>
          </li>
        </ul>
      </section>
      <section class="menu-right" ref="foodsList">
        <ul>
          <li v-for="(item, index) in menuList" :key="index" class="food-hook">
            <header class="menu-detail-header">
              <section class="menu-detail-header-left">
                <strong class="menu-item-title">{{item.name}}</strong>
                <span class="menu-item-description">{{item.description}}</span>
              </section>
              <span class="menu-detail-header-right" @click="showTitleDetail(index)"></span>
              <p class="description-tip" v-if="index == TitleDetailIndex">
                <span>{{item.name}}</span>
                {{item.description}}
              </p>
            </header>
            <section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu-detail-list" @click.stop.prevent="selectFood(foods,$event)">
              <router-link
                :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}"
                tag="div" class="menu-detail-link">
                <section class="menu-food-img">
                  <img :src="getImgPath(foods.image_path)">
                </section>
                <section class="menu-food-description">
                  <h3 class="food-description-head">
                    <strong class="description-foodname">{{foods.name}}</strong>
                    <ul v-if="foods.attributes.length" class="attributes-ul">
                      <li v-for="(attribute, foodindex) in foods.attributes" :key="foodindex"
                          :style="{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}"
                          :class="{'attribute-new': attribute.icon_name == '新'}">
                        <p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">
                          {{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>
                      </li>
                    </ul>
                  </h3>
                  <p class="food-description-content">{{foods.description}}</p>
                  <p class="food-description-sale-rating">
                    <span>月售{{foods.month_sales}}份</span>
                    <span>好评率{{foods.satisfy_rate}}%</span>
                  </p>
                  <p v-if="foods.activity" class="food-activity">
                    <span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                  </p>
                </section>
              </router-link>
              <footer class="menu-detail-footer">
                <section class="food-price">
                  <span>¥</span>
                  <span>{{foods.specfoods[0].price}}</span>
                  <span v-if="foods.specifications.length">起</span>
                </section>
                <buy-cart :shopId='shopId' :foods='foods' @showMoveDot="showShopCartDot" @showChooseList="showChooseList" @showReduceTip="showReduceTip"></buy-cart>
              </footer>
            </section>
          </li>
        </ul>
      </section>
    </section>
    <section class="shop-cart-container">
      <shop-cart :menu-list="menuList" :shop-detail-data="shopDetailData" :shop-id="shopId" :geohash="geohash"></shop-cart>
    </section>
    <section>
      <transition name="fade">
        <div class="specs-cover" @click="showChooseList" v-if="showSpecs"></div>
      </transition>
      <transition name="fadeBounce">
        <div class="specs-list" v-if="showSpecs">
          <header class="specs-list-header">
            <h4 class="ellipsis">{{choosedFoods.name}}</h4>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" class="specs-cancel"
                 @click="showChooseList">
              <line x1="0" y1="0" x2="16" y2="16" stroke="#666" stroke-width="1.2"/>
              <line x1="0" y1="16" x2="16" y2="0" stroke="#666" stroke-width="1.2"/>
            </svg>
          </header>
          <section class="specs-details">
            <h5 class="specs-details-title">{{choosedFoods.specifications[0].name}}</h5>
            <ul>
              <li v-for="(item, itemIndex) in choosedFoods.specifications[0].values"
                  :class="{'specs-activity': itemIndex == specsIndex}" @click="chooseSpecs(itemIndex)">
                {{item}}
              </li>
            </ul>
          </section>
          <footer class="specs-footer">
            <div class="specs-price">
              <span>¥ </span>
              <span>{{choosedFoods.specfoods[specsIndex].price}}</span>
            </div>
            <div class="specs-addto-cart"
                 @click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)">
              加入购物车
            </div>
          </footer>
        </div>
      </transition>
    </section>
    <transition name="fade">
      <p class="show-delete-tip" v-if="showDeleteTip">多规格商品只能去购物车删除哦</p>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import buyCart from 'components/common/buyCart';
  import shopCart from 'components/common/shopCart';
  import {mapState, mapMutations} from 'vuex';
  import {getImgPath} from 'components/common/mixin';
  import BScroll from 'better-scroll';

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
        TitleDetailIndex: null, // 点击展示列表头部详情
        categoryNum: [], // 商品类型右上角已加入购物车的数量
        choosedFoods: null, // 当前选中食品数据
        showSpecs: false, // 控制显示食品规格
        specsIndex: 0, // 当前选中的规格索引值
        showDeleteTip: false, // 多规格商品点击减按钮，弹出提示框
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {},
        menuScroll: null,
        foodsScroll: null
      };
    },
    created() {
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
    },
    mixins: [getImgPath],
    computed: {
      ...mapState([
        'latitude',
        'longitude',
        'cartList'
      ]),
      currentIndex: function () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods: function () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS',
        'ADD_CART',
        'REDUCE_CART',
        'INIT_BUYCART',
        'CLEAR_CART',
        'RECORD_SHOPDETAIL'
      ]),
      _initScroll: function () {
        this.menuScroll = new BScroll(this.$refs.foodMenu, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsList, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight: function () {
        let foodList = this.$refs.foodsList.getElementsByClassName('food-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      // 点击左侧食品列表标题，相应列表移动到最顶层
      selectMenu(index) {
        let foodList = this.$refs.foodsList.getElementsByClassName('food-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood: function (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.foodsList.show();
      },
      showTitleDetail(index) {
        if (this.TitleDetailIndex === index) {
          this.TitleDetailIndex = null;
        } else {
          this.TitleDetailIndex = index;
        }
      },
      // 加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      addToCart(category_id, item_id, food_id, name, price, specs) {
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      // 移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      removeOutCart(category_id, item_id, food_id, name, price, specs) {
        this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      },
      // 显示规格列表
      showChooseList(foods) {
        if (foods) {
          this.choosedFoods = foods;
        }
        this.showSpecs = !this.showSpecs;
        this.specsIndex = 0;
      },
      // 记录当前所选规格的索引值
      chooseSpecs(index) {
        this.specsIndex = index;
      },
      // 多规格商品加入购物车
      addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
        this.ADD_CART({
          shopid: this.shopId,
          category_id,
          item_id,
          food_id,
          name,
          price,
          specs,
          packing_fee,
          sku_id,
          stock
        });
        this.showChooseList();
      },
      // 显示提示，无法减去商品
      showReduceTip() {
        this.showDeleteTip = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.showDeleteTip = false;
        }, 3000);
      },
      // 添加商品后，显示购物车小球动画
      showShopCartDot(target) {
        this._drop(target);
      },
      // 触发购物车小球动画
      _drop: function (target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    watch: {},
    components: {
      buyCart,
      shopCart,
      BScroll
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .shop-food-page
    .menu-container
      display: flex;
      flex: 1;
      position: absolute;
      top: 7.4rem;
      left: 0;
      bottom: 2rem;
      overflow: hidden;
      .menu-left
        background-color: #f8f8f8;
        width: 3.8rem;
        .menu-left-li
          padding: .7rem .3rem;
          border-bottom: 0.025rem solid #ededed;
          box-sizing: border-box;
          border-left: 0.15rem solid #f8f8f8;
          position: relative;
          img
            width: 0.5rem;
            height: 0.6rem;
          span
            font-size: 0.6rem;
            color: #666;
          .category-num
            position: absolute;
            top: .1rem;
            right: .1rem;
            background-color: #ff461d;
            line-height: .6rem;
            text-align: center;
            border-radius: 50%;
            border: 0.025rem solid #ff461d;
            min-width: .6rem;
            height: .6rem;
            font-size: 0.5rem;
            color: #fff;
            font-family: Helvetica Neue, Tahoma, Arial;
        .activity-menu
          border-left: 0.15rem solid #3190e8;
          background-color: #fff;
          span:nth-of-type(1)
            font-weight: bold;
      .menu-right
        flex: 4;
        .menu-detail-header
          width: 100%;
          padding: .4rem;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .menu-detail-header-left
            width: 11rem;
            white-space: nowrap;
            overflow: hidden;
            .menu-item-title
              font-size: 0.7rem;
              color: #666;
              font-weight: bold;
            .menu-item-description
              font-size: 0.5rem;
              color: #999;
              width: 30%;
              overflow: hidden;
          .menu-detail-header-right
            width: 0.5rem;
            height: 1rem;
            display: block;
            background-image: url('../../assets/images/icon_point.png');
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-size: 100% .4rem;
            background-position: left center;
          .description-tip
            background-color: #39373a;
            opacity: 0.95;
            font-size: 0.5rem;
            color: #fff;
            position: absolute;
            top: 1.5rem;
            z-index: 14;
            width: 8rem;
            right: .2rem;
            padding: .5rem .4rem;
            border: 1px;
            border-radius: .2rem;
            span
              color: #fff;
              line-height: .6rem;
              font-size: .55rem;
          .description-tip::after
            content: '';
            position: absolute;
            width: 0.4rem;
            height: 0.4rem;
            background-color: #39373a;
            top: -.5rem;
            right: .7rem;
            transform: rotate(-45deg) translateY(.41rem);
        .menu-detail-list
          background-color: #fff;
          padding: .6rem .4rem;
          border-bottom: 1px solid #f8f8f8;
          position: relative;
          overflow: hidden;
          .menu-detail-link
            display: flex;
            .menu-food-img
              margin-right: .4rem;
              img
                width: 2rem;
                height: 2rem;
                display: block;
            .menu-food-description
              width: 100%;
              .food-description-head
                display: flex;
                justify-content: space-between;
                margin-bottom: .2rem;
                .description-foodname
                  font-size: 0.7rem;
                  color: #333;
                .attributes-ul
                  display: flex;
                  li
                    font-size: .3rem;
                    height: .6rem;
                    line-height: .35rem;
                    padding: .1rem;
                    border: 1px solid #666;
                    border-radius: 0.3rem;
                    margin-right: .1rem;
                    transform: scale(.8);
                    p
                      white-space: nowrap;
                      line-height: .4rem;
                  .attribute-new
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-color: #4cd964;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: flex-end;
                    transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                    border: none;
                    border-radius: 0;
                    p
                      font-size: 0.4rem;
                      color: #fff;
                      text-align: center;
                      flex: 1;
              .food-description-content
                font-size: 0.5rem;
                color: #999;
                line-height: .6rem;
              .food-description-sale-rating
                line-height: .8rem;
                span
                  font-size: 0.5rem;
                  color: #333;
              .food-activity
                line-height: .4rem;
                span
                  font-size: .3rem;
                  border: 1px solid currentColor;
                  border-radius: 0.3rem;
                  padding: .08rem;
                  display: inline-block;
                  transform: scale(.8);
                  margin-left: -0.35rem;
          .menu-detail-footer
            margin-left: 2.4rem;
            font-size: 0;
            margin-top: .3rem;
            display: flex;
            justify-content: space-between;
            .food-price
              span
                font-family: 'Helvetica Neue', Tahoma, Arial;
              span:nth-of-type(1)
                font-size: 0.5rem;
                color: #f60;
                margin-right: .05rem;
              span:nth-of-type(2)
                font-size: 0.7rem;
                color: #f60;
                font-weight: bold;
                margin-right: .3rem;
                span:nth-of-type(3)
                  font-size: 0.5rem;
                  color: #666;
    .screen-cover
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,.3);
      z-index: 11;
    .change-show-type
      display: flex;
      background-color: #fff;
      padding: .3rem 0 .6rem;
      border-bottom: 1px solid #ebebeb;
      div
        flex: 1;
        text-align: center;
        span
          font-size: 0.65rem;
          color: #666;
          padding: .2rem .1rem;
          border-bottom: 0.12rem solid #fff;
        .activity-show
          color: #3190e8;
          border-color: #3190e8
    .specs-cover
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.4);
      z-index: 17;
    .specs-list
      position: fixed;
      top: 35%;
      left: 15%;
      width: 70%;
      background-color: #fff;
      z-index: 18;
      border: 1px;
      border-radius: 0.2rem;
      .specs-list-header
        h4
          font-size: 0.7rem;
          color: #222;
          font-weight: normal;
          text-align: center;
          padding: .5rem;
        .specs-cancel
          position: absolute;
          right: .5rem;
          top: .5rem;
      .specs-details
        padding: .5rem;
        .specs-details-title
          font-size: 0.6rem;
          color: #666;
        ul
          display: flex;
          flex-wrap: wrap;
          padding: .4rem 0;
          li
            font-size: .6rem;
            padding: .3rem .5rem;
            border: 0.025rem solid #ddd;
            border-radius: .2rem;
            margin-right: .5rem;
          .specs-activity
            border-color: #3199e8;
            color: #3199e8;
      .specs-footer
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f9f9f9;
        padding: 0.5rem;
        border: 1px;
        border-bottom-left-radius: .2rem;
        border-bottom-right-radius: .2rem;
        .specs-price
          span
            color: #ff6000;
          span:nth-of-type(1)
            font-size: .5rem;
          span:nth-of-type(2)
            font-size: .8rem;
            font-weight: bold;
            font-family: Helvetica Neue,Tahoma;
        .specs-addto-cart
          width: 4rem;
          height: 1.3rem;
          background-color: #3199e8;
          border: 1px;
          border-radius: 0.15rem;
          font-size: 0.6rem;
          color: #fff;
          text-align: center;
          line-height: 1.3rem;
    .show-delete-tip
      position: fixed;
      top: 50%;
      left: 15%;
      width: 70%;
      transform: translateY(-50%);
      background-color: rgba(0,0,0,.8);
      z-index: 18;
      font-size: 0.65rem;
      color: #fff;
      text-align: center;
      padding: .5rem 0;
      border: 1px;
      border-radius: 0.25rem;
</style>
