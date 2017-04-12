<template>
  <div>
    <head-top signin-up="home">
      <span slot="logo" class="head-logo" @click="reload">ele.me</span>
    </head-top>
    <nav class="city-nav">
      <div class="city-tip">
        <span>当前定位城市:</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/' + guessCityid" class="guess-city">
        <span>{{guessCity}}</span>
        <svg class="arrow-right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
    </nav>
    <section id="hot-city-container">
      <h4 class="city-title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link tag="li" v-for="item in hotcity" :to="'/city/' + item.id" :key="item.id">
          {{item.name}}
        </router-link>
      </ul>
    </section>
    <section class="group-city-container">
      <ul class="letter-classify">
        <li v-for="(value, key, index) in sortgroupcity" :key="key" class="letter-classify-li">
          <h4 class="city-title">{{key}}
            <span v-if="index == 0">（按字母排序）</span>
          </h4>
          <ul class="groupcity-name-container citylistul clear">
            <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
              {{item.name}}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import headTop from 'components/header/head.vue';
  import {cityGuess, hotcity, groupcity} from 'service/getData';

  export default {
    data() {
      return {
        guessCity: '', // 当前城市
        guessCityid: '', // 当前城市id
        hotcity: [], // 热门城市列表
        groupcity: {} // 所有城市列表
      };
    },
    mounted() {
      // 获取当前城市
      cityGuess().then(res => {
        this.guessCity = res.name;
        this.guessCityid = res.id;
      });
      // 获取热门城市
      hotcity().then(res => {
        this.hotcity = res;
      });
      // 获取所有城市
      groupcity().then(res => {
        this.groupcity = res;
      });
    },
    computed: {
      // 将获取的数据按照A-Z字母开头排序
      sortgroupcity() {
        let sortobj = {};
        for (let i = 65; i <= 90; i++) {
          if (this.groupcity[String.fromCharCode(i)]) {
            sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
          }
        }
        return sortobj;
      }
    },
    methods: {
      // 点击图标刷新页面
      reload() {
        window.location.reload();
      }
    },
    components: {
      headTop
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/mixin.styl";
  .head-logo
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0.4rem;
    width: 2.3rem;
    height: 0.7rem;
    font-size: 0.7rem;
    line-height: 0.7rem;
    color: #fff;
    font-weight: 400;

  .city-nav
    padding-top: 2.35rem;
    border-top: 1px solid $bc;
    background-color: #fff;
    margin-bottom: 0.4rem;
    .city-tip
      display: flex;
      justify-content: space-between;
      line-height: 1.45rem;
      padding: 0 0.45rem;
      span:nth-of-type(1)
        font-size: 0.55rem;
        color: #666;
      span:nth-of-type(2)
        font-weight: 900;
        font-size: 0.475rem;
        color: #9f9f9f;
    .guess-city
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.8rem;
      padding: 0 0.45rem;
      border-top: 1px solid $bc;
      border-bottom: 2px solid $bc;
      font-size: 0.75rem;
      line-height: 1.8rem;
      span:nth-of-type(1)
        color: $blue;
      .arrow-right
        width: 0.6rem;
        height: 0.6rem;
        fill: #999;
  #hot-city-container
    background-color: #fff;
    margin-bottom: 0.4rem;
  .citylistul
    li
      float: left;
      text-align: center;
      color: $blue;
      border-bottom: 0.025rem solid $bc;
      border-right: 0.025rem solid $bc;
      width: 25%;
      height: 1.75rem;
      font-size: 0.6rem;
      line-height: 1.75rem;
    li:nth-of-type(4n)
      border-right: none;
  .city-title
    color: #666;
    font-weight: 400;
    text-indent: 0.45rem;
    border-top: 2px solid $bc;
    border-bottom: 1px solid $bc;
    font-size: 0.55rem;
    line-height: 1.45rem;
    font-family: "Helvetica Neue";
    span
      font-size: 0.475rem;
      color: #999;
  .letter-classify-li
    margin-bottom: 0.4rem;
    background-color: #fff;
    border-bottom: 1px solid $bc;
    .groupcity-name-container
      li
        color: #666;
</style>
