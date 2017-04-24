<template>
  <div class="food-page">
    <head-top :head-title="headTitle" goBack="true"></head-top>
    <section class="sort-container">
      <div class="sort-item" :class="{'choose-type':sortBy == 'food'}">
        <div class="sort-item-container" @click="chooseType('food')">
          <div class="sort-item-border">
            <span :class="{'category-title':sortBy == 'food'}">{{foodTitle}}</span>
            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort-icon">
              <polygon points="0,3 10,3 5,8"/>
            </svg>
          </div>
        </div>
        <transition name="showlist" v-show="category">
          <section v-show="sortBy == 'food'" class="category-container sort-detail-type">
            <section class="category-left">
              <ul>
                <li v-for="(item, index) in category" :key="index" class="category-left-li"
                    :class="{'category-active':restaurant_category_id == item.id}"
                    @click="selectCategoryName(item.id, index)">
                  <section>
                    <img :src="getImgPath(item.image_url)" v-if="index" class="category-icon">
                    <span>{{item.name}}</span>
                  </section>
                  <section>
                    <span class="category-count">{{item.count}}</span>
                    <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1"
                         class="category-arrow">
                      <path d="M0 0 L6 4 L0 8" stroke="#bbb" stroke-width="1" fill="none"/>
                    </svg>
                  </section>
                </li>
              </ul>
            </section>
            <section class="category-right">
              <ul>
                <li v-for="(item, index) in categoryDetail" :key="item.id" class="category-right-li"
                    @click="getCategoryIds(item.id, item.name)"
                    :class="{'category-right-choosed':restaurant_category_ids == item.id || (!restaurant_category_ids)&&index==0}">
                  <span>{{item.name}}</span>
                  <span>{{item.count}}</span>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </div>
      <div class="sort-item" :class="{'choose-type':sortBy=='sort'}">
        <div class="sort-item-container" @click="chooseType('sort')">
          <div class="sort-item-border">
            <span :class="{'category-title':sortBy=='sort'}">排序</span>
            <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort-icon">
              <polygon points="0,3 10,3 5,8"/>
            </svg>
          </div>
        </div>
        <transition name="showlist">
          <section v-show="sortBy=='sort'" class="sort-detail-type">
            <ul class="sort-list-container" @click="sortList($event)">
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#default"></use>
                </svg>
                <p data="0" :class="{'sort-select':sortByType==0}">
                  <span>智能排序</span>
                  <svg v-if="sortByType == 0">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#distance"></use>
                </svg>
                <p data="5" :class="{'sort-select':sortByType==5}">
                  <span>距离最近</span>
                  <svg v-if="sortByType == 5">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#hot"></use>
                </svg>
                <p data="6" :class="{'sort-select':sortByType==6}">
                  <span>销量最高</span>
                  <svg v-if="sortByType == 6">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#price"></use>
                </svg>
                <p data="1" :class="{'sort-select':sortByType==1}">
                  <span>起送价最低</span>
                  <svg v-if="sortByType == 1">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#speed"></use>
                </svg>
                <p data="2" :class="{'sort-select': sortByType == 2}">
                  <span>配送速度最快</span>
                  <svg v-if="sortByType == 2">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
              <li class="sort-list-li">
                <svg>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rating"></use>
                </svg>
                <p data="3" :class="{'sort-select': sortByType == 3}">
                  <span>评分最高</span>
                  <svg v-if="sortByType == 3">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                </p>
              </li>
            </ul>
          </section>
        </transition>
      </div>
      <div class="sort-item" :class="{'choose-type':sortBy=='activity'}">
        <div class="sort-item-container" @click="chooseType('activity')">
          <span :class="{'category-title':sortBy=='activity'}">筛选</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort-icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </div>
        <transition name="showlist">
          <section v-show="sortBy=='activity'" class="sort-detail-type filter-container">
            <section style="width:100%;">
              <header class="filter-header-style">配送方式</header>
              <ul class="filter-ul">
                <li v-for="item in Delivery" :key="item.id" class="filter-li" @click="selectDeliveryMode(item.id)">
                  <svg :style="{opacity: (item.id == 0)&&(delivery_mode !== 0)? 0: 1}">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="delivery_mode == item.id? '#selected':'#fengniao'"></use>
                  </svg>
                  <span :class="{'selected-filter': delivery_mode == item.id}">{{item.text}}</span>
                </li>
              </ul>
            </section>
            <section style="width:100%;">
              <header class="filter-header-style">商家属性（可以多选）</header>
              <ul class="filter-ul" style="paddingBottom: 0.5rem;">
                <li v-for="(item,index) in Activity" :key="item.id" class="filter-li" @click="selectSupportIds(index, item.id)">
                  <svg v-show="support_ids[index].status" class="activity-svg">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                  </svg>
                  <span class="filter-icon" :style="{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}" v-show="!support_ids[index].status">{{item.icon_name}}</span>
                  <span :class="{'selected-filter': support_ids[index].status}">{{item.name}}</span>
                </li>
              </ul>
            </section>
            <footer class="confirm-filter">
              <div class="clear-all filter-button-style" @click="clearAll">清空</div>
              <div class="confirm-select filter-button-style" @click="confirmSelectFun">确定</div>
            </footer>
          </section>
        </transition>
      </div>
    </section>
    <transition name="showcover">
      <div class="back-cover" v-show="sortBy"></div>
    </transition>
    <section class="shop-list-container">
      <shop-list :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType='sortByType' :deliveryMode="delivery_mode" :confirmSelect="confirmStatus" :supportIds="support_ids" v-if="latitude" @DidConfrim="clearAll"></shop-list>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head';
  import shopList from 'components/common/shoplist';
  import {mapState, mapMutations} from 'vuex';
  import {getImgPath} from 'components/common/mixin';
  import {msiteAdress, foodCategory, foodDelivery, foodActivity} from 'service/getData';

  export default {
    data() {
      return {
        geohash: '', // city页面传递过来的地址geohash
        headTitle: '', // msite页面头部标题
        foodTitle: '', // 排序左侧头部标题
        restaurant_category_id: '', // 食品类型id值
        restaurant_category_ids: '', // 筛选类型的id
        sortBy: '', // 筛选条件
        category: null, // category分类左侧数据
        categoryDetail: null, // category分类右侧的详细数据
        sortByType: null, // 根据何种方式排序
        Delivery: null, // 配送方式数据
        Activity: null, // 商家支持活动数据
        delivery_mode: null, // 选中的配送方式
        support_ids: [], // 选中的商铺活动列表
        filterNum: 0, // 所选中的所有样式的集合
        confirmStatus: false // 确认选择
      };
    },
    mixins: [getImgPath],
    created() {
      this.initData();
    },
    computed: {
      ...mapState([
        'latitude',
        'longitude'
      ])
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS'
      ]),
      // 初始化获取数据
      async initData() {
        // 获取从msite页面传递过来的参数
        this.geohash = this.$route.query.geohash;
        this.headTitle = this.$route.query.title;
        this.foodTitle = this.headTitle;
        this.restaurant_category_id = this.$route.query.restaurant_category_id;
        // 防止页面刷新时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
        if (!this.latitude) {
          // 获取位置信息
          let res = await msiteAdress(this.geohash);
          // 记录当前经度纬度到vuex
          this.RECORD_ADDRESS(res);
        }
        // 获取category分类左侧数据
        this.category = await foodCategory(this.latitude, this.longitude);
        // 初始化时定位当前category分类左侧默认选项，在右侧展示出其sub_categoriew列表
        this.category.forEach(item => {
          if (this.restaurant_category_id === item.id) {
            this.categoryDetail = item.sub_categories;
          }
        });
        // 获取筛选列表的配送方式
        this.Delivery = await foodDelivery(this.latitude, this.longitude);
        // 获取筛选列表的商铺活动
        this.Activity = await foodActivity(this.latitude, this.longitude);
        // 记录support_ids的状态，默认不选中，点击状态取反，status为true时为选中状态
        this.Activity.forEach((item, index) => {
          this.support_ids[index] = {status: false, id: item.id};
        });
      },
      // 点击顶部三个选项，展开不同的列表，选中当前选项进行展示，同时收回其他选项
      async chooseType(type) {
        if (this.sortBy !== type) {
          this.sortBy = type;
          // food选项中头部标题发生改变，需要特殊处理
          if (type === 'food') {
            this.foodTitle = '分类';
          } else {
            // 将foodTitle和headTitle进行同步
            this.foodTitle = this.headTitle;
          }
        } else {
          // 再次点击相同选项时收回列表
          this.sortBy = '';
          if (type === 'food') {
            // 将foodTitle和headTitle进行同步
            this.foodTitle = this.headTitle;
          }
        }
      },
      // 选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
      selectCategoryName(id, index) {
        // 第一个选项 -- 全部商家，因为没有自己的列表，所以点击则默认获取所有数据
        if (index === 0) {
          this.restaurant_category_ids = null;
          this.sortBy = '';
        } else {
          // 不是第一个选项时，右侧展示其子级sub_categories的列表
          this.restaurant_category_id = id;
          this.categoryDetail = this.category[index].sub_categories;
        }
      },
      // 选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
      getCategoryIds(id, name) {
        this.restaurant_category_ids = id;
        this.sortBy = '';
        this.foodTitle = this.headTitle = name;
      },
      // 点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
      sortList(event) {
        this.sortByType = event.target.getAttribute('data');
        this.sortBy = '';
      },
      // 筛选选项中的配送方式选择
      selectDeliveryMode(id) {
        // delivery_mode为空时，选中当前项，并且filterNum加一
        if (this.delivery_mode === null) {
          this.filterNum++;
          this.delivery_mode = id;
        } else if (this.delivery_mode === id) {
          // delivery_mode为当前已有值时，清空所选项，并且filterNum减一
          this.filterNum--;
          this.delivery_mode = null;
        } else {
          // delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
          this.delivery_mode = id;
        }
      },
      // 点击商家活动，状态取反
      selectSupportIds(index, id) {
        // 数组替换新的值
        this.support_ids.splice(index, 1, {status: !this.support_ids[index].status, id: id});
        // 重新计算filterNum的个数
        this.filterNum = this.delivery_mode === null ? 0 : 1;
        this.support_ids.forEach(item => {
          if (item.status) {
            this.filterNum++;
          }
        });
      },
      // 点击取消或者确认时，需要清空当前已选的状态值
      clearAll() {
        this.delivery_mode = null;
        this.support_ids.map((item) => {
          item.status = false;
        });
        this.filterNum = 0;
      },
      // 点击确认时，将需要筛选的id值传递给自组件，并收回列表
      confirmSelectFun() {
        // 状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
        this.confirmStatus = !this.confirmStatus;
        this.sortBy = '';
      }
    },
    components: {
      headTop,
      shopList
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";

  .food-page
    padding-top: 3.6rem;
    .sort-container
      background-color: #fff;
      border-bottom: 0.025rem solid #f1f1f1;
      position: fixed;
      top: 1.95rem;
      right: 0;
      width: 100%;
      display: flex;
      z-index: 13;
      box-sizing: border-box;
      .sort-item
        width: 33.3%;
        height: 1.6rem;
        font-size: 0.55rem;
        color: #444;
        text-align: center;
        line-height: 1rem;
        .sort-item-container
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 14;
          background-color: #fff;
          box-sizing: border-box;
          padding-top: 0.3rem;
          .sort-item-border
            height: 1rem;
            border-right: 0.025rem solid $bc;
        .sort-icon
          vertical-align: middle;
          transition: all 0.3rem;
          span: #666;
      .choose-type
        .sort-item-container
          .category-title
            color: $blue;
          .sort-icon
            transform: rotate(180deg);
            fill:$blue;
    .showlist-enter-active, .showlist-leave-active
      transition: all .3s;
      transform: translateY(0);
    .showlist-enter, .showlist-leave-active
      opacity: 0;
      transform: translateY(-100%);
    .sort-detail-type
      width: 100%;
      position: absolute;
      display:flex;
      top: 1.6rem;
      left: 0;
      border-top: 0.025rem solid $bc;
      background-color: #fff;
    .category-container
      .category-left
        flex: 1;
        background-color: #f1f1f1;
        height: 16rem;
        overflow-y: auto;
        span
          font-size: 0.5rem;
          color: #666;
          line-height: 1.8rem;
        .category-left-li
          display: flex;
          justify-content: space-between;
          padding: 0 0.5rem;
          .category-icon
            width: 0.8rem;
            height: 0.8rem;
            vertical-align: middle;
            margin-right: 0.2rem;
          .category-count
            background-color: #ccc;
            font-size: 0.4rem;
            color: #fff;
            padding: 0 .1rem;
            border: 0.025rem solid #ccc;
            border-radius: 0.8rem;
            vertical-align: middle;
            margin-right: 0.25rem;
          .category_arrow
            vertical-align: middle;
        .category-active
          background-color: #fff;
      .category-right
        flex: 1;
        background-color: #fff;
        padding-left: 0.5rem;
        height: 16rem;
        overflow-y: auto;
        .category-right-li
          display: flex;
          justify-content: space-between;
          height: 1.8rem;
          line-height: 1.8rem;
          padding-right: 0.5rem;
          border-bottom: 0.025rem solid $bc;
          span
            color: #666;
        .category-right-choosed
          span
            color: $blue;
    .sort-list-container
      width: 100%;
      .sort-list-li
        height: 2.5rem;
        display: flex;
        align-items: center;
        svg
          width: 0.7rem;
          height: 0.7rem;
          margin:0 .3rem 0 .8rem;
        p
          line-height: 2.5rem;
          flex: auto;
          text-align: left;
          text-indent: 0.25rem;
          border-bottom: 0.025rem solid $bc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span
            color: #666;
        .sort-select
          span
            color: $blue;
    .filter-container
      flex-direction: column;
      align-items: flex-start;
      min-height: 10.6rem;
      background-color: #f1f1f1;
      .filter-header-style
        font-size: 0.4rem;
        color: #333;
        line-height: 1.5rem;
        height: 1.5rem;
        text-align: left;
        padding-left: .5rem;
        background-color: #fff;
      .filter-ul
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.5rem;
        background-color: #fff;
        .filter-li
          display: flex;
          align-items: center;
          border: 0.025rem solid #eee;
          width: 4.7rem;
          height: 1.4rem;
          margin-right: 0.25rem;
          border-radius: 0.125rem;
          padding: 0 0.25rem;
          margin-bottom: 0.25rem;
          svg
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 0.125rem;
          span
            font-size: 0.4rem;
            color: #333;
          .filter-icon
            width: 0.8rem;
            height: 0.8rem;
            font-size: 0.5rem;
            border: 0.025rem solid $bc;
            border-radius: 0.15rem;
            margin-right: 0.25rem;
            line-height: .8rem;
            text-align: center;
          .activity-svg
            margin-right: .25rem;
          .selected-filter
            color: $blue;
      .confirm-filter
        display: flex;
        background-color: #f1f1f1;
        width: 100%;
        padding: .3rem .2rem;
        .filter-button-style
          width: 50%;
          height: 1.8rem;
          font-size: 0.8rem;
          line-height: 1.8rem;
          border-radius: 0.2rem;
        .clear-all
          background-color: #fff;
          margin-right: .5rem;
          border: 0.025rem solid #fff;
        .confirm-select
          background-color: #56d176;
          color: #fff;
          border: 0.025rem solid #56d176;
          span
            color: #fff;
    .showcover-enter-active, .showcover-leave-active
      transition: opacity .3s
    .showcover-enter, .showcover-leave-active
      opacity: 0
    .back-cover
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 10;
      background-color: rgba(0,0,0,0.3);
</style>
