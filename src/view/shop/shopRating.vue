<template>
  <div id="shopRatingPage">
    <section v-load-more="loaderMoreRating" type="2">
      <section>
        <header class="rating-header">
          <section class="rating-header-left">
            <p>{{shopDetailData.rating}}</p>
            <p>综合评价</p>
            <p>高于周边商家{{(ratingScoresData.compare_rating*100).toFixed(1)}}%</p>
          </section>
          <section class="rating-header-right">
            <p>
              <span>服务态度</span>
              <rating-star :rating='ratingScoresData.service_score'></rating-star>
              <span class="rating-num">{{ratingScoresData.service_score.toFixed(1)}}</span>
            </p>
            <p>
              <span>菜品评价</span>
              <rating-star :rating='ratingScoresData.food_score'></rating-star>
              <span class="rating-num">{{ratingScoresData.food_score.toFixed(1)}}</span>
            </p>
            <p>
              <span>送达时间</span>
              <span class="delivery-time">{{shopDetailData.order_lead_time}}分钟</span>
            </p>
          </section>
        </header>
        <ul class="tag-list-ul">
          <li v-for="(item, index) in ratingTagsList" :key="index"
              :class="{'unsatisfied': item.unsatisfied, 'tagActivity': ratingTageIndex == index}"
              @click="changeTgeIndex(index, item.name)">{{item.name}}({{item.count}})
          </li>
        </ul>
        <ul class="rating-list-ul">
          <li v-for="(item, index) in ratingList" :key="index" class="rating-list-li">
            <img :src="getImgPath(item.avatar)" class="user-avatar">
            <section class="rating-list-details">
              <header>
                <section class="username-star">
                  <p class="username">{{item.username}}</p>
                  <p class="star-desc">
                    <rating-star :rating='item.rating_star'></rating-star>
                    <span class="time-spent-desc">{{item.time_spent_desc}}</span>
                  </p>
                </section>
                <time class="rated-at">{{item.rated_at}}</time>
              </header>
              <ul class="food-img-ul">
                <li v-for="(item, index) in item.item_ratings" :key="index">
                  <img :src="getImgPath(item.image_hash)" v-if="item.image_hash">
                </li>
              </ul>
              <ul class="food-name-ul">
                <li v-for="(item, index) in item.item_ratings" :key="index" class="ellipsis">
                  {{item.food_name}}
                </li>
              </ul>
            </section>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import ratingStar from 'components/common/ratingStar';
  import {getRatingList} from 'service/getData';
  import {loadMore, getImgPath} from 'components/common/mixin';
  import BScroll from 'better-scroll';

  export default {
    props: {
      changeShowType: {},
      ratingInfo: {},
      ratingScoresData: {},
      ratingTagsList: {},
      shopDetailData: {}
    },
    data() {
      return {
        ratingList: null,
        ratingOffset: 0, // 评价获取数据offset值
        ratingTageIndex: 0, // 评价分类索引
        preventRepeatRequest: false, // 防止多次出发请求数据
        ratingTagName: '', // 评论的类型
        loadRatings: false, // 加载更多评论时显示加载组件
        ratingScroll: null // 评论页scroll
      };
    },
    mounted() {
      this.ratingList = this.ratingInfo;
      this.$nextTick(() => {
        this.ratingScroll = new BScroll('#shopRatingPage', {
          click: true
        });
      });
    },
    mixins: [loadMore, getImgPath],
    methods: {
      // 获取不同类型的评论列表
      async changeTgeIndex (index, name) {
        this.ratingTageIndex = index;
        this.ratingOffset = 0;
        this.ratingTagName = name;
        let res = await getRatingList(this.ratingOffset, name);
        this.ratingList = [...res];
        this.$nextTick(() => {
          this.ratingScroll.refresh();
        });
      },
      // 加载更多评论
      async loaderMoreRating() {
        if (this.preventRepeatReuqest) {
          return;
        }
        this.loadRatings = true;
        this.preventRepeatReuqest = true;
        this.ratingOffset += 10;
        let ratingData = await getRatingList(this.ratingOffset, this.ratingTagName);
        this.ratingList = [...this.ratingList, ...ratingData];
        this.loadRatings = false;
        if (ratingData.length >= 10) {
          this.preventRepeatRequest = false;
        }
      }
    },
    watch: {
      // 商品、评论切换状态
      changeShowType: function (value) {
        if (value === 'rating') {
          this.$nextTick(() => {
            this.ratingScroll = new BScroll('#shopRatingPage', {
              probeType: 3,
              click: true
            });
            this.ratingScroll.on('scroll', (pos) => {
              if (Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
                this.loaderMoreRating();
                this.ratingScroll.refresh();
              }
            });
          });
        }
      }
    },
    components: {
      ratingStar
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #shopRatingPage
    flex: 1;
    overflow-y: hidden;
    flex-direction: column;
    .rating-header
      display: flex;
      background-color: #fff;
      padding: .8rem .5rem;
      margin-bottom: 0.5rem;
      .rating-header-left
        flex: 3;
        text-align: center;
        p:nth-of-type(1)
          font-size: 1.2rem;
          color: #f60;
        p:nth-of-type(2)
          font-size: 0.65rem;
          color: #666;
          margin-bottom: .1rem;
        p:nth-of-type(3)
          font-size: 0.4rem;
          color: #999;
      .rating-header-right
        flex: 4;
        p
          font-size: .65rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span:nth-of-type(1)
            color: #666;
            margin-right: .5rem;
          .rating-num
            width: 3rem;
            font-size: 0.55rem;
            color: #f60;
          .delivery-time
            font-size: 0.4rem;
            color: #999;
    .tag-list-ul
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      padding: .5rem;
      li
        font-size: 0.6rem;
        color: #6d7885;
        padding: .3rem .3rem;
        background-color: #ebf5ff;
        border-radius: 0.2rem;
        border: 1px;
        margin: 0 .4rem .2rem 0;
      .unsatisfied
        background-color: #f5f5f5;
        color: #aaa;
      .tagActivity
        background-color: #3190e8;
        color: #fff;
    .rating-list-ul
      background-color: #fff;
      padding: 0 .5rem;
      .rating-list-li
        border-top: 1px solid #f1f1f1;
        display: flex;
        padding: .6rem 0;
        .user-avatar
          width: 1.5rem;
          height: 1.5rem;
          border: 0.025rem;
          border-radius: 50%;
          margin-right: .8rem;
        .rating-list-details
          flex: 1;
          header
            display: flex;
            flex: 1;
            justify-content: space-between;
            margin-bottom: .3rem;
            .username-star
              font-size: 0.55rem;
              color: #666;
              .username
                color: #666;
                margin-bottom: .2rem;
              .star-desc
                display: flex;
                align-items: center;
                .time-spent-desc
                  font-size: 0.55rem;
                  color: #666;
                  margin-left: .15rem;
            .rated-at
              font-size: 0.4rem;
              color: #999;
          .food-img-ul
            display: flex;
            flex-wrap: wrap;
            margin-bottom: .4rem;
            li
              img
                width: 3rem;
                height: 3rem;
                margin-right: .4rem;
                display: block;
          .food-name-ul
            display: flex;
            flex-wrap: wrap;
            li
              font-size: 0.55rem;
              color: #999;
              width: 2.2rem;
              padding: .2rem;
              border: 0.025rem solid #ebebeb;
              border-radius: 0.15rem;
              margin-right: .3rem;
              margin-bottom: 4px;
</style>
